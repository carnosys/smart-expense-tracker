# Endpoint Tests Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `TestClient`-based route tests that call every FastAPI endpoint and verify status codes, response bodies, and service wiring.

**Architecture:** Build a shared pytest harness that seeds required env vars before importing the app, overrides auth and DB dependencies, and uses `unittest.mock` patching against endpoint-module service symbols. Implement tests in small route-group batches so each batch follows red-green verification before moving on.

**Tech Stack:** Python, pytest, FastAPI `TestClient`, unittest.mock

---

## Chunk 1: Test Harness

### Task 1: Add test dependencies

**Files:**
- Modify: `requirements.txt`
- Modify: `docker/requirements.txt`

- [ ] **Step 1: Write the failing test**

```python
def test_healthcheck():
    response = client.get("/health")
    assert response.status_code == 200
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_health.py::test_healthcheck -v`
Expected: FAIL because `pytest` or the test files are not available yet.

- [ ] **Step 3: Write minimal implementation**

Add:
- `pytest`
- `httpx`

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_health.py::test_healthcheck -v`
Expected: still failing until the harness is added in Task 2.

### Task 2: Create shared pytest fixtures

**Files:**
- Create: `tests/conftest.py`

- [ ] **Step 1: Write the failing test**

```python
def test_healthcheck(client):
    response = client.get("/health")
    assert response.status_code == 200
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_health.py::test_healthcheck -v`
Expected: FAIL because the `client` fixture does not exist and app import needs env vars.

- [ ] **Step 3: Write minimal implementation**

Add fixtures/helpers for:
- required env vars before importing `app.main`
- `client`
- fake authenticated user
- dependency override installation/cleanup
- sample payload builders

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_health.py::test_healthcheck -v`
Expected: PASS once the health test file exists.

## Chunk 2: Health And Auth Routes

### Task 3: Test `/health`

**Files:**
- Create: `tests/test_health.py`
- Test: `tests/test_health.py`

- [ ] **Step 1: Write the failing test**

```python
def test_healthcheck(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"health": "ok"}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_health.py::test_healthcheck -v`
Expected: FAIL until the file is created.

- [ ] **Step 3: Write minimal implementation**

Create the health route test.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_health.py::test_healthcheck -v`
Expected: PASS

### Task 4: Test auth endpoints

**Files:**
- Create: `tests/test_auth.py`
- Test: `tests/test_auth.py`

- [ ] **Step 1: Write the failing test**

```python
def test_register_returns_created_user(client):
    ...
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_auth.py -v`
Expected: FAIL until route tests and patches are in place.

- [ ] **Step 3: Write minimal implementation**

Cover:
- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `GET /api/v1/users/me`
- custom-handler cases for duplicate email and invalid credentials
- `422` validation for malformed auth payloads

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_auth.py -v`
Expected: PASS

## Chunk 3: Categories And Expenses Routes

### Task 5: Test category endpoints

**Files:**
- Create: `tests/test_categories.py`
- Test: `tests/test_categories.py`

- [ ] **Step 1: Write the failing test**

```python
def test_list_categories_returns_service_items(client):
    ...
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_categories.py -v`
Expected: FAIL until the route tests are implemented.

- [ ] **Step 3: Write minimal implementation**

Cover:
- list/create/get/update/delete
- endpoint-generated `404` for `None` returns
- custom-handler `409` for duplicate category
- `422` validation for malformed create payloads

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_categories.py -v`
Expected: PASS

### Task 6: Test expense endpoints

**Files:**
- Create: `tests/test_expenses.py`
- Test: `tests/test_expenses.py`

- [ ] **Step 1: Write the failing test**

```python
def test_list_expenses_returns_items_and_meta(client):
    ...
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_expenses.py -v`
Expected: FAIL until the route tests are implemented.

- [ ] **Step 3: Write minimal implementation**

Cover:
- list/create/get/update/delete
- query param forwarding for list filters
- endpoint-generated `404` for missing expense
- custom-handler `404` for missing category during create/update
- `422` validation for malformed expense payloads

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_expenses.py -v`
Expected: PASS

## Chunk 4: Goals And Reports Routes

### Task 7: Test goal endpoints

**Files:**
- Create: `tests/test_goals.py`
- Test: `tests/test_goals.py`

- [ ] **Step 1: Write the failing test**

```python
def test_create_goal_returns_created_goal(client):
    ...
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_goals.py -v`
Expected: FAIL until the route tests are implemented.

- [ ] **Step 3: Write minimal implementation**

Cover:
- create/update/get latest/get by id/get progress
- endpoint-generated `404` for `None` goal results
- `422` validation for missing required query/body fields

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_goals.py -v`
Expected: PASS

### Task 8: Test report endpoint

**Files:**
- Create: `tests/test_reports.py`
- Test: `tests/test_reports.py`

- [ ] **Step 1: Write the failing test**

```python
def test_monthly_report_returns_service_payload(client):
    ...
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_reports.py -v`
Expected: FAIL until the route tests are implemented.

- [ ] **Step 3: Write minimal implementation**

Cover:
- `GET /api/v1/reports/monthly`
- query param forwarding
- `422` validation when `month` is missing

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_reports.py -v`
Expected: PASS

## Chunk 5: Verification

### Task 9: Run the endpoint suite

**Files:**
- Test: `tests/`

- [ ] **Step 1: Write the failing test**

Use the accumulated suite from prior tasks.

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests -v`
Expected: any failures reflect incomplete route coverage or fixture issues.

- [ ] **Step 3: Write minimal implementation**

Fix only the specific failures surfaced by the route suite.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests -v`
Expected: PASS
