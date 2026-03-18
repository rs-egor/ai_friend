from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class FriendBase(BaseModel):
    name: str
    personality: Optional[str] = None
    tone: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[str] = None
    interests: Optional[List[str]] = None
    scenario: Optional[str] = None


class FriendCreate(FriendBase):
    pass


class FriendUpdate(BaseModel):
    name: Optional[str] = None
    personality: Optional[str] = None
    tone: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[str] = None
    interests: Optional[List[str]] = None
    scenario: Optional[str] = None


class FriendResponse(FriendBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
