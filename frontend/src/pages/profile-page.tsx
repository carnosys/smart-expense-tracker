import { Card } from "../components/ui/card";
import { StatCard } from "../components/ui/stat-card";
import { useAuth } from "../features/auth/use-auth";

export function ProfilePage() {
  const { user, token } = useAuth();

  return (
    <main className="space-y-6">
      <Card className="rounded-[2.5rem] px-6 py-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Profile</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Account details</h1>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Username" value={user?.username ?? "Unknown"} accent="text-slate-950" />
        <StatCard label="Email" value={user?.email ?? "Unknown"} accent="text-slate-950" />
        <StatCard
          label="Session"
          value={token ? "Authenticated" : "Signed out"}
          accent={token ? "text-emerald-600" : "text-slate-500"}
        />
        <StatCard label="Member since" value={user?.created_at.slice(0, 10) ?? "Unknown"} accent="text-slate-950" />
      </section>
    </main>
  );
}
