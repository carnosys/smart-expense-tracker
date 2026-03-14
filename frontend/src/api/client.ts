import { API_BASE_URL } from "../lib/env";
import { ApiError, type DetailError, type ValidationIssue } from "../types/api";

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

function normalizeValidationIssues(issues: ValidationIssue[]) {
  return issues
    .map((issue) => {
      const location = issue.loc?.slice(1).join(".");
      if (location && issue.msg) {
        return `${location}: ${issue.msg}`;
      }
      return issue.msg ?? "Validation error";
    })
    .join(", ");
}

async function parseError(response: Response) {
  let payload: DetailError | undefined;

  try {
    payload = (await response.json()) as DetailError;
  } catch {
    payload = undefined;
  }

  if (typeof payload?.detail === "string") {
    return new ApiError(payload.detail, response.status);
  }

  if (Array.isArray(payload?.detail)) {
    return new ApiError(normalizeValidationIssues(payload.detail), response.status);
  }

  return new ApiError("Something went wrong while talking to the server", response.status);
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
