import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMonthlyReport } from "../api/reports";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { ErrorAlert } from "../components/ui/error-alert";
import { Select } from "../components/ui/select";
import { StatCard } from "../components/ui/stat-card";
import { useAuth } from "../features/auth/use-auth";
import { ReportCharts } from "../features/reports/report-charts";
import { getCurrentMonthNumber } from "../lib/date";
import { formatCurrency } from "../lib/format";

const monthOptions = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

export function ReportsPage() {
  const { token } = useAuth();
  const [month, setMonth] = useState(String(getCurrentMonthNumber()));

  const reportQuery = useQuery({
    queryKey: ["reports", "monthly", month],
    queryFn: () => getMonthlyReport(token!, Number(month)),
  });

  return (
    <main className="space-y-6">
      <Card className="rounded-[2.5rem] px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Reports</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">Monthly report center</h1>
          </div>
          <div className="w-full max-w-xs">
            <Select
              label="Month"
              options={monthOptions}
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
          </div>
        </div>
      </Card>

      {reportQuery.error ? (
        <ErrorAlert
          message={
            reportQuery.error instanceof Error
              ? reportQuery.error.message
              : "Unable to load the monthly report"
          }
        />
      ) : null}

      {reportQuery.data ? (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Total spend"
              value={formatCurrency(reportQuery.data.month_summary.total_amount)}
            />
            <StatCard
              label="Expense count"
              value={String(reportQuery.data.month_summary.total_expenses)}
            />
            <StatCard
              label="Top category"
              value={reportQuery.data.top_5_categories[0]?.category_name ?? "No data"}
            />
          </section>

          <ReportCharts report={reportQuery.data} />

          <Card className="rounded-[2.5rem] px-6 py-6">
            <h2 className="text-xl font-bold text-slate-950">Expense highlights</h2>
            <div className="mt-6 space-y-3">
              {reportQuery.data.expenses.map((expense) => (
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
            </div>
          </Card>
        </>
      ) : (
        <EmptyState
          description="Choose a month after your first expenses are tracked to unlock report charts."
          title="No report data yet"
        />
      )}
    </main>
  );
}
