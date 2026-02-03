from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Time
from db.base import Base
import datetime

class User(Base):
    __tablename__="users"
    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    email : Mapped[str]=mapped_column(String(255), unique = True, index=True, nullable=False)
    password_hash :Mapped[str] = mapped_column(String(255), nullable=False)
    created_at : Mapped[datetime.time] = mapped_column(Time)

    def __repr__(self) -> str:
        return (
            "User("
            f"id={self.id}, "
            f"email={self.email!r}, "
            f"created_at={self.created_at}"
            ")"
        )
