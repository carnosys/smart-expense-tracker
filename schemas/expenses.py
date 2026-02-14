import datetime

from pydantic import BaseModel

class ExpenseIn(BaseModel):
    category_id: int
    amount: float
    occurred_at: datetime.datetime
    title: str
    note: str


class ExpenseOut(BaseModel):
    id: int
    user_id: int
    category_id: int
    amount: float
    occurred_at: datetime.datetime
    title: str
    note: str

    class Config:
        from_attributes = True
