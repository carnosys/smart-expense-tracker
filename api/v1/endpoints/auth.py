from fastapi import APIRouter, Depends, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from api.depends import get_current_user, get_db
from services.auth_service import get_profile, login_user, register_user
from schemas.users import UserCreate, UserOut, UserLogin, TokenOut
from typing import Annotated
from models.user import User



router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register",status_code = status.HTTP_201_CREATED, response_model = UserOut, summary = "creates a new user")
async def register(
    user: Annotated[UserCreate, Body(...)],
    db: AsyncSession = Depends(get_db),
    ):
    created_user = await register_user(db=db, **user.model_dump())
    return created_user
       

@router.post("/login", status_code = status.HTTP_200_OK, response_model = TokenOut)
async def login(
    user : UserLogin,
    db: AsyncSession = Depends(get_db)
):
    user_token = await login_user(db=db, **user.model_dump())
    return TokenOut(access_token = user_token,
                    token_type = "bearer")
           


@router.get("/me", status_code = status.HTTP_200_OK, response_model = UserOut)
async def me(
    user: User = Depends(get_current_user)
):
    return await get_profile(user)

