# Expense Tracker Frontend Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone React frontend in `frontend/` for the existing FastAPI expense tracker API with public landing/auth flows and protected dashboard, categories, expenses, goals, reports, and profile pages.

**Architecture:** Create a Vite + React + TypeScript + Tailwind application with a shared app shell, typed API client, query-driven data layer, and reusable overlay components. Implement the UI incrementally with TDD, starting from routing and auth, then layering in feature pages and charts around the backend’s real route shapes and constraints.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, Recharts, Vitest, React Testing Library

---

## File Structure

### Core app and tooling

- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.app.json`
- Create: `frontend/tsconfig.node.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/postcss.config.js`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/index.css`
- Create: `frontend/src/app/router.tsx`
- Create: `frontend/src/app/providers.tsx`
- Create: `frontend/src/app/query-client.ts`
- Create: `frontend/src/test/setup.ts`

### Shared types, utils, and API

- Create: `frontend/src/lib/env.ts`
- Create: `frontend/src/lib/storage.ts`
- Create: `frontend/src/lib/format.ts`
- Create: `frontend/src/lib/date.ts`
- Create: `frontend/src/types/api.ts`
- Create: `frontend/src/types/auth.ts`
- Create: `frontend/src/types/categories.ts`
- Create: `frontend/src/types/expenses.ts`
- Create: `frontend/src/types/goals.ts`
- Create: `frontend/src/types/reports.ts`
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/api/auth.ts`
- Create: `frontend/src/api/categories.ts`
- Create: `frontend/src/api/expenses.ts`
- Create: `frontend/src/api/goals.ts`
- Create: `frontend/src/api/reports.ts`

### Auth and layout

- Create: `frontend/src/features/auth/auth-store.tsx`
- Create: `frontend/src/features/auth/use-auth.ts`
- Create: `frontend/src/features/auth/auth-guard.tsx`
- Create: `frontend/src/features/layout/app-shell.tsx`
- Create: `frontend/src/features/layout/sidebar.tsx`
- Create: `frontend/src/features/layout/topbar.tsx`

### Shared UI

- Create: `frontend/src/components/ui/button.tsx`
- Create: `frontend/src/components/ui/input.tsx`
- Create: `frontend/src/components/ui/select.tsx`
- Create: `frontend/src/components/ui/card.tsx`
- Create: `frontend/src/components/ui/stat-card.tsx`
- Create: `frontend/src/components/ui/modal.tsx`
- Create: `frontend/src/components/ui/slide-over.tsx`
- Create: `frontend/src/components/ui/table.tsx`
- Create: `frontend/src/components/ui/empty-state.tsx`
- Create: `frontend/src/components/ui/error-alert.tsx`
- Create: `frontend/src/components/ui/loading-skeleton.tsx`
- Create: `frontend/src/components/ui/badge.tsx`

### Pages and feature components

- Create: `frontend/src/pages/landing-page.tsx`
- Create: `frontend/src/pages/login-page.tsx`
- Create: `frontend/src/pages/register-page.tsx`
- Create: `frontend/src/pages/dashboard-page.tsx`
- Create: `frontend/src/pages/categories-page.tsx`
- Create: `frontend/src/pages/expenses-page.tsx`
- Create: `frontend/src/pages/goals-page.tsx`
- Create: `frontend/src/pages/reports-page.tsx`
- Create: `frontend/src/pages/profile-page.tsx`
- Create: `frontend/src/features/categories/category-form-modal.tsx`
- Create: `frontend/src/features/expenses/expense-form-panel.tsx`
- Create: `frontend/src/features/expenses/expense-filters.tsx`
- Create: `frontend/src/features/goals/goal-form-modal.tsx`
- Create: `frontend/src/features/dashboard/dashboard-summary.tsx`
- Create: `frontend/src/features/reports/report-charts.tsx`

### Tests

- Create: `frontend/src/app/router.test.tsx`
- Create: `frontend/src/api/client.test.ts`
- Create: `frontend/src/features/auth/auth-flow.test.tsx`
- Create: `frontend/src/pages/expenses-page.test.tsx`
- Create: `frontend/src/pages/dashboard-page.test.tsx`
- Create: `frontend/src/pages/reports-page.test.tsx`

## Chunk 1: Frontend Foundation

### Task 1: Scaffold the frontend toolchain and root app

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tsconfig.app.json`
- Create: `frontend/tsconfig.node.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/postcss.config.js`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/index.css`
- Create: `frontend/src/app/providers.tsx`
- Create: `frontend/src/app/query-client.ts`
- Create: `frontend/src/test/setup.ts`
- Test: `frontend/src/app/router.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AppRouter } from "./router";

