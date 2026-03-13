import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.depends import get_current_user, get_db
from models.user import User
from schemas.expenses import ExpenseIn, ExpenseOut
from services.expenses import (
    create_expense,
    delete_expense,
    get_expense,
    list_expenses,
    update_expense,
)


router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("", status_code=status.HTTP_200_OK)
async def list_user_expenses(
    page: int | None = Query(default=None),
    limit: int | None = Query(default=None),
    category_id: int | None = Query(default=None),
    from_date: datetime.datetime | None = Query(default=None),
    to_date: datetime.datetime | None = Query(default=None),
    sort: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    items, meta = await list_expenses(
        db,
        user=user,
        page=page,
        limit=limit,
        filters={
            "category_id": category_id,
            "from_date": from_date,
            "to_date": to_date,
            "sort": sort,
        },
    )
    return {"items": items, "meta": meta}


@router.post("", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
async def create_user_expense(
    payload: ExpenseIn,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await create_expense(db, user=user, payload=payload.model_dump())


@router.get("/{expense_id}", response_model=ExpenseOut, status_code=status.HTTP_200_OK)
async def get_user_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    expense = await get_expense(db, user=user, expense_id=expense_id)
    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id '{expense_id}' not found",
        )
    return expense


@router.patch("/{expense_id}", response_model=ExpenseOut, status_code=status.HTTP_200_OK)
async def update_user_expense(
    expense_id: int,
    payload: dict[str, Any],
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    expense = await update_expense(db, user=user, expense_id=expense_id, payload=payload)
    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id '{expense_id}' not found",
        )
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_expense(
    expense_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    existing = await get_expense(db, user=user, expense_id=expense_id)
    if existing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id '{expense_id}' not found",
        )
    await delete_expense(db, user=user, expense_id=expense_id)
    return None
