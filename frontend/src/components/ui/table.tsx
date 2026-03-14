import type { PropsWithChildren } from "react";

export function Table({ children }: PropsWithChildren) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">{children}</table>
      </div>
    </div>
  );
}

export function TableHead({ children }: PropsWithChildren) {
  return <thead className="bg-slate-50/80">{children}</thead>;
}

export function TableBody({ children }: PropsWithChildren) {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>;
}

export function TableRow({ children }: PropsWithChildren) {
  return <tr className="hover:bg-slate-50/70">{children}</tr>;
}

export function TableHeaderCell({ children }: PropsWithChildren) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      {children}
    </th>
  );
}

export function TableCell({ children }: PropsWithChildren) {
  return <td className="px-4 py-4 text-sm text-slate-700">{children}</td>;
}
