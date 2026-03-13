from fastapi import APIRouter

from api.v1.endpoints.auth import router as auth_router
from api.v1.endpoints.categories import router as categories_router
from api.v1.endpoints.expenses import router as expenses_router
from api.v1.endpoints.goals import router as goals_router
from api.v1.endpoints.reports import router as reports_router


api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(categories_router)
api_router.include_router(expenses_router)
api_router.include_router(goals_router)
api_router.include_router(reports_router)
