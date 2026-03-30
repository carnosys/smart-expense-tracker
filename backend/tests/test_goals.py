from datetime import UTC, datetime
from unittest.mock import AsyncMock, patch

from api.v1.endpoints import goals as goal_endpoints


def test_create_goal_returns_created_goal(client, db_session, test_user, goal_payload):
    created = {
        "id": 1,
        "user_id": 1,
        "created_at": datetime(2026, 3, 13, tzinfo=UTC),
        "goal_limit": 500.0,
    }

    with patch.object(
        goal_endpoints,
        "set_monthly_goals",
        AsyncMock(return_value=created),
    ) as set_monthly_goals_mock:
        response = client.post("/api/v1/goals", json=goal_payload)

    assert response.status_code == 201
    assert response.json() == {
        "id": 1,
        "user_id": 1,
        "created_at": "2026-03-13T00:00:00Z",
        "goal_limit": 500.0,
    }
    set_monthly_goals_mock.assert_awaited_once_with(
        db_session,
        user=test_user,
        goal_limit=500.0,
    )


def test_create_goal_validates_payload(client):
    response = client.post("/api/v1/goals", json={})

    assert response.status_code == 422


def test_update_goal_returns_updated_goal(client, db_session, test_user, goal_payload):
    updated = {
        "id": 2,
        "user_id": 1,
        "created_at": datetime(2026, 3, 13, tzinfo=UTC),
        "goal_limit": 650.0,
    }

    with patch.object(
        goal_endpoints,
        "set_monthly_goals",
        AsyncMock(return_value=updated),
    ) as set_monthly_goals_mock:
        response = client.put("/api/v1/goals/2", json={"goal_limit": 650.0})

    assert response.status_code == 200
    assert response.json() == {
        "id": 2,
        "user_id": 1,
        "created_at": "2026-03-13T00:00:00Z",
        "goal_limit": 650.0,
    }
    set_monthly_goals_mock.assert_awaited_once_with(
        db_session,
        user=test_user,
        goal_id=2,
        goal_limit=650.0,
    )


def test_update_goal_returns_not_found_when_missing(client):
    with patch.object(
        goal_endpoints,
        "set_monthly_goals",
        AsyncMock(return_value=None),
    ):
        response = client.put("/api/v1/goals/999", json={"goal_limit": 650.0})

    assert response.status_code == 404
    assert response.json() == {"detail": "Goal with id '999' not found"}


def test_get_latest_goal_returns_goal(client, db_session, test_user):
    expected = {
        "id": 3,
        "user_id": 1,
        "created_at": datetime(2026, 3, 13, tzinfo=UTC),
        "goal_limit": 450.0,
    }

    with patch.object(
        goal_endpoints,
        "get_monthly_goals",
        AsyncMock(return_value=expected),
    ) as get_monthly_goals_mock:
        response = client.get("/api/v1/goals")

    assert response.status_code == 200
    assert response.json() == {
        "id": 3,
        "user_id": 1,
        "created_at": "2026-03-13T00:00:00Z",
        "goal_limit": 450.0,
    }
    get_monthly_goals_mock.assert_awaited_once_with(db_session, user=test_user)


def test_get_latest_goal_returns_not_found_when_missing(client):
    with patch.object(
        goal_endpoints,
        "get_monthly_goals",
        AsyncMock(return_value=None),
    ):
        response = client.get("/api/v1/goals")

    assert response.status_code == 404
    assert response.json() == {"detail": "No goal found for the user"}


def test_get_goal_progress_returns_summary(client, db_session, test_user):
    expected = {
        "goal_id": 1,
        "month": 3,
        "year": 2026,
        "goal_limit": 500.0,
        "total_expense": 220.0,
        "difference": 280.0,
    }

    with patch.object(
        goal_endpoints,
        "get_monthly_progress",
        AsyncMock(return_value=expected),
    ) as get_monthly_progress_mock:
        response = client.get("/api/v1/goals/progress", params={"month": 3, "year": 2026, "goal_id": 1})

    assert response.status_code == 200
    assert response.json() == expected
    get_monthly_progress_mock.assert_awaited_once_with(
        db_session,
        user=test_user,
        month=3,
        year=2026,
        goal_id=1,
    )


def test_get_goal_progress_returns_not_found_when_missing(client):
    with patch.object(
        goal_endpoints,
        "get_monthly_progress",
        AsyncMock(return_value=None),
    ):
        response = client.get("/api/v1/goals/progress", params={"month": 3})

    assert response.status_code == 404
    assert response.json() == {"detail": "Goal not found for progress calculation"}


def test_get_goal_progress_validates_required_query(client):
    response = client.get("/api/v1/goals/progress")

    assert response.status_code == 422


def test_get_goal_by_id_returns_goal(client, db_session, test_user):
    expected = {
        "id": 4,
        "user_id": 1,
        "created_at": datetime(2026, 3, 13, tzinfo=UTC),
        "goal_limit": 700.0,
    }

    with patch.object(
        goal_endpoints,
        "get_monthly_goals",
        AsyncMock(return_value=expected),
    ) as get_monthly_goals_mock:
        response = client.get("/api/v1/goals/4")

    assert response.status_code == 200
    assert response.json() == {
        "id": 4,
        "user_id": 1,
        "created_at": "2026-03-13T00:00:00Z",
        "goal_limit": 700.0,
    }
    get_monthly_goals_mock.assert_awaited_once_with(db_session, user=test_user, goal_id=4)


def test_get_goal_by_id_returns_not_found_when_missing(client):
    with patch.object(
        goal_endpoints,
        "get_monthly_goals",
        AsyncMock(return_value=None),
    ):
        response = client.get("/api/v1/goals/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Goal with id '999' not found"}
