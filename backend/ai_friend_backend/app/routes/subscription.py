import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.subscription_service import SubscriptionService
# from app.services.stripe_service import StripeService  # Stripe отключён
from app.schemas.subscription import SubscriptionResponse, PaymentRequest
from app.utils.security import get_current_user
from app.models.user import User

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
    
    ⚠️ Stripe отключён - используется DEMO режим.
    """
    logger.info(f"User {current_user.id} creating checkout session: {payment_request.plan_type} (DEMO)")

    # Stripe отключён - используем DEMO активацию
    subscription_service = SubscriptionService(db)
    subscription = await subscription_service.activate_premium(
        user_id=current_user.id,
        plan_type=payment_request.plan_type,
        payment_provider="demo",
        subscription_id=f"demo_{current_user.id}"
    )

    return {
        "success": True,
        "checkout_url": None,
        "session_id": None,
        "demo_mode": True,
        "message": "Подписка активирована в DEMO режиме"
    }


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Webhook для обработки событий от Stripe.
    
    ⚠️ Stripe отключён - webhook не работает.
    """
    logger.warning("Stripe webhook вызван, но Stripe отключён")
    return {"status": "disabled", "message": "Stripe отключён"}


@router.get("/portal")
async def create_portal_session(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Создать сессию для управления подпиской.
    
    ⚠️ Stripe отключён - портал не работает.
    """
    logger.warning("Stripe portal вызван, но Stripe отключён")
    return {
        "success": False,
        "portal_url": None,
        "message": "Stripe отключён"
    }


@router.get("/success")
async def subscription_success():
    """Страница успешной оплаты (redirect с frontend)"""
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
