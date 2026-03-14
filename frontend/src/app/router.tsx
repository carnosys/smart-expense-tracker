import { Navigate, Route, Routes } from "react-router-dom";

import { AuthGuard } from "../features/auth/auth-guard";
import { AppShell } from "../features/layout/app-shell";
import { CategoriesPage } from "../pages/categories-page";
import { DashboardPage } from "../pages/dashboard-page";
import { ExpensesPage } from "../pages/expenses-page";
import { GoalsPage } from "../pages/goals-page";
import { LandingPage } from "../pages/landing-page";
import { LoginPage } from "../pages/login-page";
import { ProfilePage } from "../pages/profile-page";
import { RegisterPage } from "../pages/register-page";
import { ReportsPage } from "../pages/reports-page";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<AuthGuard />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
