import os
import sys
from datetime import UTC, datetime
from pathlib import Path
from collections.abc import Generator
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient


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
def client(db_session: object, test_user: SimpleNamespace) -> Generator[TestClient, None, None]:
    async def override_get_db():
        yield db_session

    async def override_get_current_user():
        return test_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    with TestClient(app) as test_client:
        yield test_client

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
