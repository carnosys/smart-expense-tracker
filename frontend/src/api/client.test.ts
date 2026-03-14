import { describe, expect, it, vi, afterEach } from "vitest";

import { apiRequest } from "./client";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("apiRequest", () => {
  it("adds a bearer token and surfaces backend detail errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ detail: "Invalid email or password" }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest("/users/me", { token: "abc" })).rejects.toMatchObject({
      message: "Invalid email or password",
      status: 400,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/users/me",
      expect.any(Object),
    );

    const requestOptions = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headers = new Headers(requestOptions.headers);
    expect(headers.get("Authorization")).toBe("Bearer abc");
  });
});
