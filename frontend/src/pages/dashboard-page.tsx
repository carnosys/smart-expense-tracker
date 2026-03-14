import { useQuery } from "@tanstack/react-query";

import { listExpenses } from "../api/expenses";
import { getLatestGoal, getGoalProgress } from "../api/goals";
import { getMonthlyReport } from "../api/reports";
import { Card } from "../components/ui/card";
import { LoadingSkeleton } from "../components/ui/loading-skeleton";
import { DashboardSummary } from "../features/dashboard/dashboard-summary";
import { useAuth } from "../features/auth/use-auth";
import { getCurrentMonthNumber, formatMonthName } from "../lib/date";
import { ApiError } from "../types/api";

async function fetchLatestGoal(token: string) {
  try {
    return await getLatestGoal(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

async function fetchGoalProgress(token: string, month: number) {
  try {
    return await getGoalProgress(token, { month });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function DashboardPage() {
  const { token } = useAuth();
  const currentMonth = getCurrentMonthNumber();

  const reportQuery = useQuery({
    queryKey: ["reports", "monthly", currentMonth],
    queryFn: () => getMonthlyReport(token!, currentMonth),
  });

  const goalQuery = useQuery({
    queryKey: ["goals", "latest"],
    queryFn: () => fetchLatestGoal(token!),
  });

  const progressQuery = useQuery({
    queryKey: ["goals", "progress", currentMonth],
    queryFn: () => fetchGoalProgress(token!, currentMonth),
  });

  const recentExpensesQuery = useQuery({
    queryKey: ["expenses", "recent"],
    queryFn: () => listExpenses(token!, { page: 1, limit: 5, sort: "-occurred_at" }),
  });

  if (
    reportQuery.isLoading ||
    goalQuery.isLoading ||
    progressQuery.isLoading ||
    recentExpensesQuery.isLoading
  ) {
    return (
      <main className="space-y-4">
        <LoadingSkeleton className="h-40 w-full rounded-[2.5rem]" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <LoadingSkeleton className="h-36 w-full rounded-[2rem]" />
          <LoadingSkeleton className="h-36 w-full rounded-[2rem]" />
          <LoadingSkeleton className="h-36 w-full rounded-[2rem]" />
          <LoadingSkeleton className="h-36 w-full rounded-[2rem]" />
        </div>
      </main>
    );
  }

  if (reportQuery.error || recentExpensesQuery.error) {
    return (
      <Card className="rounded-[2.5rem] px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Spending overview</h1>
        <p className="mt-4 text-sm leading-7 text-red-600">
          Unable to load the monthly dashboard. Refresh or try again after the API is available.
        </p>
      </Card>
    );
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Dashboard
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {formatMonthName(currentMonth)} finance view
          </p>
        </div>
      </div>
      <DashboardSummary
        goal={goalQuery.data ?? null}
        progress={progressQuery.data ?? null}
        recentExpenses={recentExpensesQuery.data?.items ?? []}
        report={reportQuery.data!}
      />
    </main>
  );
}
