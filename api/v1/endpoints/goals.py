from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.depends import get_current_user, get_db
from models.user import User
from schemas.goals import GoalIn, GoalOut
from services.goals import get_monthly_goals, get_monthly_progress, set_monthly_goals


router = APIRouter(prefix="/goals", tags=["Goals"])


@router.post("", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
async def create_goal(
    payload: GoalIn,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await set_monthly_goals(db, user=user, goal_limit=payload.goal_limit)


@router.put("/{goal_id}", response_model=GoalOut, status_code=status.HTTP_200_OK)
async def update_goal(
    goal_id: int,
    payload: GoalIn,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    goal = await set_monthly_goals(
        db,
        user=user,
        goal_id=goal_id,
        goal_limit=payload.goal_limit,
    )
    if goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal with id '{goal_id}' not found",
        )
    return goal


@router.get("", response_model=GoalOut, status_code=status.HTTP_200_OK)
async def get_latest_goal(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    goal = await get_monthly_goals(db, user=user)
    if goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No goal found for the user",
        )
    return goal


@router.get("/progress", status_code=status.HTTP_200_OK)
async def get_goal_progress(
    month: int = Query(...),
    year: int | None = Query(default=None),
    goal_id: int | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    progress = await get_monthly_progress(
        db,
        user=user,
        month=month,
        year=year,
        goal_id=goal_id,
    )
    if progress is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found for progress calculation",
        )
    return progress


@router.get("/{goal_id}", response_model=GoalOut, status_code=status.HTTP_200_OK)
async def get_goal_by_id(
    goal_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    goal = await get_monthly_goals(db, user=user, goal_id=goal_id)
    if goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal with id '{goal_id}' not found",
        )
    return goal
