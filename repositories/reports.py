from models.expense import Expense
from models.user import User
from models.categories import Category
from .categories import list_for_user
from .expenses import list_for_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime

async def monthly_summary(db: AsyncSession, user: User, month: int)-> float:
    query = select(Expense).where(Expense.occurred_at.month == month)
    results = db.execute(query)
    total_expenditure = sum(expense.amount for expense in results.scalars().all())
    return total_expenditure



async def category_breakdown(db: AsyncSession, user: User, from_date : datetime | None = None , to_date: datetime | None = None):
   categories = categories.list_for_user(db, User)
   total_by_category = {}
   for category in categories:
       expenses = expenses.list_for_user(db, user, from_date= from_date, to_date=to_date)
       total_expenditure = sum(expense.amount for expense in expenses)
       total_by_category[f"{category.name}"] = total_expenditure
   return total_by_category    


async def top_categories(db:AsyncSession, user:User):
    query = select(Category.id, Category.name, func.sum(Expense.amount).label("total")).join(Expense, Expense.category_id == Category.id).where(Expense.user_id == user.id, Category.user_id == user.id).group_by(Category.id, Category.name).order_by(desc(func.sum(Expense.amount))).limit(5)
    result = await db.execute(query)
    top_5_categories = result.all()
    return top_5_categories



