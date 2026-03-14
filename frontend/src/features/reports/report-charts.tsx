import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "../../components/ui/card";
import { formatCurrency } from "../../lib/format";
import type { MonthlyReport } from "../../types/reports";

type ReportChartsProps = {
  report: MonthlyReport;
};

const pieColors = ["#2563EB", "#0F766E", "#059669", "#7C3AED", "#F59E0B"];

function buildDailySeries(report: MonthlyReport) {
  const totals = new Map<string, number>();

  report.expenses.forEach((expense) => {
    const dateKey = expense.occurred_at.slice(0, 10);
    totals.set(dateKey, (totals.get(dateKey) ?? 0) + expense.amount);
  });

  return Array.from(totals.entries()).map(([date, amount]) => ({
    date: date.slice(8),
    amount,
  }));
}

export function ReportCharts({ report }: ReportChartsProps) {
  const dailySeries = buildDailySeries(report);

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <Card className="rounded-[2.5rem] px-6 py-6">
        <h2 className="text-xl font-bold text-slate-950">Category breakdown</h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={report.category_breakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category_name" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="total_amount" fill="#2563EB" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-[2.5rem] px-6 py-6">
        <h2 className="text-xl font-bold text-slate-950">Top 5 categories</h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                data={report.top_5_categories}
                dataKey="total_amount"
                nameKey="category_name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
              >
                {report.top_5_categories.map((entry, index) => (
                  <Cell key={entry.category_id} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="rounded-[2.5rem] px-6 py-6 xl:col-span-2">
        <h2 className="text-xl font-bold text-slate-950">Daily spend trend</h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart data={dailySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area
                dataKey="amount"
                stroke="#2563EB"
                fill="#93C5FD"
                fillOpacity={0.35}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
}
