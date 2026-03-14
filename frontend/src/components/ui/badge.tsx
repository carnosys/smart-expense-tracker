import type { PropsWithChildren } from "react";

type BadgeProps = PropsWithChildren<{
  tone?: "neutral" | "positive";
}>;

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const toneClass =
    tone === "positive"
      ? "bg-emerald-500/10 text-emerald-700"
      : "bg-slate-100 text-slate-600";

  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${toneClass}`}>{children}</span>;
}
