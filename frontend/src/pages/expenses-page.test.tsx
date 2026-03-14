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

it("syncs expense filters and pagination with the URL", async () => {
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

      if (url.endsWith("/categories")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => [
            { id: 2, name: "Groceries", description: "Food shopping" },
            { id: 3, name: "Transport", description: "Ride sharing" },
          ],
        });
      }

      if (url.includes("/expenses?")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            items: [
              {
                id: 9,
                user_id: 1,
                category_id: 2,
                amount: 120,
                occurred_at: "2026-03-10T12:30:00Z",
                title: "Bulk grocery order",
                note: "Pantry refill",
              },
            ],
            meta: {
              page: 2,
              limit: 20,
              total: 75,
              pages: 4,
            },
          }),
        });
      }

      if (url.includes("/goals") || url.includes("/reports")) {
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
      <MemoryRouter
        initialEntries={[
          "/expenses?category_id=2&sort=-amount&page=2&from_date=2026-03-01&to_date=2026-03-31",
        ]}
      >
        <AppRouter />
      </MemoryRouter>
    </Providers>,
  );

  expect(await screen.findByDisplayValue("Highest amount")).toBeInTheDocument();
  expect(await screen.findByDisplayValue("Groceries")).toBeInTheDocument();
  expect(await screen.findByText("Page 2 of 4")).toBeInTheDocument();
  expect(await screen.findByText("Bulk grocery order")).toBeInTheDocument();
});
