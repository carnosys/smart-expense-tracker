# Smart Expense Tracker

Smart Expense Tracker is a full-stack personal finance app for tracking expenses, organizing categories, setting monthly goals, and reviewing spending trends from a single dashboard.

## Features

- JWT-based authentication with register, login, and profile endpoints
- Expense management with create, list, update, delete, filtering, and pagination
- Custom spending categories
- Monthly goal tracking with progress insights
- Monthly reporting for dashboard and charts
- Dockerized frontend, backend, and PostgreSQL services

## Screenshots

### Landing Page

The entry point of the app with the main product message and authentication actions.

![Landing Page](./pictures_for_readme/landing_page.png)

### Dashboard

The monthly overview showing spending, budget progress, and high-level insights.

![Dashboard](./pictures_for_readme/dash_board.png)

### Expenses

The core expense management interface for reviewing and tracking transactions.

![Expenses](./pictures_for_readme/expense.png)

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Recharts
- Tailwind CSS

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- PyJWT

## Project Structure

```text
smart-expense-tracker/
├── backend/      # FastAPI app, models, services, tests, and migrations
├── frontend/     # React app, routes, UI components, and feature modules
├── docs/         # Project planning and supporting documentation
└── docker-compose.yml
```

## Quick Start With Docker

1. Create a root `.env` file.
2. Add the required variables:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=smart_expenses
POSTGRES_PORT=5432
JWT_SECRET=change-this-secret
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

3. Start the stack:

```bash
docker compose up --build
```

4. Open the app:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- FastAPI docs: `http://localhost:8080/docs`

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

If you are running PostgreSQL outside Docker, set `POSTGRES_HOST=localhost` in your environment before starting the API.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects `VITE_API_BASE_URL` to point to the backend API and falls back to `http://localhost:8080/api/v1`.

## Testing

### Backend tests

```bash
cd backend
pytest
```

### Frontend tests

```bash
cd frontend
npm test
```

## API Overview

All API routes are served under `/api/v1`.

### Authentication

- `POST /users/register`
- `POST /users/login`
- `GET /users/me`

### Expenses

- `GET /expenses`
- `POST /expenses`
- `GET /expenses/{expense_id}`
- `PATCH /expenses/{expense_id}`
- `DELETE /expenses/{expense_id}`

### Categories

- `GET /categories`
- `POST /categories`
- `GET /categories/{category_id}`
- `PATCH /categories/{category_id}`
- `DELETE /categories/{category_id}`

### Goals

- `POST /goals`
- `PUT /goals/{goal_id}`
- `GET /goals`
- `GET /goals/progress`
- `GET /goals/{goal_id}`

### Reports

- `GET /reports/monthly`

## Health Check

The backend exposes a simple health endpoint:

```text
GET /health
```

Expected response:

```json
{"health":"ok"}
```
