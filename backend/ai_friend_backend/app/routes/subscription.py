import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.subscription_service import SubscriptionService
from app.services.stripe_service import StripeService
from app.schemas.subscription import SubscriptionResponse, PaymentRequest
from app.utils.security import get_current_user
from app.models.user import User
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/", response_model=SubscriptionResponse)
async def get_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Получить информацию о подписке пользователя"""
    subscription_service = SubscriptionService(db)
    info = await subscription_service.get_subscription_info(current_user)

    return SubscriptionResponse(
        is_premium=info["is_premium"],
        plan_type=info["plan_type"],
        messages_count=info["messages_count"],
        messages_limit=info["messages_limit"],
        remaining_messages=info["remaining_messages"],
        started_at=info["started_at"],
        expires_at=info["expires_at"],
    )


@router.post("/create-checkout")
async def create_checkout_session(
    payment_request: PaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Создать сессию checkout для оплаты через Stripe.
    """
    logger.info(f"User {current_user.id} creating checkout session: {payment_request.plan_type}")

    stripe_service = StripeService()
    
    try:
        checkout_data = await stripe_service.create_checkout_session(
            db=db,
            user=current_user,
            plan_type=payment_request.plan_type
        )
        
        return {
            "success": True,
            "checkout_url": checkout_data["checkout_url"],
            "session_id": checkout_data["session_id"],
            "demo_mode": False,
        }
    except ValueError as e:
        logger.error(f"Error creating checkout: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Webhook для обработки событий от Stripe.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    stripe_service = StripeService()
    
    try:
        event = await stripe_service.handle_webhook(payload, sig_header)
        return event
    except ValueError as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/portal")
async def create_portal_session(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Создать сессию для управления подпиской в Stripe Customer Portal.
    """
    stripe_service = StripeService()
    
    try:
        portal_data = await stripe_service.create_portal_session(current_user.id)
        return {
            "success": True,
            "portal_url": portal_data["portal_url"],
        }
    except ValueError as e:
        logger.error(f"Error creating portal session: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/success")
async def subscription_success(
    session_id: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Страница успешной оплаты (redirect с frontend).
    Активирует подписку по session_id.
    """
    if session_id:
        try:
            import stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            
            session = stripe.checkout.Session.retrieve(session_id)
            
            logger.info(f"Session {session_id}: payment_status={session.payment_status}, subscription={session.subscription}")
            
            if session.payment_status == "paid":
                # Активируем подписку
                from app.services.subscription_service import SubscriptionService
                subscription_service = SubscriptionService(db)
                
                plan_type = "monthly"
                if session.mode == "subscription" and session.subscription:
                    # Получаем информацию о подписке для определения плана
                    stripe_sub = stripe.Subscription.retrieve(session.subscription)
                    # Проверяем, какой план (monthly/yearly) по price
                    items = stripe_sub.get('items', {}).get('data', [])
                    if items:
                        price_id = items[0].get('price', {}).get('id', '')
                        if price_id == settings.STRIPE_PRICE_ID_YEARLY:
                            plan_type = "yearly"
                
                await subscription_service.activate_premium(
                    user_id=current_user.id,
                    plan_type=plan_type,
                    payment_provider="stripe",
                    subscription_id=session.subscription if session.subscription else session_id
                )
                
                logger.info(f"Activated premium for user {current_user.id} via session {session_id}")
                return {"success": True, "message": "Подписка активирована"}
        except Exception as e:
            logger.error(f"Error verifying session: {e}")
            import traceback
            logger.error(traceback.format_exc())
    
    return {"success": True, "message": "Подписка активирована"}


@router.get("/cancel")
async def subscription_cancel():
    """Страница отмены оплаты"""
    return {"success": False, "message": "Оплата отменена"}


@router.post("/activate")
async def activate_subscription(
    payment_request: PaymentRequest = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Активировать подписку (DEMO режим).
    
    В production используйте /create-checkout
    """
    logger.info(f"User {current_user.id} activating subscription (DEMO)")
    
    subscription_service = SubscriptionService(db)
    
    # DEMO: просто активируем премиум
    subscription = await subscription_service.activate_premium(
        user_id=current_user.id,
        plan_type=payment_request.plan_type if payment_request else "monthly",
        payment_provider="demo",
        subscription_id=f"demo_{current_user.id}"
    )
    
    return {
        "success": True,
        "message": "Подписка активирована (DEMO режим)",
        "subscription": {
            "is_premium": subscription.is_premium,
            "plan_type": subscription.plan_type,
            "expires_at": subscription.expires_at.isoformat() if subscription.expires_at else None
        }
    }


@router.post("/reset-counter")
async def reset_message_counter(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Сбросить счётчик сообщений (для тестирования).
    
    В production этот endpoint нужно удалить или защитить админским доступом.
    """
    current_user.messages_count = 0
    await db.flush()
    
    logger.info(f"User {current_user.id} reset message counter to 0")
    
    return {
        "success": True,
        "message": "Счётчик сообщений сброшен",
        "messages_count": 0
    }
