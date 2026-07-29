import { Form, NavLink, Outlet, useLoaderData } from "react-router";
import type { Route } from "./+types/admin";
import { SITE_NAME } from "../lib/constants";
import { requireAdminSession } from "../lib/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Admin — ${SITE_NAME}` }, { name: "robots", content: "noindex" }];
}

const tabs = [
  { to: "/admin", label: "Scouts", end: true },
  { to: "/admin/papers", label: "Papers", end: false },
  { to: "/admin/people", label: "People", end: false },
];

export async function loader({ request }: Route.LoaderArgs) {
  return { session: await requireAdminSession(request) };
}

export default function AdminLayout() {
  const { session } = useLoaderData<typeof loader>();
  return (
    <div className="w-full max-w-[920px]">
      <div className="mb-1 flex items-start justify-between gap-4">
        <h1
          className="text-[color:var(--ink)]"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30 }}
        >
          Admin
        </h1>
        <div className="flex items-center gap-2 pt-1 text-xs text-[color:var(--muted)]">
          <span className="hidden sm:inline">{session.name}</span>
          <Form action="/logout" method="post">
            <button type="submit" className="text-[color:var(--accent)] hover:underline">
              Sign out
            </button>
          </Form>
        </div>
      </div>
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
