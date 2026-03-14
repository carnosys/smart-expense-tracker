import { apiRequest } from "./client";
import type { Expense, ExpenseListResponse, ExpensePayload } from "../types/expenses";

type ListExpenseParams = Record<string, string | number | undefined>;

function toQueryString(params: ListExpenseParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function listExpenses(token: string, params: ListExpenseParams = {}) {
  return apiRequest<ExpenseListResponse>(`/expenses${toQueryString(params)}`, { token });
}

export function createExpense(token: string, payload: ExpensePayload) {
  return apiRequest<Expense>("/expenses", { method: "POST", token, body: payload });
}

export function updateExpense(token: string, expenseId: number, payload: Partial<ExpensePayload>) {
  return apiRequest<Expense>(`/expenses/${expenseId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function deleteExpense(token: string, expenseId: number) {
  return apiRequest<void>(`/expenses/${expenseId}`, { method: "DELETE", token });
}
