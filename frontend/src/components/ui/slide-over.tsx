import type { PropsWithChildren } from "react";

type SlideOverProps = PropsWithChildren<{
  title: string;
  open: boolean;
  onClose: () => void;
}>;

export function SlideOver({ children, title, open, onClose }: SlideOverProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/35" role="dialog">
      <div className="glass-panel h-full w-full max-w-xl overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-950">{title}</h2>
          <button
            className="cursor-pointer rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
