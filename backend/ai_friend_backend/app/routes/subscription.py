import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.subscription_service import SubscriptionService
from app.schemas.subscription import SubscriptionResponse, PaymentRequest
from app.utils.security import get_current_user
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/subscription", response_model=SubscriptionResponse)
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


@router.post("/subscription/activate")
async def activate_subscription(
    payment_request: PaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Активировать подписку.
    
    В демо-режиме просто активирует премиум.
    В production здесь будет интеграция с платёжной системой (Stripe, CryptoCloud и т.д.)
    """
    logger.info(f"User {current_user.id} activating subscription: {payment_request.plan_type}")
    
    subscription_service = SubscriptionService(db)
    
    # В демо-режиме просто активируем премиум
    # В production здесь будет:
    # 1. Создание платежа в Stripe/CryptoCloud
    # 2. Redirect пользователя на оплату
    # 3. Webhook для подтверждения оплаты
    # 4. Активация подписки после успешной оплаты
    
    subscription = await subscription_service.activate_premium(
        user_id=current_user.id,
        plan_type=payment_request.plan_type,
        payment_provider="demo",  # Замените на "stripe" или "crypto" в production
        subscription_id=f"demo_{current_user.id}"
    )
    
    return {
        "success": True,
        "message": "Подписка активирована",
        "subscription": {
            "is_premium": subscription.is_premium,
            "plan_type": subscription.plan_type,
            "expires_at": subscription.expires_at.isoformat() if subscription.expires_at else None
        }
    }


@router.post("/subscription/reset-counter")
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
