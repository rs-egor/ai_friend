from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.services.groq_service import GroqService
from app.services.chat_service import ChatService
from app.services.memory_service import MemoryService
from app.schemas.chat import ChatRequest, ChatResponse
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/send", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Отправить сообщение AI-другу и получить ответ"""

    chat_service = ChatService(db, GroqService())

    try:
        result = await chat_service.send_message(
            user=current_user,
            friend_id=request.friend_id,
            user_message=request.message,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка сервера: {str(e)}")


@router.get("/history/{friend_id}")
async def get_chat_history(
    friend_id: int,
    limit: int = Query(default=50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Получить историю чата с другом"""

    chat_service = ChatService(db, GroqService())

    try:
        messages = await chat_service.get_chat_history(
            user=current_user,
            friend_id=friend_id,
            limit=limit,
        )
        return {
            "messages": [
                {
                    "id": m.id,
                    "content": m.content,
                    "role": m.role,
                    "user_id": m.user_id,
                    "friend_id": m.friend_id,
                    "created_at": m.created_at.isoformat(),
                }
                for m in messages
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/memories/{friend_id}")
async def get_memories(
    friend_id: int,
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Получить воспоминания о друге"""

    chat_service = ChatService(db, GroqService())

    try:
        memories = await chat_service.get_memories(
            user=current_user,
            friend_id=friend_id,
            limit=limit,
        )
        return {"memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
