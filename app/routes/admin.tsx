import { NavLink, Outlet, useLoaderData } from "react-router";
import type { Route } from "./+types/admin";
import { CommunityHeader } from "../components/CommunityHeader";
import { SITE_NAME } from "../lib/constants";
import { requireAdminSession } from "../lib/auth.server";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Admin — ${SITE_NAME}` }, { name: "robots", content: "noindex" }];
}

const tabs = [
  { to: "/researchers/admin/people", label: "People", end: false },
  { to: "/researchers/admin", label: "Scouts", end: true },
  { to: "/researchers/admin/papers", label: "Papers", end: false },
];

export async function loader({ request }: Route.LoaderArgs) {
  return { session: await requireAdminSession(request) };
}

export default function AdminLayout() {
  const { session } = useLoaderData<typeof loader>();
  return (
    <div className="w-full max-w-[1000px]">
      <CommunityHeader editing session={session} />

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
