import os
import sys
import asyncio
from datetime import UTC, datetime
from pathlib import Path
from types import SimpleNamespace

import httpx
import pytest


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


os.environ.setdefault("POSTGRES_USER", "test_user")
os.environ.setdefault("POSTGRES_PASSWORD", "test_password")
os.environ.setdefault("POSTGRES_DB", "test_db")
os.environ.setdefault("POSTGRES_HOST", "localhost")
os.environ.setdefault("POSTGRES_PORT", "5432")
os.environ.setdefault("JWT_SECRET", "test-secret")

from api.depends import get_current_user, get_db
from app.main import app


class SyncASGIClient:
    def __init__(self, app):
        self.app = app

    async def _request(self, method: str, url: str, **kwargs):
        transport = httpx.ASGITransport(app=self.app)
        async with httpx.AsyncClient(
            transport=transport,
            base_url="http://testserver",
        ) as client:
            return await client.request(method, url, **kwargs)

    def request(self, method: str, url: str, **kwargs):
        return asyncio.run(self._request(method, url, **kwargs))

    def get(self, url: str, **kwargs):
        return self.request("GET", url, **kwargs)

    def post(self, url: str, **kwargs):
        return self.request("POST", url, **kwargs)

    def patch(self, url: str, **kwargs):
        return self.request("PATCH", url, **kwargs)

    def put(self, url: str, **kwargs):
        return self.request("PUT", url, **kwargs)

    def delete(self, url: str, **kwargs):
        return self.request("DELETE", url, **kwargs)


@pytest.fixture
def db_session() -> object:
    return object()


@pytest.fixture
def test_user() -> SimpleNamespace:
    return SimpleNamespace(
        id=1,
        username="tester",
        email="tester@example.com",
        created_at=datetime(2026, 3, 13, tzinfo=UTC),
    )


@pytest.fixture
def client(db_session: object, test_user: SimpleNamespace) -> SyncASGIClient:
    async def override_get_db():
        yield db_session

    async def override_get_current_user():
        return test_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    try:
        yield SyncASGIClient(app)
    finally:
        app.dependency_overrides.clear()


@pytest.fixture
def category_payload() -> dict[str, str]:
    return {"name": "Food", "description": "Meals and groceries"}


@pytest.fixture
def expense_payload() -> dict[str, object]:
    return {
        "category_id": 9,
        "amount": 42.5,
        "occurred_at": "2026-03-10T12:30:00Z",
        "title": "Lunch",
        "note": "Team lunch",
    }


@pytest.fixture
def goal_payload() -> dict[str, float]:
    return {"goal_limit": 500.0}
