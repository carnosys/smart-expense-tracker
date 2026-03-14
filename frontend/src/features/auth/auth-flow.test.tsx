import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Providers } from "../../app/providers";
import { AppRouter } from "../../app/router";
import { ACCESS_TOKEN_KEY } from "../../lib/storage";

function renderWithApp(route: string) {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[route]}>
        <AppRouter />
      </MemoryRouter>
    </Providers>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("auth routing", () => {
  it("redirects guests from dashboard to login", async () => {
    renderWithApp("/dashboard");

    expect(await screen.findByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  it("keeps a stored session on the dashboard after profile bootstrap", async () => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, "existing-token");

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
              month_summary: { total_expenses: 0, total_amount: 0 },
              category_breakdown: [],
              top_5_categories: [],
              expenses: [],
            }),
          });
        }

        if (url.endsWith("/goals")) {
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ detail: "No goal found for the user" }),
          });
        }

        if (url.includes("/goals/progress?month=")) {
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ detail: "Goal not found for progress calculation" }),
          });
        }

        if (url.includes("/expenses?page=1&limit=5&sort=-occurred_at")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              items: [],
              meta: { page: 1, limit: 5, total: 0, pages: 0 },
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

    renderWithApp("/dashboard");

    expect(await screen.findByRole("heading", { name: /spending overview/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});
