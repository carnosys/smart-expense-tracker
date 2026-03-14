import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { Providers } from "../app/providers";
import { AppRouter } from "../app/router";
import { ACCESS_TOKEN_KEY } from "../lib/storage";

beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem(ACCESS_TOKEN_KEY, "existing-token");
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("renders monthly summary cards from report and goal queries", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn((input) => {
      const url = String(input);

      if (url.endsWith("/users/me")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            id: 1,
            username: "tester",
            email: "tester@example.com",
            created_at: "2026-03-13T00:00:00Z",
          }),
        });
      }

      if (url.includes("/reports/monthly?month=")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            month: 3,
            year: 2026,
            start_at: "2026-03-01T00:00:00+00:00",
            end_at: "2026-03-31T23:59:59.999999+00:00",
            month_summary: {
              total_expenses: 2,
              total_amount: 220,
            },
            category_breakdown: [
              {
                category_id: 1,
                category_name: "Housing",
                total_amount: 140,
                total_expenses: 1,
              },
            ],
            top_5_categories: [
              {
                category_id: 1,
                category_name: "Housing",
                total_amount: 140,
                total_expenses: 1,
              },
            ],
            expenses: [
              {
                id: 9,
                category_id: 2,
                category_name: "Groceries",
                amount: 80,
                occurred_at: "2026-03-10T12:30:00Z",
                title: "Weekly stock-up",
                note: "Produce and pantry",
              },
            ],
          }),
        });
      }

      if (url.endsWith("/goals")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            id: 1,
            user_id: 1,
            created_at: "2026-03-01T00:00:00Z",
            goal_limit: 500,
          }),
        });
      }

      if (url.includes("/goals/progress?month=")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            goal_id: 1,
            month: 3,
            year: 2026,
            goal_limit: 500,
            total_expense: 220,
            difference: 280,
          }),
        });
      }

      if (url.includes("/expenses?page=1&limit=5&sort=-occurred_at")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            items: [
              {
                id: 9,
                user_id: 1,
                category_id: 2,
                amount: 80,
                occurred_at: "2026-03-10T12:30:00Z",
                title: "Weekly stock-up",
                note: "Produce and pantry",
              },
            ],
            meta: {
              page: 1,
              limit: 5,
              total: 1,
              pages: 1,
            },
          }),
        });
      }

      return Promise.resolve({
        ok: false,
        status: 404,
        json: async () => ({ detail: `Unhandled URL ${url}` }),
      });
    }),
  );

  render(
    <Providers>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AppRouter />
      </MemoryRouter>
    </Providers>,
  );

  expect(await screen.findByText(/remaining budget/i)).toBeInTheDocument();
  expect(screen.getByText("$280.00")).toBeInTheDocument();
  expect(screen.getAllByText("Housing").length).toBeGreaterThan(0);
  expect(screen.getByText("Weekly stock-up")).toBeInTheDocument();
});
