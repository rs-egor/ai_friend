from pydantic import BaseModel
from datetime import datetime


class MessageResponse(BaseModel):
    id: int
    content: str
    role: str
    user_id: int
    friend_id: int
    created_at: datetime

    class Config:
        from_attributes = True
