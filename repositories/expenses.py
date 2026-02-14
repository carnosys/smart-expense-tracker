from ..models.expenses import Expense
from ..models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from .categories import get_for_user as get_category_for_user
from sqlalchemy import select, and_, asc, desc, func
from datetime import datetime
from typing import List

class CategoryDoesNotExist(Exception):
   pass


async def get_for_user(db: AsyncSession, user: User, expense_id: int):
   query = select(Expense).where(and_(Expense.user_id == user.id, Expense.id == expense_id))
   result = await db.execute(query)
   return result.scalars().one_or_none()


async def list_for_user(db: AsyncSession, user: User,*, page: int | None = None, limit:int | None = None,  category_id:int=None, from_date :datetime =None, to_date:datetime=None, sort:str="-occurred_date" )->List[Expense]:
   if page is not None and limit is not None:
    if page < 1:
        raise ValueError("page must be >= 1")
    if limit < 1:
        raise ValueError("limit must be >= 1")
    offset = (page-1)*limit

   filters=[Expense.user_id == user.id]

   if category_id is not None:
       if not await get_category_for_user(db, user, category_id):
          raise CategoryDoesNotExist(f"Category with '{category_id}' does not exist")
       filters.append(Expense.category_id == category_id)

   if from_date is not None and to_date is not None:
      filters.append(Expense.occurred_at.between(from_date, to_date))
   elif from_date is not None:
      filters.append(Expense.occurred_at >= from_date)
   elif to_date is not None:
      filters.append(Expense.occurred_at <= to_date)

   sort_map = {
        "occurred_at": Expense.occurred_at,
        "amount": Expense.amount,
        "created_at": Expense.created_at,
    } 
   
   direction = desc if sort.startswith("-") else asc
   sort_key = sort[1:] if sort.startswith("-") else sort
   sort_col = sort_map.get(sort_key)


   query = select(Expense).where(and_(*filters)).order_by(direction(sort_col)).offset(offset).limit(limit)
   result = await db.execute(query)
   return result.scalars().all()


async def create_for_user(db:AsyncSession, user: User, category_id: int, amount:float, title:str, note: str):
    if not await get_category_for_user(db, user, category_id):
       raise CategoryDoesNotExist(f"Category with '{category_id}' does not exist")
    
    if not amount>0:
       raise ValueError("Amount of the expense has to be greater than 0")
    

    expense = Expense(
        user_id=user.id,
        category_id=category_id,
        amount=amount,
        title=title,
        note=note,
    )

    db.add(expense)
    try:
      await db.commit()
      await db.refresh(expense)
    except IntegrityError:
       await db.rollback()
       raise ValueError("Could not create the expense")    

 

async def count_for_user(db: AsyncSession, user: User, from_date: datetime = None, to_date:datetime=None):
   filter = [Expense.user_id == user.id]
   if from_date is not None and to_date is not None:
      filter.append(Expense.occurred_at.between(from_date,to_date))
   elif from_date is not None:
      filter.append(Expense.occurred_at >= from_date)
   elif to_date is not None:
      filter.append(Expense.occurred_at <= to_date)
   query = select(func.count(Expense.id)).where(and_(*filter))
   result =  await db.execute(query)
   return result.scalars().one()

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


