import { Button } from "../../components/ui/button";
import { useAuth } from "../auth/use-auth";

export function Topbar() {
  const { logout, user } = useAuth();

  return (
    <header className="glass-panel flex items-center justify-between rounded-[2rem] px-5 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Active month
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">Financial workspace</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
          {user?.username ?? "Account"}
        </div>
        <Button type="button" variant="secondary" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
}
