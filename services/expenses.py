from __future__ import annotations

from datetime import datetime
from typing import Optional, Tuple

from sqlalchemy.ext.asyncio import AsyncSession

from models.user import User
from repositories import expenses as expenses_repo
from repositories import categories as categories_repo


class CategoryDoesNotExist(Exception):
    """Raised when a referenced category does not belong to the user."""


MAX_PAGE_SIZE = 100


def _validate_positive_int(value: int, field_name: str) -> None:
    if value <= 0:
        raise ValueError(f"{field_name} must be > 0")


def _validate_amount(amount: Optional[float]) -> None:
    if amount is None:
        raise ValueError("Amount is required")
    if amount <= 0:
        raise ValueError("Amount of the expense has to be greater than 0")


def _validate_title(title: Optional[str]) -> str:
    if title is None:
        raise ValueError("Title is required")
    normalized = title.strip()
    if not normalized:
        raise ValueError("Title cannot be empty")
    return normalized


def _validate_date_range(from_date: Optional[datetime], to_date: Optional[datetime]) -> None:
    if from_date is not None and to_date is not None and from_date > to_date:
        raise ValueError("from_date must be <= to_date")


def _normalize_sort(sort: Optional[str]) -> tuple[str, bool]:
    raw = (sort or "-occurred_at").strip()
    descending = raw.startswith("-")
    key = raw[1:] if descending else raw
    if key not in {"occurred_at", "amount", "created_at"}:
        raise ValueError("sort must be one of: occurred_at, -occurred_at, amount, -amount, created_at, -created_at")
    return key, descending


def _normalize_pagination(page: Optional[int], limit: Optional[int]) -> tuple[int, int, int]:
    page_value = 1 if page is None else page
    limit_value = 20 if limit is None else limit
    if page_value < 1:
        raise ValueError("page must be >= 1")
    if limit_value < 1:
        raise ValueError("limit must be >= 1")
    if limit_value > MAX_PAGE_SIZE:
        raise ValueError(f"limit must be <= {MAX_PAGE_SIZE}")
    return page_value, limit_value, (page_value - 1) * limit_value


async def ensure_category_belongs_to_user(db: AsyncSession, user: User, category_id: int) -> None:
    """Utility to assert category ownership."""
    _validate_positive_int(category_id, "category_id")
    category = await categories_repo.get_for_user(db, user, category_id)
    if category is None:
        raise CategoryDoesNotExist(f"Category with '{category_id}' does not exist")


async def create_expense(db: AsyncSession, *, user: User, payload: dict):
    """Validate input then delegate to repository create."""
    amount = payload.get("amount")
    category_id = payload.get("category_id")
    title = payload.get("title")

    _validate_amount(amount)
    _validate_title(title)
    if category_id is None:
        raise ValueError("category_id is required")
    _validate_positive_int(category_id, "category_id")
    # Ensure the category belongs to the user before creating
    await ensure_category_belongs_to_user(db, user, category_id)

    return await expenses_repo.create_for_user(
        db,
        user=user,
        category_id=category_id,
        amount=amount,
        title=title,
        note=payload.get("note", "").strip(),
        occurred_at=payload.get("occurred_at"),
    )


async def get_expense(db: AsyncSession, *, user: User, expense_id: int):
    """Ownership-safe fetch."""
    _validate_positive_int(expense_id, "expense_id")
    return await expenses_repo.get_for_user(db, user, expense_id)


async def list_expenses(
    db: AsyncSession,
    *,
    user: User,
    page: Optional[int],
    limit: Optional[int],
    filters: Optional[dict] = None,
) -> Tuple[list, dict]:
    """Validate pagination, delegate to repo, and return items + meta."""
    filters = filters or {}
    category_id = filters.get("category_id")
    from_date = filters.get("from_date")
    to_date = filters.get("to_date")
    sort = filters.get("sort")

    _validate_date_range(from_date, to_date)
    page_value, limit_value, _ = _normalize_pagination(page, limit)
    sort_key, descending = _normalize_sort(sort)
    sort_param = f"-" if descending else ""
    sort_param += sort_key

    if category_id is not None:
        await ensure_category_belongs_to_user(db, user, category_id)

    items = await expenses_repo.list_for_user(
        db,
        user=user,
        page=page_value,
        limit=limit_value,
        category_id=category_id,
        from_date=from_date,
        to_date=to_date,
        sort=sort_param,
    )

    total = await expenses_repo.count_for_user(
        db,
        user=user,
        from_date=from_date,
        to_date=to_date,
    )

    meta = {
        "page": page_value,
        "limit": limit_value,
        "total": total,
        "pages": (total + limit_value - 1) // limit_value if limit_value else 1,
    }
    return items, meta


async def update_expense(db: AsyncSession, *, user: User, expense_id: int, payload: dict):
    """Ownership check, validations, delegate update."""
    _validate_positive_int(expense_id, "expense_id")

    # Ensure the expense belongs to the user
    existing = await expenses_repo.get_for_user(db, user, expense_id)
    if existing is None:
        return None

    fields = {}
    if "category_id" in payload:
        category_id = payload["category_id"]
        await ensure_category_belongs_to_user(db, user, category_id)
        fields["category_id"] = category_id

    if "amount" in payload:
        _validate_amount(payload["amount"])
        fields["amount"] = payload["amount"]

    if "occurred_at" in payload:
        fields["occurred_at"] = payload["occurred_at"]

    if "title" in payload:
        fields["title"] = _validate_title(payload["title"])

    if "note" in payload:
        fields["note"] = payload["note"].strip()

    return await expenses_repo.update_for_user(db, user, expense_id, **fields)


async def delete_expense(db: AsyncSession, *, user: User, expense_id: int) -> None:
    """Ownership check then delete."""
    _validate_positive_int(expense_id, "expense_id")
    await expenses_repo.delete_for_user(db, user, expense_id)
