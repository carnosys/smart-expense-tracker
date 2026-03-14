import { apiRequest } from "./client";
import type { Goal, GoalPayload, GoalProgress } from "../types/goals";

export function getLatestGoal(token: string) {
  return apiRequest<Goal>("/goals", { token });
}

export function createGoal(token: string, payload: GoalPayload) {
  return apiRequest<Goal>("/goals", { method: "POST", token, body: payload });
}

export function updateGoal(token: string, goalId: number, payload: GoalPayload) {
  return apiRequest<Goal>(`/goals/${goalId}`, { method: "PUT", token, body: payload });
}

export function getGoalProgress(
  token: string,
  params: { month: number; year?: number; goal_id?: number },
) {
  const searchParams = new URLSearchParams();
  searchParams.set("month", String(params.month));
  if (params.year !== undefined) {
    searchParams.set("year", String(params.year));
  }
  if (params.goal_id !== undefined) {
    searchParams.set("goal_id", String(params.goal_id));
  }
  return apiRequest<GoalProgress>(`/goals/progress?${searchParams.toString()}`, { token });
}
