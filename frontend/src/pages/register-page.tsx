import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ErrorAlert } from "../components/ui/error-alert";
import { Input } from "../components/ui/input";
import { useAuth } from "../features/auth/use-auth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({ username, email, password });
      navigate("/dashboard", { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to register");
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
          <h1 className="mt-6 text-3xl font-bold">Create your account</h1>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
            Start with a clean finance workspace built for budgeting, reports, and repeat expense
            entry.
          </p>
        </section>

        <section className="rounded-[2rem] bg-white p-6 md:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Guided onboarding
              </p>
              <p className="text-2xl font-bold text-slate-950">Set up your secure workspace</p>
            </div>
            {error ? <ErrorAlert message={error} /> : null}
            <Input
              autoComplete="username"
              label="Username"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              autoComplete="email"
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Input
              autoComplete="new-password"
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </section>
      </Card>
    </main>
  );
}
