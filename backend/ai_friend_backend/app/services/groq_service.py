from groq import Groq
from app.config import settings
from typing import List, Dict
import sys
import os

# Добавляем путь к корню backend, где находится personality.py
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

try:
    from personality import build_system_prompt
except ImportError:
    # Fallback: используем упрощённую версию, если personality.py не найден
    def build_system_prompt(personality: str, gender: str, age: str, interests: list, scenario: str) -> str:
        return f"Ты — AI-друг. Пол: {gender}, возраст: {age}, интересы: {', '.join(interests)}, сценарий: {scenario}."


class GroqService:
    """Сервис для работы с GROQ API"""

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"  # Модель по умолчанию

    async def get_completion(
        self,
        messages: List[Dict[str, str]],
        system_prompt: str = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Получить ответ от AI"""

        full_messages = []
        if system_prompt:
            full_messages.append({"role": "system", "content": system_prompt})
        full_messages.extend(messages)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=full_messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        return response.choices[0].message.content

    async def get_friend_response(
        self,
        user_message: str,
        friend_profile: dict,
        conversation_history: List[Dict[str, str]],
        language: str = "en",
    ) -> str:
        """Получить ответ от AI-друга с учётом профиля"""

        # Используем personality.py для сборки промпта
        system_prompt = build_system_prompt(
            personality="friend",  # Базовая личность
            gender=friend_profile.get('gender', 'neutral'),
            age=friend_profile.get('age', 'adult'),
            interests=friend_profile.get('interests', []),
            scenario=friend_profile.get('scenario', 'casual'),
            language=language,
            friend_name=friend_profile.get('name'),
        )

        # Добавляем кастомный характер и стиль, если указаны
        if friend_profile.get('personality'):
            system_prompt = f"{friend_profile['personality']}\n\n{system_prompt}"
        if friend_profile.get('tone'):
            system_prompt = f"{system_prompt}\n\nСтиль общения: {friend_profile['tone']}"

        messages = conversation_history[-10:]  # Последние 10 сообщений
        messages.append({"role": "user", "content": user_message})

        return await self.get_completion(
            messages=messages,
            system_prompt=system_prompt,
            temperature=0.8,  # Более креативные ответы
        )

    async def get_friend_response_with_memory(
        self,
        user_message: str,
        friend_profile: dict,
        conversation_history: List[Dict[str, str]],
        memories: List[str],
        language: str = "en",
    ) -> str:
        """Получить ответ от AI-друга с учётом профиля и долговременной памяти"""

        # Используем personality.py для сборки промпта
        system_prompt = build_system_prompt(
            personality="friend",  # Базовая личность
            gender=friend_profile.get('gender', 'neutral'),
            age=friend_profile.get('age', 'adult'),
            interests=friend_profile.get('interests', []),
            scenario=friend_profile.get('scenario', 'casual'),
            language=language,
            friend_name=friend_profile.get('name'),
        )

        # Добавляем кастомный характер и стиль, если указаны
        if friend_profile.get('personality'):
            system_prompt = f"{friend_profile['personality']}\n\n{system_prompt}"
        if friend_profile.get('tone'):
            system_prompt = f"{system_prompt}\n\nСтиль общения: {friend_profile['tone']}"

        # Формируем контекст памяти
        memory_context = ""
        if memories:
            memory_context = "\n\nВажные факты о пользователе, которые ты запомнил:\n"
            memory_context += "\n".join(f"- {m}" for m in memories)
            system_prompt = f"{system_prompt}{memory_context}"

        messages = conversation_history[-10:]  # Последние 10 сообщений
        messages.append({"role": "user", "content": user_message})

        return await self.get_completion(
            messages=messages,
            system_prompt=system_prompt,
            temperature=0.8,  # Более креативные ответы
        )
