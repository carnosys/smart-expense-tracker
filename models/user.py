import datetime, UTC
import re

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, validates
from db.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.now(UTC))

    def __repr__(self) -> str:
        return (
            "User("
            f"id={self.id},"
            f"email={self.email!r},"
            f"created_at={self.created_at}"
            ")"
        )

    @validates("username")
    def validate_username(self, key, value):
        # Keep usernames non-empty at the model layer too.
        if not value or not value.strip():
            raise ValueError("User name cannot be empty")
        return value

    @validates("email")
    def validates_email(self, key, value):
        # Basic RFC 5322-compatible pattern for common emails.
        email_pattern = re.compile(
            r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+"
            r"@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*$"
        )
        if not value or not email_pattern.match(value):
            raise ValueError("Invalid email address format")
        return value
