from datetime import UTC, datetime
from unittest.mock import AsyncMock, patch

from api.v1.endpoints import auth as auth_endpoints
from exceptions.users import EmailAlreadyExists, InvalidCredentials


def test_register_returns_created_user(client, db_session):
    created_at = datetime(2026, 3, 13, tzinfo=UTC)
    created_user = {
        "id": 1,
        "username": "tester",
        "email": "tester@example.com",
        "created_at": created_at,
    }

    with patch.object(
        auth_endpoints,
        "register_user",
        AsyncMock(return_value=created_user),
    ) as register_user_mock:
        response = client.post(
            "/api/v1/users/register",
            json={
                "username": "tester",
                "email": "tester@example.com",
                "password": "secret123",
            },
        )

    assert response.status_code == 201
    assert response.json() == {
        "id": 1,
        "username": "tester",
        "email": "tester@example.com",
        "created_at": "2026-03-13T00:00:00Z",
    }
    register_user_mock.assert_awaited_once_with(
        db=db_session,
        username="tester",
        email="tester@example.com",
        password="secret123",
    )


def test_register_returns_conflict_for_duplicate_email(client):
    with patch.object(
        auth_endpoints,
        "register_user",
        AsyncMock(side_effect=EmailAlreadyExists("User with tester@example.com already exists")),
    ):
        response = client.post(
            "/api/v1/users/register",
            json={
                "username": "tester",
                "email": "tester@example.com",
                "password": "secret123",
            },
        )

    assert response.status_code == 409
    assert response.json() == {"detail": "User with tester@example.com already exists"}


def test_register_validates_payload(client):
    response = client.post(
        "/api/v1/users/register",
        json={"username": "tester", "password": "secret123"},
    )

    assert response.status_code == 422


def test_login_returns_bearer_token(client, db_session):
    with patch.object(
        auth_endpoints,
        "login_user",
        AsyncMock(return_value="signed-token"),
    ) as login_user_mock:
        response = client.post(
            "/api/v1/users/login",
            json={"email": "tester@example.com", "password": "secret123"},
        )

    assert response.status_code == 200
    assert response.json() == {
        "access_token": "signed-token",
        "token_type": "bearer",
    }
    login_user_mock.assert_awaited_once_with(
        db=db_session,
        email="tester@example.com",
        password="secret123",
    )


def test_login_returns_bad_request_for_invalid_credentials(client):
    with patch.object(
        auth_endpoints,
        "login_user",
        AsyncMock(side_effect=InvalidCredentials("Invalid email or password")),
    ):
        response = client.post(
            "/api/v1/users/login",
            json={"email": "tester@example.com", "password": "wrong"},
        )

    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid email or password"}


def test_me_returns_current_profile(client, test_user):
    expected_user = {
        "id": test_user.id,
        "username": test_user.username,
        "email": test_user.email,
        "created_at": test_user.created_at,
    }

    with patch.object(
        auth_endpoints,
        "get_profile",
        AsyncMock(return_value=expected_user),
    ) as get_profile_mock:
        response = client.get("/api/v1/users/me")

    assert response.status_code == 200
    assert response.json() == {
        "id": test_user.id,
        "username": test_user.username,
        "email": test_user.email,
        "created_at": "2026-03-13T00:00:00Z",
    }
    get_profile_mock.assert_awaited_once_with(test_user)