test("renders landing route by default", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AppRouter />
    </MemoryRouter>,
  );

  expect(screen.getByRole("heading", { name: /clear money movement/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- src/app/router.test.tsx`
Expected: FAIL because the frontend package and router do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create the Vite/Tailwind/Vitest scaffold, root providers, and enough application bootstrapping for tests to mount React components.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- src/app/router.test.tsx`
Expected: PASS

### Task 2: Add shared UI primitives and visual system

**Files:**
- Create: `frontend/src/components/ui/button.tsx`
- Create: `frontend/src/components/ui/input.tsx`
- Create: `frontend/src/components/ui/select.tsx`
- Create: `frontend/src/components/ui/card.tsx`
- Create: `frontend/src/components/ui/stat-card.tsx`
- Create: `frontend/src/components/ui/modal.tsx`
- Create: `frontend/src/components/ui/slide-over.tsx`
- Create: `frontend/src/components/ui/table.tsx`
- Create: `frontend/src/components/ui/empty-state.tsx`
- Create: `frontend/src/components/ui/error-alert.tsx`
- Create: `frontend/src/components/ui/loading-skeleton.tsx`
- Create: `frontend/src/components/ui/badge.tsx`
- Modify: `frontend/src/index.css`
- Test: `frontend/src/app/router.test.tsx`

- [ ] **Step 1: Write the failing test**

Extend `frontend/src/app/router.test.tsx` with an assertion that the landing page renders primary and secondary CTA buttons using shared button styles.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- src/app/router.test.tsx`
Expected: FAIL because the shared UI primitives and styled landing content do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Add the shared design tokens, fonts, utility classes, and reusable UI primitives needed by the landing page and future protected pages.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- src/app/router.test.tsx`
Expected: PASS

## Chunk 2: Routing, Auth, and API Layer

### Task 3: Build the typed API client and error handling

**Files:**
- Create: `frontend/src/lib/env.ts`
- Create: `frontend/src/lib/storage.ts`
- Create: `frontend/src/types/api.ts`
- Create: `frontend/src/types/auth.ts`
- Create: `frontend/src/types/categories.ts`
- Create: `frontend/src/types/expenses.ts`
- Create: `frontend/src/types/goals.ts`
- Create: `frontend/src/types/reports.ts`
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/api/auth.ts`
- Create: `frontend/src/api/categories.ts`
- Create: `frontend/src/api/expenses.ts`
- Create: `frontend/src/api/goals.ts`
- Create: `frontend/src/api/reports.ts`
- Test: `frontend/src/api/client.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from "vitest";

import { apiRequest } from "./client";

describe("apiRequest", () => {
  it("adds a bearer token and surfaces backend detail errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ detail: "Invalid email or password" }),
    }) as unknown as typeof fetch;

    await expect(apiRequest("/users/me", { token: "abc" })).rejects.toMatchObject({
      message: "Invalid email or password",
      status: 400,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- src/api/client.test.ts`
Expected: FAIL because the API client does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create the base API client with:
- `http://localhost:8080/api/v1` base URL
- bearer token support
- `{ detail: string }` parsing
- readable `422` fallback parsing
- typed feature-specific wrappers

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- src/api/client.test.ts`
Expected: PASS

### Task 4: Implement auth store, protected routing, and public auth pages

**Files:**
- Create: `frontend/src/features/auth/auth-store.tsx`
- Create: `frontend/src/features/auth/use-auth.ts`
- Create: `frontend/src/features/auth/auth-guard.tsx`
- Create: `frontend/src/app/router.tsx`
- Create: `frontend/src/pages/landing-page.tsx`
- Create: `frontend/src/pages/login-page.tsx`
- Create: `frontend/src/pages/register-page.tsx`
- Test: `frontend/src/features/auth/auth-flow.test.tsx`
- Test: `frontend/src/app/router.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
test("redirects guests from dashboard to login", async () => {
  renderWithApp("/dashboard");
  expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- src/features/auth/auth-flow.test.tsx`
Expected: FAIL because auth state, route guards, and login/register pages are not implemented.

- [ ] **Step 3: Write minimal implementation**

Implement:
- local token persistence
- bootstrap with `/users/me`
- public landing, login, and register pages
- protected route wrapper
- logout on `401`

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- src/features/auth/auth-flow.test.tsx src/app/router.test.tsx`
Expected: PASS

## Chunk 3: Protected Shell, Dashboard, Categories, and Goals

### Task 5: Add the protected app shell and dashboard page

**Files:**
- Create: `frontend/src/features/layout/app-shell.tsx`
- Create: `frontend/src/features/layout/sidebar.tsx`
- Create: `frontend/src/features/layout/topbar.tsx`
- Create: `frontend/src/pages/dashboard-page.tsx`
- Create: `frontend/src/features/dashboard/dashboard-summary.tsx`
- Create: `frontend/src/lib/format.ts`
- Create: `frontend/src/lib/date.ts`
- Test: `frontend/src/pages/dashboard-page.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
test("renders monthly summary cards from report and goal queries", async () => {
  renderDashboardWithMocks();
  expect(await screen.findByText(/remaining budget/i)).toBeInTheDocument();
  expect(screen.getByText(/\$280\.00/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- src/pages/dashboard-page.test.tsx`
Expected: FAIL because the protected shell and dashboard data composition are not implemented.

- [ ] **Step 3: Write minimal implementation**

Create the authenticated shell and dashboard view using:
- `/reports/monthly`
- `/goals`
- `/goals/progress`
- recent expenses summary

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- src/pages/dashboard-page.test.tsx`
Expected: PASS

### Task 6: Implement categories and goals pages with compact modals

**Files:**
- Create: `frontend/src/pages/categories-page.tsx`
- Create: `frontend/src/pages/goals-page.tsx`
- Create: `frontend/src/features/categories/category-form-modal.tsx`
- Create: `frontend/src/features/goals/goal-form-modal.tsx`
- Modify: `frontend/src/app/router.tsx`
- Test: `frontend/src/features/auth/auth-flow.test.tsx`

- [ ] **Step 1: Write the failing test**

Add a failing interaction test that opens the category modal, submits a create request, and confirms the list refreshes without route changes.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- src/features/auth/auth-flow.test.tsx`
Expected: FAIL because the categories/goals routes and modal workflows do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement:
- categories CRUD table with modal create/edit
- goals current-state view with create/edit modal
- invalidation and inline mutation errors

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- src/features/auth/auth-flow.test.tsx`
Expected: PASS

## Chunk 4: Expenses and Reports

### Task 7: Build the expenses page with URL filters, pagination, and slide-over editor

**Files:**
- Create: `frontend/src/pages/expenses-page.tsx`
- Create: `frontend/src/features/expenses/expense-form-panel.tsx`
- Create: `frontend/src/features/expenses/expense-filters.tsx`
- Modify: `frontend/src/app/router.tsx`
- Test: `frontend/src/pages/expenses-page.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
test("syncs expense filters and pagination with the URL", async () => {
  renderExpenses("/expenses?category_id=2&sort=-amount&page=2");
  expect(await screen.findByDisplayValue(/highest amount/i)).toBeInTheDocument();
  expect(screen.getByText(/page 2 of 4/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- src/pages/expenses-page.test.tsx`
Expected: FAIL because the expenses route, query handling, and slide-over are not implemented.

- [ ] **Step 3: Write minimal implementation**

Implement:
- query-param driven filters and pagination
- expense list table
- category/date/sort controls
- create/edit slide-over
- CRUD invalidation preserving current URL state

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- src/pages/expenses-page.test.tsx`
Expected: PASS

### Task 8: Build reports and profile pages with charts and account details

**Files:**
- Create: `frontend/src/pages/reports-page.tsx`
- Create: `frontend/src/pages/profile-page.tsx`
- Create: `frontend/src/features/reports/report-charts.tsx`
- Modify: `frontend/src/app/router.tsx`
- Test: `frontend/src/pages/reports-page.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
test("renders category breakdown and top five charts from the monthly report", async () => {
  renderReportsWithMocks();
  expect(await screen.findByText(/category breakdown/i)).toBeInTheDocument();
  expect(screen.getByText(/top 5 categories/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd frontend && npm test -- src/pages/reports-page.test.tsx`
Expected: FAIL because the reports and profile pages are not implemented.

- [ ] **Step 3: Write minimal implementation**

Implement:
- reports page with monthly summary, category breakdown bar chart, top 5 donut, and spend trend
- profile page using `/users/me`
- route wiring for both pages

- [ ] **Step 4: Run test to verify it passes**

Run: `cd frontend && npm test -- src/pages/reports-page.test.tsx`
Expected: PASS

## Chunk 5: Full Verification

### Task 9: Run the frontend verification suite

**Files:**
- Verify only

- [ ] **Step 1: Run focused tests**

Run: `cd frontend && npm test -- src/app/router.test.tsx src/api/client.test.ts src/features/auth/auth-flow.test.tsx src/pages/dashboard-page.test.tsx src/pages/expenses-page.test.tsx src/pages/reports-page.test.tsx`
Expected: PASS

- [ ] **Step 2: Run the full test suite**

Run: `cd frontend && npm test`
Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `cd frontend && npm run build`
Expected: PASS with generated production assets

- [ ] **Step 4: Manual smoke verification**

Run: `cd frontend && npm run dev`
Expected: Local app starts successfully and can connect to `http://localhost:8080/api/v1`

- [ ] **Step 5: Commit**

```bash
git add frontend docs/superpowers/specs/2026-03-14-expense-tracker-frontend-design.md docs/superpowers/plans/2026-03-14-expense-tracker-frontend.md .gitignore
git commit -m "feat: add expense tracker frontend"
```
