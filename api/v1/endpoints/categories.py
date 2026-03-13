from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.depends import get_current_user, get_db
from models.user import User
from schemas.categories import CategoryCreate, CategoryOut
from services.category import (
    create_category,
    delete_category,
    get_category,
    list_categories,
    update_category,
)


router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryOut], status_code=status.HTTP_200_OK)
async def list_user_categories(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await list_categories(db, user=user)


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_user_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await create_category(db, user=user, payload=payload.model_dump())


@router.get("/{category_id}", response_model=CategoryOut, status_code=status.HTTP_200_OK)
async def get_user_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    category = await get_category(db, user=user, category_id=category_id)
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id '{category_id}' not found",
        )
    return category


@router.patch("/{category_id}", response_model=CategoryOut, status_code=status.HTTP_200_OK)
async def update_user_category(
    category_id: int,
    payload: dict[str, Any],
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    category = await update_category(db, user=user, category_id=category_id, payload=payload)
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id '{category_id}' not found",
        )
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deleted = await delete_category(db, user=user, category_id=category_id)
    if deleted is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id '{category_id}' not found",
        )
    return None
