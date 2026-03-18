from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Настройки приложения"""

    # GROQ API
    GROQ_API_KEY: str

    # База данных
    DATABASE_URL: str = "sqlite+aiosqlite:///./ai_friend.db"

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    FRONTEND_URL: str = "http://localhost:8080"

    # Приложение
    APP_NAME: str = "AI Friend"
    DEBUG: bool = True

    # Порты (не используются напрямую, но могут быть в .env)
    BACKEND_PORT: int = 8000
    FRONTEND_PORT: int = 8080

    class Config:
        # Ищем .env в директории backend (на уровень выше app)
        env_file = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
        case_sensitive = True


settings = Settings()
