from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin
from app.utils.security import get_current_user, get_current_user_from_refresh_token
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(
    user: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """Регистрация нового пользователя"""
    auth_service = AuthService(db)

    try:
        new_user = await auth_service.register(user)
        return new_user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Вход пользователя (получение JWT токена)"""
    auth_service = AuthService(db)

    # Получаем JSON из запроса
    try:
        body = await request.json()
        email = body.get("email", "")
        password = body.get("password", "")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Требуется JSON с полями email и password",
        )

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Требуется email и пароль",
        )

    user = await auth_service.authenticate(email, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    tokens = await auth_service.create_token(user)

    return tokens


@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Обновить access токен с помощью refresh токена"""
    auth_service = AuthService(db)

    # Получаем refresh токен из запроса
    try:
        body = await request.json()
        refresh_token = body.get("refresh_token", "")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Требуется JSON с полем refresh_token",
        )

    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Требуется refresh_token",
        )

    # Проверяем refresh токен
    user = await get_current_user_from_refresh_token(refresh_token, db)

    # Создаём новые токены
    tokens = await auth_service.create_token(user)

    return tokens


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
):
    """Получить текущую информацию о пользователе"""
    return current_user
