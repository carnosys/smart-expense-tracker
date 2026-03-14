import type { ReactNode } from "react";

import { Card } from "./card";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  icon?: ReactNode;
};

export function StatCard({ label, value, hint, accent = "text-slate-900", icon }: StatCardProps) {
  return (
    <Card className="rounded-[2rem] px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className={`metric-mono mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
          {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
        </div>
        {icon ? <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div> : null}
      </div>
    </Card>
  );
}
