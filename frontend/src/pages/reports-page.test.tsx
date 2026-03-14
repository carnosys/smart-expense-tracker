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

it("renders category breakdown and top five charts from the monthly report", async () => {
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
            month_summary: { total_expenses: 3, total_amount: 320 },
            category_breakdown: [
              { category_id: 1, category_name: "Housing", total_amount: 140, total_expenses: 1 },
              { category_id: 2, category_name: "Groceries", total_amount: 120, total_expenses: 1 },
            ],
            top_5_categories: [
              { category_id: 1, category_name: "Housing", total_amount: 140, total_expenses: 1 },
              { category_id: 2, category_name: "Groceries", total_amount: 120, total_expenses: 1 },
            ],
            expenses: [
              {
                id: 1,
                category_id: 1,
                category_name: "Housing",
                amount: 140,
                occurred_at: "2026-03-02T12:30:00Z",
                title: "Rent top-up",
                note: "March installment",
              },
              {
                id: 2,
                category_id: 2,
                category_name: "Groceries",
                amount: 120,
                occurred_at: "2026-03-10T12:30:00Z",
                title: "Weekly groceries",
                note: "Produce",
              },
            ],
          }),
        });
      }

      if (url.includes("/goals") || url.includes("/expenses") || url.includes("/categories")) {
        return Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({ detail: "Not used in this test" }),
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
      <MemoryRouter initialEntries={["/reports"]}>
        <AppRouter />
      </MemoryRouter>
    </Providers>,
  );

  expect(await screen.findByText(/category breakdown/i)).toBeInTheDocument();
  expect(screen.getByText(/top 5 categories/i)).toBeInTheDocument();
  expect(screen.getByText("Rent top-up")).toBeInTheDocument();
});
