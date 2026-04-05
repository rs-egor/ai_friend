from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin, UpdateProfileRequest, ChangePasswordRequest, AccountStats
from app.utils.security import get_current_user, get_current_user_from_refresh_token
from app.models.user import User
from app.models.friend import Friend
from app.models.message import Message
from app.models.subscription import Subscription

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


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    request: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Обновить email пользователя"""
    # Проверка, не занят ли email
    result = await db.execute(
        select(User).where(User.email == request.email).where(User.id != current_user.id)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует",
        )

    current_user.email = request.email
    await db.flush()
    await db.refresh(current_user)
    return current_user


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Сменить пароль пользователя"""
    import bcrypt

    # Проверяем текущий пароль
    password_bytes = request.current_password.encode('utf-8')
    hashed_bytes = current_user.hashed_password.encode('utf-8')
    if not bcrypt.checkpw(password_bytes, hashed_bytes):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный текущий пароль",
        )

    # Хэшируем новый пароль
    new_password_bytes = request.new_password.encode('utf-8')
    new_hashed = bcrypt.hashpw(new_password_bytes, bcrypt.gensalt()).decode('utf-8')
    current_user.hashed_password = new_hashed
    await db.flush()

    return {"message": "Пароль успешно изменён"}


@router.delete("/account")
async def delete_account(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Удалить аккаунт пользователя и все связанные данные"""
    # Каскадное удаление настроено в моделях (friends, messages, memories, subscription)
    await db.delete(current_user)
    await db.commit()
    return {"message": "Аккаунт успешно удалён"}


@router.get("/stats", response_model=AccountStats)
async def get_account_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Получить статистику аккаунта"""
    # Количество друзей
    friends_result = await db.execute(
        select(func.count(Friend.id)).where(Friend.user_id == current_user.id)
    )
    total_friends = friends_result.scalar() or 0

    # Количество сообщений
    messages_result = await db.execute(
        select(func.count(Message.id)).where(Message.user_id == current_user.id)
    )
    total_messages = messages_result.scalar() or 0

    # Подписка
    sub_result = await db.execute(
        select(Subscription).where(Subscription.user_id == current_user.id)
    )
    subscription = sub_result.scalar_one_or_none()

    subscription_plan = "free"
    messages_remaining = max(0, 5 - current_user.messages_count)

    if subscription and subscription.is_premium:
        subscription_plan = subscription.plan_type or "premium"
        messages_remaining = 999

    return AccountStats(
        total_friends=total_friends,
        total_messages=total_messages,
        subscription_plan=subscription_plan,
        messages_remaining=messages_remaining,
    )
