import { NavLink } from "react-router-dom";

const items = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Categories", to: "/categories" },
  { label: "Expenses", to: "/expenses" },
  { label: "Goals", to: "/goals" },
  { label: "Reports", to: "/reports" },
  { label: "Profile", to: "/profile" },
];

export function Sidebar() {
  return (
    <aside className="glass-panel hidden w-64 rounded-[2rem] p-6 lg:block">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        Smart Expense Tracker
      </p>
      <nav className="mt-8 flex flex-col gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            className={({ isActive }) =>
              `cursor-pointer rounded-2xl px-4 py-3 text-sm font-semibold ${
                isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"
              }`
            }
            to={item.to}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
