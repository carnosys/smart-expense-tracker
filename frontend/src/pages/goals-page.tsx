import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createGoal, getGoalProgress, getLatestGoal, updateGoal } from "../api/goals";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorAlert } from "../components/ui/error-alert";
import { StatCard } from "../components/ui/stat-card";
import { useAuth } from "../features/auth/use-auth";
import { GoalFormModal } from "../features/goals/goal-form-modal";
import { getCurrentMonthNumber } from "../lib/date";
import { formatCurrency } from "../lib/format";
import { ApiError } from "../types/api";

async function fetchLatestGoalSafe(token: string) {
  try {
    return await getLatestGoal(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

async function fetchGoalProgressSafe(token: string, month: number) {
  try {
    return await getGoalProgress(token, { month });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function GoalsPage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const currentMonth = getCurrentMonthNumber();
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goalQuery = useQuery({
    queryKey: ["goals", "latest"],
    queryFn: () => fetchLatestGoalSafe(token!),
  });

  const progressQuery = useQuery({
    queryKey: ["goals", "progress", currentMonth],
    queryFn: () => fetchGoalProgressSafe(token!, currentMonth),
  });

  const saveGoalMutation = useMutation({
    mutationFn: async (payload: { goal_limit: number }) => {
      if (goalQuery.data) {
        return updateGoal(token!, goalQuery.data.id, payload);
      }
      return createGoal(token!, payload);
    },
    onSuccess: async () => {
      setError(null);
      setModalOpen(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["goals", "latest"] }),
        queryClient.invalidateQueries({ queryKey: ["goals", "progress"] }),
      ]);
    },
    onError: (caughtError) => {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save goal");
    },
  });

  return (
    <main className="space-y-6">
      <Card className="rounded-[2.5rem] px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Goals</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Set the monthly guardrails</h1>
          </div>
          <Button onClick={() => setModalOpen(true)} type="button">
            {goalQuery.data ? "Update goal" : "Set goal"}
          </Button>
        </div>
      </Card>

      {goalQuery.error || progressQuery.error ? (
        <ErrorAlert
          message={
            goalQuery.error instanceof Error
              ? goalQuery.error.message
              : progressQuery.error instanceof Error
                ? progressQuery.error.message
                : "Unable to load goal data"
          }
        />
      ) : null}

      {goalQuery.data ? (
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Goal limit"
            value={formatCurrency(goalQuery.data.goal_limit)}
            hint="Latest monthly target"
            accent="text-blue-700"
          />
          <StatCard
            label="Total expense"
            value={
              progressQuery.data ? formatCurrency(progressQuery.data.total_expense) : "Not available"
            }
            hint="Current month spend"
            accent="text-slate-950"
          />
          <StatCard
            label="Remaining budget"
            value={progressQuery.data ? formatCurrency(progressQuery.data.difference) : "Not available"}
            hint="Difference between goal and spend"
            accent={progressQuery.data && progressQuery.data.difference < 0 ? "text-red-600" : "text-emerald-600"}
          />
        </section>
      ) : (
        <EmptyState
          description="Create a goal so the dashboard can calculate how much room is left this month."
          title="No active monthly goal"
        />
      )}

      <GoalFormModal
        error={error}
        goal={goalQuery.data ?? null}
        isSubmitting={saveGoalMutation.isPending}
        onClose={() => setModalOpen(false)}
        onSubmit={(payload) => saveGoalMutation.mutateAsync(payload)}
        open={modalOpen}
      />
    </main>
  );
}
