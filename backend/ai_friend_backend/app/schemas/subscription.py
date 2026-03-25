from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SubscriptionResponse(BaseModel):
    """Ответ с информацией о подписке"""
    is_premium: bool
    plan_type: str
    messages_count: int
    messages_limit: int = 5
    remaining_messages: int
    started_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PaymentRequest(BaseModel):
    """Запрос на создание оплаты"""
    plan_type: str = "monthly"  # "monthly" или "yearly"
    payment_method: str = "card"  # "card", "crypto"
