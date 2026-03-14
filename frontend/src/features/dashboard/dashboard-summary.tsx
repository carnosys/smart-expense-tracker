import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { StatCard } from "../../components/ui/stat-card";
import { formatCurrency } from "../../lib/format";
import type { Expense } from "../../types/expenses";
import type { Goal, GoalProgress } from "../../types/goals";
import type { MonthlyReport } from "../../types/reports";

type DashboardSummaryProps = {
  goal: Goal | null;
  progress: GoalProgress | null;
  report: MonthlyReport;
  recentExpenses: Expense[];
};

export function DashboardSummary({
  goal,
  progress,
  report,
  recentExpenses,
}: DashboardSummaryProps) {
  const topCategories = report.top_5_categories ?? [];
  const topCategory = topCategories[0];
  const reportExpenses = report.expenses ?? [];
  const recentItems = recentExpenses.length > 0 ? recentExpenses : reportExpenses;

  return (
    <div className="space-y-6">
      <Card className="rounded-[2.5rem] bg-slate-950 px-7 py-8 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
              Real-time month snapshot
            </p>
            <h1 className="mt-3 text-4xl font-bold">Spending overview</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Stay ahead of overspending with live budget math, top-category signals, and a recent
              expense stream that updates after every change.
            </p>
          </div>
          <Badge tone="positive">{formatCurrency(report.month_summary.total_amount)} tracked</Badge>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly spending"
          value={formatCurrency(report.month_summary.total_amount)}
          hint={`${report.month_summary.total_expenses} expense entries`}
          accent="text-slate-950"
        />
        <StatCard
          label="Goal limit"
          value={goal ? formatCurrency(goal.goal_limit) : "Not set"}
          hint={goal ? "Latest monthly target" : "Create a monthly goal to track remaining budget"}
          accent="text-blue-700"
        />
        <StatCard
          label="Remaining budget"
          value={progress ? formatCurrency(progress.difference) : "Not available"}
          hint={progress ? `Spent ${formatCurrency(progress.total_expense)} so far` : "Goal progress unavailable"}
          accent={progress && progress.difference < 0 ? "text-red-600" : "text-emerald-600"}
        />
        <StatCard
          label="Top category"
          value={topCategory?.category_name ?? "No data"}
          hint={topCategory ? formatCurrency(topCategory.total_amount) : "Add expenses to unlock category insights"}
          accent="text-slate-950"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[2.5rem] px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Category intensity</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">Top categories</h2>
            </div>
            <Badge>{topCategories.length} tracked</Badge>
          </div>

          <div className="mt-6 space-y-4">
            {topCategories.map((category) => {
              const ratio =
                report.month_summary.total_amount > 0
                  ? Math.round((category.total_amount / report.month_summary.total_amount) * 100)
                  : 0;

              return (
                <div key={category.category_id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{category.category_name ?? "Uncategorized"}</span>
                    <span>{ratio}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400"
                      style={{ width: `${Math.max(ratio, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {topCategories.length === 0 ? (
              <p className="text-sm text-slate-500">No category data yet.</p>
            ) : null}
          </div>
        </Card>

        <Card className="rounded-[2.5rem] px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Recent activity</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">Recent expenses</h2>
            </div>
            <Badge>{recentItems.length} items</Badge>
          </div>

          <div className="mt-6 space-y-3">
            {recentItems.map((expense) => (
              <div
                key={expense.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{expense.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{expense.note || "No note added"}</p>
                  </div>
                  <p className="metric-mono text-sm font-semibold text-slate-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              </div>
            ))}
            {recentItems.length === 0 ? (
              <p className="text-sm text-slate-500">No recent expenses yet.</p>
            ) : null}
          </div>
        </Card>
      </section>
    </div>
  );
}
