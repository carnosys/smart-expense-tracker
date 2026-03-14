import { Card } from "../components/ui/card";
import { ButtonLink } from "../components/ui/button";

const highlights = [
  { label: "Monthly spend", value: "$4,280", tone: "text-emerald-600" },
  { label: "Budget left", value: "$1,720", tone: "text-blue-600" },
  { label: "Top category", value: "Housing", tone: "text-slate-900" },
];

export function LandingPage() {
  return (
    <main className="app-shell-grid min-h-screen px-5 py-6 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="glass-panel flex items-center justify-between rounded-full px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Smart Expense Tracker
            </p>
          </div>
          <nav className="flex items-center gap-3">
            <ButtonLink to="/login" variant="ghost">
              Sign in
            </ButtonLink>
            <ButtonLink to="/register">Create your account</ButtonLink>
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="relative overflow-hidden rounded-[2.5rem] px-7 py-8 md:px-10 md:py-10">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-600/10 via-cyan-400/10 to-emerald-400/10" />
            <div className="relative flex flex-col gap-7">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Finance clarity for every month
                </p>
                <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-slate-950 md:text-6xl">
                  Clear money movement, confident monthly decisions.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                  Track spending, update monthly goals, and read category-level trends in a
                  dashboard built to feel precise, fast, and trustworthy.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/register" className="px-6 py-3.5">
                  Create your account
                </ButtonLink>
                <ButtonLink to="/login" variant="secondary" className="px-6 py-3.5">
                  Sign in
                </ButtonLink>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-white/70 bg-white/80 px-4 py-4"
                  >
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className={`metric-mono mt-2 text-2xl font-semibold ${item.tone}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="rounded-[2.5rem] p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Live dashboard preview
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-950">March overview</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700">
                JWT secured
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <p className="text-sm text-slate-300">Remaining budget</p>
                <p className="metric-mono mt-3 text-4xl font-semibold">$1,720.00</p>
                <div className="mt-4 h-2 rounded-full bg-white/15">
                  <div className="h-2 w-2/3 rounded-full bg-emerald-400" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-slate-100 p-4">
                  <p className="text-sm text-slate-500">Goal limit</p>
                  <p className="metric-mono mt-2 text-2xl font-semibold text-slate-900">$6,000</p>
                </div>
                <div className="rounded-[1.5rem] bg-slate-100 p-4">
                  <p className="text-sm text-slate-500">Recent expense</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">Groceries</p>
                  <p className="metric-mono mt-1 text-sm text-slate-500">$112.25</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Category performance</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">Top 5 this month</p>
                  </div>
                  <p className="text-sm font-medium text-blue-600">Updated live</p>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ["Housing", "38%"],
                    ["Groceries", "22%"],
                    ["Transport", "14%"],
                  ].map(([name, width]) => (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>{name}</span>
                        <span>{width}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                          style={{ width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
