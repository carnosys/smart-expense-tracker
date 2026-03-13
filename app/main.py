from fastapi import FastAPI

from api.exception_handlers import register_exception_handlers
from api.v1.api import api_router
from core.logging import setup_logging
from core.middleware import register_middleware

app = FastAPI()

setup_logging("INFO")
register_middleware(app)
register_exception_handlers(app)
app.include_router(api_router)


@app.get("/health")
async def get_health():
    """Lightweight health-check endpoint."""
    return {"health": "ok"}
