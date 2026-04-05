import logging
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.services.groq_service import GroqService
from app.services.chat_service import ChatService
from app.services.memory_service import MemoryService
from app.services.subscription_service import SubscriptionService
from app.schemas.chat import ChatRequest, ChatResponse
from app.utils.security import get_current_user
from app.models.user import User

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/send", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Отправить сообщение AI-другу и получить ответ"""
    
    # Проверка лимита сообщений
    subscription_service = SubscriptionService(db)
    can_send, count, remaining = await subscription_service.check_message_limit(current_user)
    
    if not can_send:
        logger.warning(f"User {current_user.id} exceeded message limit: {count}/{subscription_service.FREE_MESSAGES_LIMIT}")
        raise HTTPException(
            status_code=403,
            detail={
                "error": "message_limit_exceeded",
                "message": f"Вы исчерпали лимит бесплатных сообщений ({count}/{subscription_service.FREE_MESSAGES_LIMIT}). Оформите подписку для продолжения.",
                "messages_count": count,
                "messages_limit": subscription_service.FREE_MESSAGES_LIMIT,
                "remaining": 0
            }
        )

    chat_service = ChatService(db, GroqService())

    try:
        result = await chat_service.send_message(
            user=current_user,
            friend_id=request.friend_id,
            user_message=request.message,
            language=request.language or "en",
        )
        
        # Увеличиваем счётчик сообщений после успешного ответа
        await subscription_service.increment_message_count(current_user)
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Chat error: {e}")
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
