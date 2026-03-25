from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Memory(Base):
    """Модель для хранения долговременных воспоминаний/фактов"""
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)  # Сам факт/воспоминание
    memory_type = Column(String, nullable=False)  # "fact", "preference", "event", "relationship"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    friend_id = Column(Integer, ForeignKey("friends.id"), nullable=False)
    importance = Column(Integer, default=1)  # Важность от 1 до 5
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    last_accessed_at = Column(DateTime, default=datetime.utcnow)
    access_count = Column(Integer, default=0)  # Сколько раз вспоминали

    # Связи
    user = relationship("User", back_populates="memories")
    friend = relationship("Friend", back_populates="memories")
