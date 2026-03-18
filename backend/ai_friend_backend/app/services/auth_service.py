from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import create_access_token
from app.config import settings


class AuthService:
    """Сервис для аутентификации"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def register(self, user_data: UserCreate) -> User:
        """Регистрация нового пользователя"""

        # Проверка существования пользователя
        result = await self.db.execute(
            select(User).where(User.email == user_data.email)
        )
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise ValueError("Пользователь с таким email уже существует")

        # Создание нового пользователя с bcrypt напрямую
        import bcrypt
        password_bytes = user_data.password.encode('utf-8')
        hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
        )

        self.db.add(new_user)
        await self.db.flush()
        await self.db.refresh(new_user)

        return new_user

    async def authenticate(self, email: str, password: str) -> User | None:
        """Аутентификация пользователя"""

        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()

        if not user:
            return None

        # Проверка пароля с bcrypt напрямую
        import bcrypt
        password_bytes = password.encode('utf-8')
        hashed_bytes = user.hashed_password.encode('utf-8')
        if not bcrypt.checkpw(password_bytes, hashed_bytes):
            return None

        return user

    async def create_token(self, user: User) -> str:
        """Создание JWT токена для пользователя"""

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires,
        )

        return access_token
