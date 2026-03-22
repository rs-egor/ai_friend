from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    friend_id: int


class MessageUpdate(BaseModel):
    content: Optional[str] = None


class MessageResponse(MessageBase):
    id: int
    role: str
    user_id: int
    friend_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    message: str
    friend_id: int
    language: Optional[str] = "ru"


class ChatResponse(BaseModel):
    user_message: MessageResponse
    ai_response: MessageResponse
