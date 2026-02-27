from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy import Float, Integer, String, DateTime, Text, ForeignKey, CheckConstraint
from db.base import Base
import datetime 

def utc_now():
    return datetime.datetime.now(datetime.UTC)

class Expense(Base):
    __tablename__="expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id:Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id", ondelete="CASCADE"))
    amount:Mapped[float] = mapped_column(Float, CheckConstraint("amount > 0"))
    occurred_at:Mapped[datetime.datetime] = mapped_column(DateTime, default = utc_now)
    title : Mapped[str] = mapped_column(String(50))
    note : Mapped[str]= mapped_column(Text)

    @validates("amount")
    def validate_amount(self, key, value):
        if value<=0:
            raise ValueError("amount must be greater than 0")
        return value    
    
    @validates("title")
    def validates_title(self, key, value):
        if len(value)==0:
            raise ValueError("Title cannot be empty")
        return value    