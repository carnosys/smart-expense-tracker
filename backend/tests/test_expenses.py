from datetime import UTC, datetime
from unittest.mock import AsyncMock, patch

from api.v1.endpoints import expenses as expense_endpoints
from exceptions.expenses import CategoryDoesNotExist


def test_list_expenses_returns_items_and_meta(client, db_session, test_user):
    from_date = datetime(2026, 3, 1, tzinfo=UTC)
    to_date = datetime(2026, 3, 31, 23, 59, 59, tzinfo=UTC)
    items = [
        {
            "id": 1,
            "user_id": 1,
            "category_id": 9,
            "amount": 42.5,
            "occurred_at": "2026-03-10T12:30:00Z",
            "title": "Lunch",
            "note": "Team lunch",
        }
    ]
    meta = {"page": 2, "limit": 10, "total": 21, "pages": 3}

    with patch.object(
        expense_endpoints,
        "list_expenses",
        AsyncMock(return_value=(items, meta)),
    ) as list_expenses_mock:
        response = client.get(
            "/api/v1/expenses",
            params={
                "page": 2,
                "limit": 10,
                "category_id": 9,
                "from_date": "2026-03-01T00:00:00Z",
                "to_date": "2026-03-31T23:59:59Z",
                "sort": "-amount",
            },
        )

    assert response.status_code == 200
    assert response.json() == {"items": items, "meta": meta}
    list_expenses_mock.assert_awaited_once_with(
        db_session,
        user=test_user,
        page=2,
        limit=10,
        filters={
            "category_id": 9,
            "from_date": from_date,
            "to_date": to_date,
            "sort": "-amount",
        },
    )


def test_create_expense_returns_created_item(client, db_session, test_user, expense_payload):
    occurred_at = datetime(2026, 3, 10, 12, 30, tzinfo=UTC)
    created = {
        "id": 2,
        "user_id": 1,
        **expense_payload,
        "occurred_at": occurred_at,
    }

    with patch.object(
        expense_endpoints,
        "create_expense",
        AsyncMock(return_value=created),
    ) as create_expense_mock:
        response = client.post("/api/v1/expenses", json=expense_payload)

    assert response.status_code == 201
    assert response.json() == {
        "id": 2,
        "user_id": 1,
        "category_id": 9,
        "amount": 42.5,
        "occurred_at": "2026-03-10T12:30:00Z",
        "title": "Lunch",
        "note": "Team lunch",
    }
    create_expense_mock.assert_awaited_once_with(
        db_session,
        user=test_user,
        payload={**expense_payload, "occurred_at": occurred_at},
    )


def test_create_expense_returns_not_found_for_missing_category(client, expense_payload):
    with patch.object(
        expense_endpoints,
        "create_expense",
        AsyncMock(side_effect=CategoryDoesNotExist("Category with '9' does not exist")),
    ):
        response = client.post("/api/v1/expenses", json=expense_payload)

    assert response.status_code == 404
    assert response.json() == {"detail": "Category with '9' does not exist"}


def test_create_expense_validates_payload(client):
    response = client.post(
        "/api/v1/expenses",
        json={"category_id": 9, "occurred_at": "2026-03-10T12:30:00Z", "title": "Lunch", "note": "x"},
    )

    assert response.status_code == 422


def test_get_expense_returns_item(client, db_session, test_user):
    expected = {
        "id": 3,
        "user_id": 1,
        "category_id": 9,
        "amount": 10.0,
        "occurred_at": "2026-03-10T12:30:00Z",
        "title": "Coffee",
        "note": "Morning",
    }

    with patch.object(
        expense_endpoints,
        "get_expense",
        AsyncMock(return_value=expected),
    ) as get_expense_mock:
        response = client.get("/api/v1/expenses/3")

    assert response.status_code == 200
    assert response.json() == expected
    get_expense_mock.assert_awaited_once_with(db_session, user=test_user, expense_id=3)


def test_get_expense_returns_not_found_when_missing(client):
    with patch.object(
        expense_endpoints,
        "get_expense",
        AsyncMock(return_value=None),
    ):
        response = client.get("/api/v1/expenses/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Expense with id '999' not found"}


def test_update_expense_returns_updated_item(client, db_session, test_user):
    payload = {"amount": 55.0, "note": "Updated"}
    expected = {
        "id": 4,
        "user_id": 1,
        "category_id": 9,
        "amount": 55.0,
        "occurred_at": "2026-03-10T12:30:00Z",
        "title": "Lunch",
        "note": "Updated",
    }

    with patch.object(
        expense_endpoints,
        "update_expense",
        AsyncMock(return_value=expected),
    ) as update_expense_mock:
        response = client.patch("/api/v1/expenses/4", json=payload)

    assert response.status_code == 200
    assert response.json() == expected
    update_expense_mock.assert_awaited_once_with(
        db_session,
        user=test_user,
        expense_id=4,
        payload=payload,
    )


def test_update_expense_returns_not_found_when_missing(client):
    with patch.object(
        expense_endpoints,
        "update_expense",
        AsyncMock(return_value=None),
    ):
        response = client.patch("/api/v1/expenses/999", json={"amount": 55.0})

    assert response.status_code == 404
    assert response.json() == {"detail": "Expense with id '999' not found"}


def test_delete_expense_returns_no_content(client, db_session, test_user):
    existing = {"id": 5}

    with (
        patch.object(
            expense_endpoints,
            "get_expense",
            AsyncMock(return_value=existing),
        ) as get_expense_mock,
        patch.object(
            expense_endpoints,
            "delete_expense",
            AsyncMock(return_value=None),
        ) as delete_expense_mock,
    ):
        response = client.delete("/api/v1/expenses/5")

    assert response.status_code == 204
    assert response.content == b""
    get_expense_mock.assert_awaited_once_with(db_session, user=test_user, expense_id=5)
    delete_expense_mock.assert_awaited_once_with(db_session, user=test_user, expense_id=5)


def test_delete_expense_returns_not_found_when_missing(client):
    with patch.object(
        expense_endpoints,
        "get_expense",
        AsyncMock(return_value=None),
    ):
        response = client.delete("/api/v1/expenses/999")

    assert response.status_code == 404
    assert response.json() == {"detail": "Expense with id '999' not found"}
