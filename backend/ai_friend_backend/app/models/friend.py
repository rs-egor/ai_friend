from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database import Base
from app.utils.datetime import utcnow


class Friend(Base):
    __tablename__ = "friends"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    personality = Column(Text)  # Характер
    tone = Column(String)  # Стиль общения
    gender = Column(String, default="neutral")  # Пол
    age = Column(String, default="adult")  # Возраст
    interests = Column(JSON, default=list)  # Интересы (список)
    scenario = Column(String, default="casual")  # Сценарий общения
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=utcnow)

    # Связи
    user = relationship("User", back_populates="friends")
    messages = relationship("Message", back_populates="friend", cascade="all, delete-orphan")
    memories = relationship("Memory", back_populates="friend", cascade="all, delete-orphan")
