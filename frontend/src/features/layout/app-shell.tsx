import { Outlet } from "react-router-dom";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell() {
  return (
    <div className="app-shell-grid min-h-screen px-5 py-6 md:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[16rem_1fr]">
        <Sidebar />
        <div className="space-y-6">
          <Topbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
