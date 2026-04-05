import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.subscription import Subscription
from app.models.user import User
from datetime import datetime, timezone, timedelta

logger = logging.getLogger(__name__)


class SubscriptionService:
    """Сервис для управления подписками"""
    
    # Лимит бесплатных сообщений
    FREE_MESSAGES_LIMIT = 5
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_subscription(self, user_id: int) -> Subscription | None:
        """Получить подписку пользователя"""
        result = await self.db.execute(
            select(Subscription).where(Subscription.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_or_create_subscription(self, user_id: int) -> Subscription:
        """Получить или создать подписку"""
        subscription = await self.get_subscription(user_id)
        
        if not subscription:
            subscription = Subscription(user_id=user_id)
            self.db.add(subscription)
            await self.db.flush()
            await self.db.refresh(subscription)
            logger.info(f"Created subscription for user {user_id}")
        
        return subscription
    
    async def check_message_limit(self, user: User) -> tuple[bool, int, int]:
        """
        Проверить, может ли пользователь отправить сообщение.
        
        Returns:
            (can_send, messages_count, remaining)
        """
        # Если премиум - без ограничений
        subscription = await self.get_subscription(user.id)
        if subscription and subscription.is_premium:
            # Проверяем не истёк ли срок
            if subscription.expires_at and subscription.expires_at < datetime.now(timezone.utc):
                subscription.is_premium = False
                await self.db.flush()
            else:
                return (True, user.messages_count, 999)
        
        # Проверяем лимит
        remaining = self.FREE_MESSAGES_LIMIT - user.messages_count
        can_send = remaining > 0
        
        logger.info(f"User {user.id}: messages={user.messages_count}, remaining={remaining}, can_send={can_send}")
        
        return (can_send, user.messages_count, remaining)
    
    async def increment_message_count(self, user: User) -> int:
        """Увеличить счётчик сообщений"""
        user.messages_count += 1
        await self.db.flush()
        logger.info(f"User {user.id} message count: {user.messages_count}")
        return user.messages_count
    
    async def activate_premium(
        self, 
        user_id: int, 
        plan_type: str = "monthly",
        payment_provider: str = "manual",
        subscription_id: str = None
    ) -> Subscription:
        """Активировать премиум подписку"""
        subscription = await self.get_or_create_subscription(user_id)
        
        subscription.is_premium = True
        subscription.plan_type = plan_type
        subscription.payment_provider = payment_provider
        subscription.subscription_id = subscription_id
        subscription.started_at = datetime.now(timezone.utc)

        # Устанавливаем дату окончания
        if plan_type == "yearly":
            subscription.expires_at = datetime.now(timezone.utc) + timedelta(days=365)
        else:  # monthly
            subscription.expires_at = datetime.now(timezone.utc) + timedelta(days=30)
        
        await self.db.flush()
        await self.db.refresh(subscription)
        
        logger.info(f"Activated premium for user {user_id}, plan={plan_type}")
        
        return subscription
    
    async def get_subscription_info(self, user: User) -> dict:
        """Получить информацию о подписке"""
        can_send, count, remaining = await self.check_message_limit(user)
        
        subscription = await self.get_subscription(user.id)
        
        return {
            "is_premium": subscription.is_premium if subscription else False,
            "plan_type": subscription.plan_type if subscription else "free",
            "messages_count": user.messages_count,
            "messages_limit": self.FREE_MESSAGES_LIMIT,
            "remaining_messages": max(0, remaining),
            "started_at": subscription.started_at if subscription else None,
            "expires_at": subscription.expires_at if subscription else None,
        }
