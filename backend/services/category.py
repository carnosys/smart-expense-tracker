from __future__ import annotations

from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from repositories import categories as categories_repo


def _validate_category_id(category_id: int) -> None:
    if category_id <= 0:
        raise ValueError("category_id must be > 0")


def _normalize_name(name: Optional[str]) -> str:
    if name is None:
        raise ValueError("name is required")
    normalized = name.strip()
    if not normalized:
        raise ValueError("name cannot be empty")
    if len(normalized) > 20:
        raise ValueError("name length must be <= 20")
    return normalized


def _normalize_description(description: Optional[str]) -> str:
    if description is None:
        raise ValueError("description is required")
    return description.strip()


async def create_category(db: AsyncSession, *, user: User, payload: dict):
    name = _normalize_name(payload.get("name"))
    description = _normalize_description(payload.get("description"))
    return await categories_repo.create_for_user(db, user, name, description)


async def get_category(db: AsyncSession, *, user: User, category_id: int):
    _validate_category_id(category_id)
    return await categories_repo.get_for_user(db, user, category_id)


async def list_categories(db: AsyncSession, *, user: User):
    return await categories_repo.list_for_user(db, user)


async def update_category(
    db: AsyncSession,
    *,
    user: User,
    category_id: int,
    payload: dict,
):
    _validate_category_id(category_id)

    fields = {}
    if "name" in payload:
        fields["name"] = _normalize_name(payload.get("name"))
    if "description" in payload:
        fields["description"] = _normalize_description(payload.get("description"))

    return await categories_repo.update_for_user(db, user, category_id, **fields)


async def delete_category(db: AsyncSession, *, user: User, category_id: int):
    _validate_category_id(category_id)
    category = await categories_repo.get_for_user(db, user, category_id)
    if category is None:
        return None
    await categories_repo.delete_for_user(db, user, category_id)
    return category
