type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="glass-panel rounded-[2rem] px-6 py-10 text-center">
      <p className="text-lg font-semibold text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
    </div>
  );
}
