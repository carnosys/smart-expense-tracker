import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ErrorAlert } from "../components/ui/error-alert";
import { Input } from "../components/ui/input";
import { useAuth } from "../features/auth/use-auth";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  const nextPath =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/dashboard";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(nextPath, { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell-grid flex min-h-screen items-center justify-center px-5 py-8">
      <Card className="grid w-full max-w-5xl gap-8 overflow-hidden rounded-[2.5rem] p-4 md:grid-cols-[0.9fr_1.1fr] md:p-5">
        <section className="rounded-[2rem] bg-slate-950 px-6 py-8 text-white md:px-8 md:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Smart Expense Tracker
          </p>
          <h1 className="mt-6 text-3xl font-bold">Welcome back</h1>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
            Sign in to manage your budget, review live category trends, and keep monthly goals on
            track.
          </p>
        </section>

        <section className="rounded-[2rem] bg-white p-6 md:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Secure sign in
              </p>
              <p className="text-2xl font-bold text-slate-950">Enter your account details</p>
            </div>
            {error ? <ErrorAlert message={error} /> : null}
            <Input
              autoComplete="email"
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              autoComplete="current-password"
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-sm text-slate-500">
              New here?{" "}
              <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/register">
                Create your account
              </Link>
            </p>
          </form>
        </section>
      </Card>
    </main>
  );
}
