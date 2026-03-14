import { apiRequest } from "./client";
import type { MonthlyReport } from "../types/reports";

export function getMonthlyReport(token: string, month: number) {
  return apiRequest<MonthlyReport>(`/reports/monthly?month=${month}`, { token });
}
