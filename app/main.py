from fastapi import FastAPI

from core.logging import setup_logging
from core.middleware import register_middleware

app = FastAPI()

setup_logging("INFO")
register_middleware(app)


@app.get("/health")
async def get_health():
    """Lightweight health-check endpoint."""
    return {"health": "ok"}
