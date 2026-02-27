import re
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from core.security import create_access_token, hash_password, verify_hashed_password, get_current_user
from models.user import User
from repositories import users as users_repo
from repositories.users import EmailAlreadyExists, UserLookupField
from fastapi import Depends
from api.depends import get_current_user


def _validate_registration_input(username: str, email: str, password: str) -> None:
    if not username or not username.strip():
        raise ValueError("Username is required")

    if not email or not email.strip():
        raise ValueError("Email is required")

    email_pattern = re.compile(
        r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+"
        r"@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*$"
    )
    if not email_pattern.match(email):
        raise ValueError("Invalid email address format")

    if not password:
        raise ValueError("Password is required")


async def register_user(
    db: AsyncSession, *, username: str, email: str, password: str
) -> User:
    _validate_registration_input(username, email, password)

    existing_user = await users_repo.get_by_field(db, UserLookupField.EMAIL, email)
    if existing_user is not None:
        raise EmailAlreadyExists(f"User with {email} already exists")

    hashed_password = hash_password(password)
    return await users_repo.create(
        db,
        username=username.strip(),
        email=email.strip(),
        password_hash=hashed_password,
    )


async def authenticate_user(
    db: AsyncSession, *, email: str, password: str
) -> Optional[User]:
    if not email or not email.strip():
        raise ValueError("Email is required")
    if not password:
        raise ValueError("Password is required")

    user = await users_repo.get_by_field(db, UserLookupField.EMAIL, email.strip())
    if user is None:
        return None

    if not verify_hashed_password(password, user.password_hash):
        return None

    return user


async def login_user(db: AsyncSession, *, email: str, password: str) -> str:
    user = await authenticate_user(db, email=email, password=password)
    if user is None:
        raise ValueError("Invalid email or password")

    access_token = create_access_token(subject=user.email)
    return access_token


async def get_profile(user: User = Depends(get_current_user)):
    return user

