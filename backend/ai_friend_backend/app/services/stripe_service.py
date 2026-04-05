import logging
import stripe
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.subscription import Subscription
from app.models.user import User
from app.config import settings

logger = logging.getLogger(__name__)


class StripeService:
    """Сервис для работы со Stripe"""
    
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY
    
    async def create_checkout_session(
        self, 
        db: AsyncSession, 
        user: User, 
        plan_type: str = "monthly"
    ) -> dict:
        """Создать сессию checkout для оплаты"""
        
        # Определяем Price ID в зависимости от плана
        price_id = (
            settings.STRIPE_PRICE_ID_YEARLY 
            if plan_type == "yearly" 
            else settings.STRIPE_PRICE_ID_MONTHLY
        )
        
        if not price_id:
            raise ValueError(f"Price ID для плана {plan_type} не настроен")
        
        # Создаём или получаем подписку в БД
        result = await db.execute(
            select(Subscription).where(Subscription.user_id == user.id)
        )
        subscription = result.scalar_one_or_none()
        
        if not subscription:
            subscription = Subscription(
                user_id=user.id,
                plan_type=plan_type,
                payment_provider="stripe"
            )
            db.add(subscription)
            await db.flush()
        else:
            subscription.plan_type = plan_type
            await db.flush()
        
        # Создаём сессию checkout
        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',  # Подписка (рекуррентные платежи)
                success_url=f"{settings.FRONTEND_URL}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{settings.FRONTEND_URL}/subscription/cancel",
                client_reference_id=str(user.id),
                metadata={
                    'user_id': str(user.id),
                    'subscription_id': str(subscription.id),
                    'plan_type': plan_type,
                },
                customer_email=user.email,  # Автозаполнение email
            )
            
            # Сохраняем ID сессии в подписку
            subscription.subscription_id = checkout_session.id
            await db.flush()
            
            logger.info(f"Created checkout session {checkout_session.id} for user {user.id}")
            
            return {
                "checkout_url": checkout_session.url,
                "session_id": checkout_session.id,
            }
            
        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {e}")
            raise ValueError(f"Ошибка Stripe: {str(e)}")
    
    async def handle_webhook(self, payload: bytes, sig_header: str) -> dict:
        """Обработка webhook от Stripe"""
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, stripe.error.SignatureVerificationError) as e:
            logger.error(f"Invalid webhook signature: {e}")
            raise ValueError("Invalid webhook signature")
        
        # Обрабатываем разные типы событий
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            await self._handle_checkout_completed(session)
            
        elif event['type'] == 'customer.subscription.created':
            subscription_data = event['data']['object']
            await self._handle_subscription_created(subscription_data)
            
        elif event['type'] == 'customer.subscription.updated':
            subscription_data = event['data']['object']
            await self._handle_subscription_updated(subscription_data)
            
        elif event['type'] == 'customer.subscription.deleted':
            subscription_data = event['data']['object']
            await self._handle_subscription_deleted(subscription_data)
        
        return {"status": "success"}
    
    async def _handle_checkout_completed(self, session: dict):
        """Обработка успешного завершения checkout"""
        logger.info(f"Checkout completed: {session['id']}")
        # Подписка активируется в _handle_subscription_created
    
    async def _handle_subscription_created(self, subscription_data: dict):
        """Активация подписки после создания"""
        from app.database import async_session_maker
        
        customer_id = subscription_data['customer']
        stripe_subscription_id = subscription_data['id']
        
        # Получаем сессию checkout по subscription_id
        session = stripe.checkout.Session.retrieve(subscription_data['checkout_session'])
        user_id = int(session['client_reference_id'])
        
        async with async_session_maker() as db:
            result = await db.execute(
                select(Subscription).where(Subscription.user_id == user_id)
            )
            subscription = result.scalar_one_or_none()
            
            if subscription:
                subscription.is_premium = True
                subscription.subscription_id = stripe_subscription_id
                subscription.payment_provider = "stripe"
                
                # Устанавливаем дату окончания
                from app.utils.datetime import utcnow, utcnow_plus
                if subscription_data['current_period_end']:
                    from datetime import datetime, timezone
                    subscription.expires_at = datetime.fromtimestamp(subscription_data['current_period_end'], tz=timezone.utc).replace(tzinfo=None)
                else:
                    subscription.expires_at = utcnow_plus(days=30)
                
                await db.flush()
                logger.info(f"Activated premium for user {user_id} via Stripe")
    
    async def _handle_subscription_updated(self, subscription_data: dict):
        """Обновление подписки"""
        from app.database import async_session_maker
        from datetime import datetime, timezone

        stripe_subscription_id = subscription_data['id']

        async with async_session_maker() as db:
            result = await db.execute(
                select(Subscription).where(Subscription.subscription_id == stripe_subscription_id)
            )
            subscription = result.scalar_one_or_none()

            if subscription:
                # Если подписка активна
                if subscription_data['status'] == 'active':
                    subscription.is_premium = True
                    if subscription_data['current_period_end']:
                        subscription.expires_at = datetime.fromtimestamp(subscription_data['current_period_end'], tz=timezone.utc).replace(tzinfo=None)
                # Если отменена
                elif subscription_data['status'] == 'canceled':
                    subscription.is_premium = False

                await db.flush()
    
    async def _handle_subscription_deleted(self, subscription_data: dict):
        """Удаление подписки"""
        from app.database import async_session_maker
        
        stripe_subscription_id = subscription_data['id']
        
        async with async_session_maker() as db:
            result = await db.execute(
                select(Subscription).where(Subscription.subscription_id == stripe_subscription_id)
            )
            subscription = result.scalar_one_or_none()
            
            if subscription:
                subscription.is_premium = False
                await db.flush()
                logger.info(f"Deactivated premium for subscription {stripe_subscription_id}")
    
    async def create_portal_session(self, user_id: int) -> dict:
        """Создать сессию для управления подпиской в Stripe Customer Portal"""
        from app.database import async_session_maker
        
        async with async_session_maker() as db:
            result = await db.execute(
                select(Subscription).where(Subscription.user_id == user_id)
            )
            subscription = result.scalar_one_or_none()
            
            if not subscription or not subscription.subscription_id:
                raise ValueError("Подписка не найдена")
            
            # Получаем customer_id из Stripe
            stripe_subscription = stripe.Subscription.retrieve(subscription.subscription_id)
            customer_id = stripe_subscription.customer
            
            # Создаём сессию портала
            portal_session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=f"{settings.FRONTEND_URL}/subscription",
            )
            
            return {"portal_url": portal_session.url}
