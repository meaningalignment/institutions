import { NavLink, Outlet } from "react-router";
import type { Route } from "./+types/admin";
import { SITE_NAME } from "../lib/constants";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Admin — ${SITE_NAME}` }, { name: "robots", content: "noindex" }];
}

const tabs = [
  { to: "/admin", label: "Scouts", end: true },
  { to: "/admin/papers", label: "Papers", end: false },
  { to: "/admin/people", label: "People", end: false },
];

export default function AdminLayout() {
  return (
    <div className="w-full max-w-[920px]">
      <h1
        className="mb-1 text-[color:var(--ink)]"
        style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30 }}
      >
        Admin
      </h1>
      <p className="mb-6 text-sm text-[color:var(--muted)]">
        Configure scouts, papers, and community involvement.
      </p>

      <nav
        className="mb-5 flex gap-1 border-b border-[color:var(--line)]"
        aria-label="Admin sections"
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `relative -mb-px rounded-t-md border border-transparent px-4 py-2.5 text-sm font-medium ${
                isActive
                  ? "border-[color:var(--line)] border-b-[var(--card)] bg-[var(--card)] text-[color:var(--ink)]"
                  : "text-[color:var(--muted)] hover:text-[color:var(--ink)]"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
