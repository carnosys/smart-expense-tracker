import { apiRequest } from "./client";
import type { Category, CategoryPayload } from "../types/categories";

export function listCategories(token: string) {
  return apiRequest<Category[]>("/categories", { token });
}

export function createCategory(token: string, payload: CategoryPayload) {
  return apiRequest<Category>("/categories", { method: "POST", token, body: payload });
}

export function updateCategory(token: string, categoryId: number, payload: Partial<CategoryPayload>) {
  return apiRequest<Category>(`/categories/${categoryId}`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function deleteCategory(token: string, categoryId: number) {
  return apiRequest<void>(`/categories/${categoryId}`, { method: "DELETE", token });
}
