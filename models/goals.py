from db.base import Base
from sqlalchemy.orm import mapped_column, Mapped
from sqlalchemy import DateTime, String, Integer, Float, ForeignKey, CheckConstraint
import datetime
from user import User 
class Goal(Base):

    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(Integer, primary_key =True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", on_delete="CASCADE")) 
    created_at:Mapped[datetime.datetime] = mapped_column(datetime.datetime, default = datetime.datetime.now(datetime.UTC))  
    goal_limit: Mapped[float] = mapped_column(Float, CheckConstraint("goal_limit > 0"))



    