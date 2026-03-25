from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    role = Column(String, nullable=False)  # "user" или "assistant"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    friend_id = Column(Integer, ForeignKey("friends.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Связи
    user = relationship("User", back_populates="messages")
    friend = relationship("Friend", back_populates="messages")
