from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import joinedload
from app.utils.datetime import utcnow
from app.models.memory import Memory
from app.models.user import User
from app.models.friend import Friend
from typing import List, Optional, Dict
import re


class MemoryService:
    """Сервис для управления долговременной памятью"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_memory(
        self,
        user_id: int,
        friend_id: int,
        content: str,
        memory_type: str = "fact",
        importance: int = 1,
    ) -> Memory:
        """Добавить новое воспоминание"""

        memory = Memory(
            content=content,
            memory_type=memory_type,
            user_id=user_id,
            friend_id=friend_id,
            importance=importance,
        )

        self.db.add(memory)
        await self.db.flush()
        await self.db.refresh(memory)

        return memory

    async def get_memories(
        self,
        user_id: int,
        friend_id: Optional[int] = None,
        memory_type: Optional[str] = None,
        limit: int = 20,
    ) -> List[Memory]:
        """Получить воспоминания пользователя"""

        query = select(Memory).where(Memory.user_id == user_id)

        if friend_id:
            query = query.where(Memory.friend_id == friend_id)

        if memory_type:
            query = query.where(Memory.memory_type == memory_type)

        # Сортировка по важности и недавности
        query = query.order_by(
            desc(Memory.importance),
            desc(Memory.last_accessed_at),
        ).limit(limit)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_relevant_memories(
        self,
        user_id: int,
        friend_id: int,
        query_text: str,
        limit: int = 5,
    ) -> List[Memory]:
        """
        Получить релевантные воспоминания по запросу.
        Простая реализация через поиск ключевых слов.
        Для продакшена использовать векторный поиск (pgvector).
        """

        # Извлекаем ключевые слова из запроса
        keywords = set(
            re.findall(r'\w{3,}', query_text.lower())
        )

        # Получаем все воспоминания
        result = await self.db.execute(
            select(Memory)
            .where(Memory.user_id == user_id)
            .where(Memory.friend_id == friend_id)
            .order_by(desc(Memory.importance))
        )

        all_memories = list(result.scalars().all())

        # Сортируем по релевантности (количество совпадений ключевых слов)
        def score_memory(memory: Memory) -> int:
            content_lower = memory.content.lower()
            return sum(1 for kw in keywords if kw in content_lower)

        scored = [(m, score_memory(m)) for m in all_memories]
        scored.sort(key=lambda x: x[1], reverse=True)

        # Обновляем счётчик доступа для топ-N
        for memory, score in scored[:limit]:
            if score > 0:
                memory.access_count += 1
                memory.last_accessed_at = utcnow()

        return [m for m, score in scored[:limit] if score > 0][:limit]

    async def extract_facts_from_message(
        self,
        message: str,
        is_user: bool,
    ) -> List[Dict[str, str]]:
        """
        Извлечь факты из сообщения.
        В продакшене использовать LLM для извлечения.
        Здесь простая эвристика.
        """

        facts = []

        # Паттерны для извлечения фактов (улучшенные)
        patterns = [
            # "Я люблю..." / "I love..."
            (r'(?:я|I)\s+(?:люблю|love|предпочитаю|prefer|обожаю|adore)\s+(.+?)(?:[.!?,;]|$)', 'preference'),
            # "Мне нравится..." / "I like..."
            (r'(?:мне|мне|I)\s+(?:нравится|like|понравилось|liked)\s+(.+?)(?:[.!?,;]|$)', 'preference'),
            # "Я работаю..." / "I work..."
            (r'(?:я|I)\s+(?:работаю|work|трудюсь)\s+(.+?)(?:[.!?,;]|$)', 'fact'),
            # "Я живу..." / "I live..."
            (r'(?:я|I)\s+(?:живу|live|проживаю)\s+(.+?)(?:[.!?,;]|$)', 'fact'),
            # "У меня есть..." / "I have..."
            (r'(?:у\s+меня|I)\s+(?:есть|have|имеется)\s+(.+?)(?:[.!?,;]|$)', 'fact'),
            # "Мой день рождения..." / "My birthday..."
            (r'(?:мой|my)\s+(?:день\s+рождения|birthday)\s+(.+?)(?:[.!?,;]|$)', 'fact'),
            # "Я изучаю..." / "I study..."
            (r'(?:я|I)\s+(?:изучаю|study|учусь|learn|осваиваю)\s+(.+?)(?:[.!?,;]|$)', 'fact'),
            # "Я хочу..." / "I want..."
            (r'(?:я|I)\s+(?:хочу|want|желаю|wish)\s+(.+?)(?:[.!?,;]|$)', 'preference'),
            # "Я умею..." / "I can..."
            (r'(?:я|I)\s+(?:умею|can|могу|able)\s+(.+?)(?:[.!?,;]|$)', 'fact'),
            # "Моя любимая..." / "My favorite..."
            (r'(?:мой|моя|моё|мои|my)\s+(?:любимый|любимая|любимое|любимые|favorite)\s+(.+?)(?:[.!?,;]|$)', 'preference'),
        ]

        for pattern, memory_type in patterns:
            matches = re.findall(pattern, message, re.IGNORECASE)
            for match in matches:
                content = match.strip()
                # Фильтруем слишком короткие или пустые совпадения
                if len(content) > 2:
                    facts.append({
                        'content': content,
                        'type': memory_type,
                    })

        return facts

    async def update_memory_access(self, memory_id: int):
        """Обновить информацию о доступе к воспоминанию"""

        result = await self.db.execute(
            select(Memory).where(Memory.id == memory_id)
        )
        memory = result.scalar_one_or_none()

        if memory:
            memory.access_count += 1
            memory.last_accessed_at = datetime.now(timezone.utc)
            await self.db.flush()

    async def delete_memory(self, user_id: int, memory_id: int) -> bool:
        """Удалить воспоминание"""

        result = await self.db.execute(
            select(Memory)
            .where(Memory.id == memory_id)
            .where(Memory.user_id == user_id)
        )
        memory = result.scalar_one_or_none()

        if memory:
            await self.db.delete(memory)
            await self.db.commit()
            return True

        return False
