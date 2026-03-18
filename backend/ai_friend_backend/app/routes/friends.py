from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.schemas.friend import FriendCreate, FriendResponse, FriendUpdate
from app.utils.security import get_current_user
from app.models.user import User
from app.models.friend import Friend

router = APIRouter()


@router.post("/", response_model=FriendResponse)
async def create_friend(
    friend: FriendCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Создать нового AI-друга"""

    new_friend = Friend(
        name=friend.name,
        personality=friend.personality,
        tone=friend.tone,
        gender=friend.gender,
        age=friend.age,
        interests=friend.interests or [],
        scenario=friend.scenario,
        user_id=current_user.id,
    )

    db.add(new_friend)
    await db.flush()
    await db.refresh(new_friend)

    return new_friend


@router.get("/", response_model=List[FriendResponse])
async def list_friends(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Получить список всех друзей пользователя"""

    result = await db.execute(
        select(Friend).where(Friend.user_id == current_user.id)
    )
    friends = result.scalars().all()

    return friends


@router.get("/{friend_id}", response_model=FriendResponse)
async def get_friend(
    friend_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Получить информацию о друге"""

    result = await db.execute(
        select(Friend).where(Friend.id == friend_id).where(Friend.user_id == current_user.id)
    )
    friend = result.scalar_one_or_none()

    if not friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Друг не найден",
        )

    return friend


@router.delete("/{friend_id}")
async def delete_friend(
    friend_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Удалить друга"""

    result = await db.execute(
        select(Friend).where(Friend.id == friend_id).where(Friend.user_id == current_user.id)
    )
    friend = result.scalar_one_or_none()

    if not friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Друг не найден",
        )

    await db.delete(friend)
    await db.commit()

    return {"message": "Друг успешно удалён"}


@router.put("/{friend_id}", response_model=FriendResponse)
async def update_friend(
    friend_id: int,
    friend_update: FriendUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Обновить информацию о друге"""

    result = await db.execute(
        select(Friend).where(Friend.id == friend_id).where(Friend.user_id == current_user.id)
    )
    friend = result.scalar_one_or_none()

    if not friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Друг не найден",
        )

    # Обновление полей
    update_data = friend_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(friend, field, value)

    await db.flush()
    await db.refresh(friend)

    return friend
