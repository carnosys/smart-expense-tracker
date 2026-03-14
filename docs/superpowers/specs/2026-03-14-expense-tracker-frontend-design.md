# Expense Tracker Frontend Design

## Summary

Build a standalone `frontend/` React application for the existing FastAPI backend at `http://localhost:8080/api/v1`. The frontend should feel like a modern finance SaaS product with a polished light-theme glassmorphism aesthetic, a public landing page, and protected authenticated application pages for dashboard, categories, expenses, goals, reports, and profile.

## Product Constraints

- Backend remains separate and continues to run independently.
- Frontend stores the JWT `access_token` locally and sends `Authorization: Bearer <token>` on protected requests.
- The backend contract is taken from the implemented FastAPI routes, not an idealized API.
- Top-level routes stay simple. Create and edit actions happen in overlays:
  - Categories: compact modal
  - Goals: compact modal
  - Expenses: slide-over panel
- The landing page lives at `/`. Authenticated application pages are protected.

## Backend Contract

### Auth

- `POST /users/register`
- `POST /users/login`
- `GET /users/me`

`/users/login` returns:

```json
{
  "access_token": "token",
  "token_type": "bearer"
}
```

### Categories

- `GET /categories`
- `POST /categories`
- `GET /categories/{category_id}`
- `PATCH /categories/{category_id}`
- `DELETE /categories/{category_id}`

### Expenses

- `GET /expenses`
- `POST /expenses`
- `GET /expenses/{expense_id}`
- `PATCH /expenses/{expense_id}`
- `DELETE /expenses/{expense_id}`

Supported list query params:

- `page`
- `limit`
- `category_id`
- `from_date`
- `to_date`
- `sort`

Response shape:

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

### Goals

- `POST /goals`
- `PUT /goals/{goal_id}`
- `GET /goals`
- `GET /goals/{goal_id}`
- `GET /goals/progress?month=<n>&year=<optional>&goal_id=<optional>`

Important backend constraint:

- There is no goals history list endpoint.
- There is no goal delete endpoint.

### Reports

- `GET /reports/monthly?month=<n>`

Important backend constraint:

- The backend currently derives the year server-side.
- The response includes `month_summary`, `category_breakdown`, `top_5_categories`, and `expenses`.

### Error Handling

Primary error shape:

```json
{
  "detail": "message"
}
```

Fallback handling is still needed for FastAPI validation errors (`422`) because those return array-based details.

## UX Direction

The UI should feel trustworthy, sharp, and financially literate rather than decorative-only. The visual direction combines light glassmorphism surfaces with strong contrast, clean data presentation, and a restrained premium motion system.

### Design System

Based on the installed `ui-ux-pro-max` skill output for a fintech SaaS dashboard:

- Pattern: conversion-optimized
- Style: glassmorphism
- Palette:
  - Primary: `#18181B`
  - Secondary: `#3F3F46`
  - CTA: `#2563EB`
  - Background: `#FAFAFA`
  - Text: `#09090B`
- Typography: `Plus Jakarta Sans`
- Effects:
  - backdrop blur
  - subtle visible borders
  - layered gradients
  - restrained depth

### UX Rules

- Use SVG icons from a consistent set, not emojis.
- Keep hover feedback stable without layout shift.
- Respect `prefers-reduced-motion`.
- Use skeleton loading states for async views.
- Keep light glass cards readable with high-opacity surfaces and visible borders.
- Add visible focus states and keyboard support for interactive controls.

## Information Architecture

### Public Routes

- `/`
- `/login`
- `/register`

### Protected Routes

- `/dashboard`
- `/categories`
- `/expenses`
- `/goals`
- `/reports`
- `/profile`

## Page Designs

### Landing Page

- Hero with strong finance copy, app preview, and primary CTA to register
- Secondary CTA to sign in
- Feature sections for:
  - expense control
  - monthly goals
  - reporting clarity
- Trust cues around JWT-secured access and financial visibility

### Login and Register

- Focused centered auth cards
- Clear form labels and validation
- Immediate display of API errors
- Link between login and register flows

### Dashboard

- Hero analytics band highlighting current-month insights
- Summary cards for:
  - monthly spending
  - goal limit
  - remaining budget
  - top categories
  - recent expenses
- Mini visualizations from monthly report data
- Query invalidation to keep the dashboard fresh after CRUD actions elsewhere

### Categories

- Searchable or quickly scannable category table/list
- Create/edit in compact modal
- Delete confirmation
- Empty state when no categories exist

### Expenses

- Filter toolbar with category, date range, and sort controls
- URL-driven query state for filters and pagination
- Paginated table with clear totals and actions
- Create/edit in slide-over panel to keep the table context visible

### Goals

- Current goal spotlight card
- Monthly progress card with remaining budget
- Create or edit latest goal in compact modal
- Messaging that reflects the backend model of “latest goal” rather than historical goals management

### Reports

- Month selector
- Monthly summary cards
- Category breakdown chart
- Top 5 categories visualization
- Daily spend trend derived from report expenses
- Supporting expense list snapshot

### Profile

- Current user details from `/users/me`
- Session controls including logout
- Simple account summary panel

## Architecture

### Frontend Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- Recharts
- Vitest
- React Testing Library

### Application Structure

- Shared application providers at the root
- Public and protected route groups
- Reusable design system components for cards, buttons, tables, forms, alerts, and overlays
- Typed API client with one place for auth headers and error parsing
- Feature-level query hooks and page components

### Authentication Flow

1. User logs in through `/users/login`.
2. Frontend saves `access_token` in local storage.
3. App bootstraps the session by requesting `/users/me`.
4. Protected routes render only when the user is authenticated.
5. `401` responses clear local auth and redirect to `/login`.

### Data Strategy

- TanStack Query manages all server data.
- Protected pages use route-level queries and targeted invalidation after mutations.
- Expenses page stores filters, sort, and pagination in the URL.
- Dashboard and reports use the monthly report endpoint as the main aggregate source.
- Optional short polling or window-focus refetch keeps dashboards feeling live within the backend’s REST model.

## Charts

Chart choices follow the `ui-ux-pro-max` guidance:

- Category comparison: horizontal bar chart
- Top 5 share: donut chart only for small category counts
- Trend over time: line or area chart
- Goal progress: compact progress or bullet-style visualization

For accessibility:

- Pair color with labels and legends
- Keep the donut chart limited to a small number of categories
- Provide text values near chart regions

## Error Handling

- Surface backend `{ detail: string }` messages prominently in forms and pages
- Convert `422` array payloads to readable strings
- Use inline form errors for mutations and page-level alerts for failed data loads
- Preserve current table/filter state when mutations fail

## Testing Strategy

- Cover route access and auth redirects
- Cover API client token injection and error parsing
- Cover login flow and protected app bootstrap
- Cover expenses URL filter synchronization
- Cover category modal, goal modal, and expense slide-over workflows
- Smoke test dashboard and reports rendering with mocked API responses

## Delivery Scope

This work will create a separate `frontend/` application runnable via `npm` without integrating it into Docker. The backend remains unchanged except for repository-local developer docs and workspace ignore rules required to support the new frontend development workflow.
