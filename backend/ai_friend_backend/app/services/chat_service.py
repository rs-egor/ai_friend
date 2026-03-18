from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.models.message import Message
from app.models.friend import Friend
from app.models.user import User
from app.services.groq_service import GroqService
from app.services.memory_service import MemoryService
from app.schemas.chat import MessageResponse
from typing import List, Dict


class ChatService:
    """Сервис для управления чатом с долговременной памятью"""

    def __init__(self, db: AsyncSession, groq_service: GroqService):
        self.db = db
        self.groq_service = groq_service
        self.memory_service = MemoryService(db)

    async def send_message(
        self,
        user: User,
        friend_id: int,
        user_message: str,
    ) -> dict:
        """Отправить сообщение и получить ответ от AI с учётом памяти"""

        # Проверка существования друга
        result = await self.db.execute(
            select(Friend).where(Friend.id == friend_id).where(Friend.user_id == user.id)
        )
        friend = result.scalar_one_or_none()

        if not friend:
            raise ValueError(f"Друг с id {friend_id} не найден")

        # Извлечение фактов из сообщения пользователя
        facts = await self.memory_service.extract_facts_from_message(
            user_message,
            is_user=True,
        )

        # Сохранение извлечённых фактов
        for fact in facts:
            await self.memory_service.add_memory(
                user_id=user.id,
                friend_id=friend.id,
                content=fact['content'],
                memory_type=fact['type'],
                importance=3,  # Факты о предпочтениях важнее
            )

        # Получение релевантных воспоминаний
        relevant_memories = await self.memory_service.get_relevant_memories(
            user_id=user.id,
            friend_id=friend.id,
            query_text=user_message,
            limit=5,
        )

        # Получение истории переписки
        history_result = await self.db.execute(
            select(Message)
            .where(Message.user_id == user.id)
            .where(Message.friend_id == friend.id)
            .order_by(Message.created_at.desc())
            .limit(20)
        )
        history_messages = history_result.scalars().all()

        # Преобразование истории в формат для GROQ
        conversation_history = [
            {"role": m.role, "content": m.content}
            for m in reversed(history_messages)
        ]

        # Получение ответа от AI с учётом памяти
        ai_response_text = await self.groq_service.get_friend_response_with_memory(
            user_message=user_message,
            friend_profile={
                "name": friend.name,
                "personality": friend.personality,
                "tone": friend.tone,
                "gender": friend.gender,
                "age": friend.age,
                "interests": friend.interests or [],
                "scenario": friend.scenario,
            },
            conversation_history=conversation_history,
            memories=[m.content for m in relevant_memories],
        )

        # Сохранение сообщений в БД
        user_msg = Message(
            content=user_message,
            role="user",
            user_id=user.id,
            friend_id=friend.id,
        )
        ai_msg = Message(
            content=ai_response_text,
            role="assistant",
            user_id=user.id,
            friend_id=friend.id,
        )

        self.db.add(user_msg)
        self.db.add(ai_msg)
        await self.db.flush()

        return {
            "user_message": MessageResponse.model_validate(user_msg),
            "ai_response": MessageResponse.model_validate(ai_msg),
        }

    async def get_chat_history(
        self,
        user: User,
        friend_id: int,
        limit: int = 50,
    ) -> list[Message]:
        """Получить историю чата"""

        result = await self.db.execute(
            select(Message)
            .where(Message.user_id == user.id)
            .where(Message.friend_id == friend_id)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )

        messages = result.scalars().all()
        return list(messages)

    async def get_memories(
        self,
        user: User,
        friend_id: int,
        limit: int = 20,
    ) -> list:
        """Получить воспоминания о друге"""

        memories = await self.memory_service.get_memories(
            user_id=user.id,
            friend_id=friend_id,
            limit=limit,
        )

        return [
            {
                "id": m.id,
                "content": m.content,
                "type": m.memory_type,
                "importance": m.importance,
                "created_at": m.created_at.isoformat(),
                "access_count": m.access_count,
            }
            for m in memories
        ]
