from unittest.mock import AsyncMock, patch

from api.v1.endpoints import categories as category_endpoints
from exceptions.categories import CategoryAlreadyExists


def test_list_categories_returns_service_items(client, db_session, test_user):
    expected = [{"id": 1, "name": "Food", "description": "Meals"}]

    with patch.object(
        category_endpoints,
        "list_categories",
        AsyncMock(return_value=expected),
    ) as list_categories_mock:
        response = client.get("/api/v1/categories")

    assert response.status_code == 200
    assert response.json() == expected
    list_categories_mock.assert_awaited_once_with(db_session, user=test_user)


def test_create_category_returns_created_item(client, db_session, test_user, category_payload):
    created = {"id": 2, **category_payload}

    with patch.object(
        category_endpoints,
        "create_category",
        AsyncMock(return_value=created),
    ) as create_category_mock:
        response = client.post("/api/v1/categories", json=category_payload)

    assert response.status_code == 201
    assert response.json() == created
    create_category_mock.assert_awaited_once_with(
        db_session,
        user=test_user,
        payload=category_payload,
    )


def test_create_category_returns_conflict_when_duplicate(client, category_payload):
    with patch.object(
        category_endpoints,
        "create_category",
        AsyncMock(side_effect=CategoryAlreadyExists("Food already exists")),
    ):
        response = client.post("/api/v1/categories", json=category_payload)

    assert response.status_code == 409
    assert response.json() == {"detail": "Food already exists"}


def test_create_category_validates_payload(client):
    response = client.post("/api/v1/categories", json={"name": "Food"})

    assert response.status_code == 422


def test_get_category_returns_item(client, db_session, test_user):
    expected = {"id": 3, "name": "Travel", "description": "Trips"}

    with patch.object(
        category_endpoints,
        "get_category",
        AsyncMock(return_value=expected),
    ) as get_category_mock:
        response = client.get("/api/v1/categories/3")

    assert response.status_code == 200
    assert response.json() == expected
    get_category_mock.assert_awaited_once_with(db_session, user=test_user, category_id=3)


def test_get_category_returns_not_found_when_missing(client):
    with patch.object(
        category_endpoints,
        "get_category",
        AsyncMock(return_value=None),
    ):
        response = client.get("/api/v1/categories/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Category with id '999' not found"}


def test_update_category_returns_updated_item(client, db_session, test_user):
    payload = {"name": "Updated"}
    expected = {"id": 4, "name": "Updated", "description": "desc"}

    with patch.object(
        category_endpoints,
        "update_category",
        AsyncMock(return_value=expected),
    ) as update_category_mock:
        response = client.patch("/api/v1/categories/4", json=payload)

    assert response.status_code == 200
    assert response.json() == expected
    update_category_mock.assert_awaited_once_with(
        db_session,
        user=test_user,
        category_id=4,
        payload=payload,
    )


def test_update_category_returns_not_found_when_missing(client):
    with patch.object(
        category_endpoints,
        "update_category",
        AsyncMock(return_value=None),
    ):
        response = client.patch("/api/v1/categories/999", json={"name": "Updated"})

    assert response.status_code == 404
    assert response.json() == {"detail": "Category with id '999' not found"}


def test_delete_category_returns_no_content(client, db_session, test_user):
    deleted = {"id": 5, "name": "Bills", "description": "Monthly"}

    with patch.object(
        category_endpoints,
        "delete_category",
        AsyncMock(return_value=deleted),
    ) as delete_category_mock:
        response = client.delete("/api/v1/categories/5")

    assert response.status_code == 204
    assert response.content == b""
    delete_category_mock.assert_awaited_once_with(db_session, user=test_user, category_id=5)


def test_delete_category_returns_not_found_when_missing(client):
    with patch.object(
        category_endpoints,
        "delete_category",
        AsyncMock(return_value=None),
    ):
        response = client.delete("/api/v1/categories/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Category with id '999' not found"}
