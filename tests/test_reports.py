from unittest.mock import AsyncMock, patch

from api.v1.endpoints import reports as report_endpoints


def test_monthly_report_returns_service_payload(client, db_session, test_user):
    expected = {
        "month": 3,
        "year": 2026,
        "month_summary": {"total_expenses": 2, "total_amount": 70.0},
        "category_breakdown": [],
        "top_5_categories": [],
        "expenses": [],
        "start_at": "2026-03-01T00:00:00+00:00",
        "end_at": "2026-03-31T23:59:59.999999+00:00",
    }

    with patch.object(
        report_endpoints,
        "get_monthly_report",
        AsyncMock(return_value=expected),
    ) as get_monthly_report_mock:
        response = client.get("/api/v1/reports/monthly", params={"month": 3})

    assert response.status_code == 200
    assert response.json() == expected
    get_monthly_report_mock.assert_awaited_once_with(db_session, test_user, month=3)


def test_monthly_report_validates_required_query(client):
    response = client.get("/api/v1/reports/monthly")

    assert response.status_code == 422
