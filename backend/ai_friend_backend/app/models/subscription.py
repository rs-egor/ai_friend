from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Subscription(Base):
    """Модель подписки пользователя"""
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    # Статус подписки
    is_premium = Column(Boolean, default=False)

    # Тип подписки (месяц/год)
    plan_type = Column(String, default="monthly")  # "monthly" или "yearly"

    # Даты
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=True)  # Дата окончания подписки
    
    # Платёжная информация
    payment_provider = Column(String, nullable=True)  # "stripe", "paypal", "crypto"
    subscription_id = Column(String, nullable=True)  # ID подписки у провайдера
    
    # Связи
    user = relationship("User", back_populates="subscription")
