from models.expense import Expense
from models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from .categories import get_for_user as get_category_for_user
from sqlalchemy import select, and_, asc, desc, func
from datetime import datetime, timedelta, timezone
from typing import List

class CategoryDoesNotExist(Exception):
   pass


def _append_date_filters(filters: list, from_date: datetime = None, to_date: datetime = None) -> list:
   if from_date is not None and to_date is not None:
      filters.append(Expense.occurred_at.between(from_date, to_date))
   elif from_date is not None:
      filters.append(Expense.occurred_at >= from_date)
   elif to_date is not None:
      filters.append(Expense.occurred_at <= to_date)
   return filters


async def get_for_user(db: AsyncSession, user: User, expense_id: int):
   query = select(Expense).where(and_(Expense.user_id == user.id, Expense.id == expense_id))
   result = await db.execute(query)
   return result.scalars().one_or_none()


async def list_for_user(
    db: AsyncSession,
    user: User,
    *,
    page: int | None = None,
    limit: int | None = None,
    category_id: int = None,
    from_date: datetime = None,
    to_date: datetime = None,
    sort: str = "-occurred_at",
) -> List[Expense]:
   offset = 0
   if page is not None and limit is not None:
      if page < 1:
         raise ValueError("page must be >= 1")
      if limit < 1:
         raise ValueError("limit must be >= 1")
      offset = (page - 1) * limit

   filters=[Expense.user_id == user.id]

   if category_id is not None:
       if not await get_category_for_user(db, user, category_id):
          raise CategoryDoesNotExist(f"Category with '{category_id}' does not exist")
       filters.append(Expense.category_id == category_id)

   _append_date_filters(filters, from_date, to_date)

   sort_map = {
        "occurred_at": Expense.occurred_at,
        "amount": Expense.amount,
    }

   direction = desc if sort.startswith("-") else asc
   sort_key = sort[1:] if sort.startswith("-") else sort
   sort_col = sort_map.get(sort_key, Expense.occurred_at)

   query = (
      select(Expense)
      .where(and_(*filters))
      .order_by(direction(sort_col))
      .offset(offset)
   )
   if limit is not None:
      query = query.limit(limit)
   result = await db.execute(query)
   return result.scalars().all()


async def create_for_user(
    db: AsyncSession,
    user: User,
    category_id: int,
    amount: float,
    title: str,
    note: str,
    occurred_at: datetime | None = None,
) -> Expense:
    if not await get_category_for_user(db, user, category_id):
       raise CategoryDoesNotExist(f"Category with '{category_id}' does not exist")
    
    if not amount>0:
       raise ValueError("Amount of the expense has to be greater than 0")
    

    payload = {
        "user_id": user.id,
        "category_id": category_id,
        "amount": amount,
        "title": title,
        "note": note,
    }
    if occurred_at is not None:
        payload["occurred_at"] = occurred_at

    expense = Expense(**payload)

    db.add(expense)
    try:
      await db.commit()
      await db.refresh(expense)
    except IntegrityError:
       await db.rollback()
       raise ValueError("Could not create the expense")

    return expense   

 

async def count_for_user(db: AsyncSession, user: User, from_date: datetime = None, to_date:datetime=None):
   filter = [Expense.user_id == user.id]
   _append_date_filters(filter, from_date, to_date)
   query = select(func.count(Expense.id)).where(and_(*filter))
   result =  await db.execute(query)
   return int(result.scalars().one())


async def total_amount_for_user(
   db: AsyncSession,
   user: User,
   from_date: datetime = None,
   to_date: datetime = None,
) -> float:
   filters = [Expense.user_id == user.id]
   _append_date_filters(filters, from_date, to_date)
   query = select(func.coalesce(func.sum(Expense.amount), 0.0)).where(and_(*filters))
   result = await db.execute(query)
   total = result.scalar_one()
   return float(total or 0.0)


async def total_amount_for_month(
   db: AsyncSession,
   user: User,
   *,
   month: int,
   year: int,
) -> float:
   if month < 1 or month > 12:
      raise ValueError("month must be between 1 and 12")
   if year < 1:
      raise ValueError("year must be >= 1")

   start_at = datetime(year, month, 1, 0, 0, 0, tzinfo=timezone.utc)
   if month == 12:
      next_month_start = datetime(year + 1, 1, 1, 0, 0, 0, tzinfo=timezone.utc)
   else:
      next_month_start = datetime(year, month + 1, 1, 0, 0, 0, tzinfo=timezone.utc)
   end_at = next_month_start - timedelta(microseconds=1)

   return await total_amount_for_user(db, user, from_date=start_at, to_date=end_at)

async def update_for_user(db: AsyncSession, user: User, expense_id: int, **fields):
   ALLOW_UPDATE_FIELDS = ["category_id", "amount", "occurred_at", "title", "note"]
   expense = await get_for_user(db, user, expense_id)
   if expense is None:
      return None

   if "category_id" in fields:
      if not await get_category_for_user(db, user, fields["category_id"]):
         raise CategoryDoesNotExist(f"Category with '{fields['category_id']}' does not exist")

   if "amount" in fields and not fields["amount"] > 0:
      raise ValueError("Amount of the expense has to be greater than 0")

   for key, value in fields.items():
      if key not in ALLOW_UPDATE_FIELDS:
         continue
      setattr(expense, key, value)

   await db.commit()
   await db.refresh(expense)
   return expense

async def delete_for_user(db: AsyncSession, user: User, expense_id: int):
   expense = await get_for_user(db, user, expense_id)
   if expense is None:
      return None
   await db.delete(expense)
   await db.commit()
   return expense
