import datetime

from pydantic import BaseModel


class GoalIn(BaseModel):
    goal_limit: float


class GoalOut(BaseModel):
    id: int
    user_id: int
    created_at: datetime.datetime
    goal_limit: float

    class Config:
        from_attributes = True
