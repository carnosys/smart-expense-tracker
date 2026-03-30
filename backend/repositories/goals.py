from typing import Optional

from sqlalchemy import and_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from models.goals import Goal
from models.user import User


async def get_for_user(db: AsyncSession, user: User, goal_id: int) -> Optional[Goal]:
    query = select(Goal).where(and_(Goal.id == goal_id, Goal.user_id == user.id))
    result = await db.execute(query)
    return result.scalars().one_or_none()


async def get_latest_for_user(db: AsyncSession, user: User) -> Optional[Goal]:
    query = (
        select(Goal)
        .where(Goal.user_id == user.id)
        .order_by(Goal.created_at.desc(), Goal.id.desc())
        .limit(1)
    )
    result = await db.execute(query)
    return result.scalars().first()


async def create_goal(db: AsyncSession, user: User, goal_limit: float) -> Goal:
    if goal_limit <= 0:
        raise ValueError("Goal limit has to be greater than 0")

    goal = Goal(user_id=user.id, goal_limit=goal_limit)
    db.add(goal)

    try:
        await db.commit()
        await db.refresh(goal)
    except IntegrityError:
        await db.rollback()
        raise ValueError("Could not create the goal")

    return goal


async def update_goal(db: AsyncSession, user: User, goal_id: int, **fields) -> Optional[Goal]:
    ALLOW_UPDATE_FIELDS = ["goal_limit"]

    goal = await get_for_user(db, user, goal_id)
    if goal is None:
        return None

    if "goal_limit" in fields and fields["goal_limit"] <= 0:
        raise ValueError("Goal limit has to be greater than 0")

    for key, value in fields.items():
        if key not in ALLOW_UPDATE_FIELDS:
            continue
        setattr(goal, key, value)

    await db.commit()
    await db.refresh(goal)
    return goal


async def delete_goal(db: AsyncSession, user: User, goal_id: int) -> Optional[Goal]:
    goal = await get_for_user(db, user, goal_id)
    if goal is None:
        return None

    await db.delete(goal)
    await db.commit()
    return goal


# Compatibility aliases with the existing repository naming style.
async def create_for_user(db: AsyncSession, user: User, goal_limit: float) -> Goal:
    return await create_goal(db, user, goal_limit)


async def update_for_user(db: AsyncSession, user: User, goal_id: int, **fields) -> Optional[Goal]:
    return await update_goal(db, user, goal_id, **fields)


async def delete_for_user(db: AsyncSession, user: User, goal_id: int) -> Optional[Goal]:
    return await delete_goal(db, user, goal_id)
