import { Link, NavLink, Outlet, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("theme-dark"));
  }, []);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("theme-dark");
    document.documentElement.classList.toggle("theme-dark", nextDark);
    window.localStorage.setItem("wiki-theme", nextDark ? "dark" : "light");
    setDarkMode(nextDark);
  };

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <CommunityHeader editing session={session} />

        <nav className="admin-tabs" aria-label="Admin sections">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {tab.label}
            </NavLink>
          ))}
          <span className="admin-preview-links">
            <Link to="/curriculum">View curriculum</Link>
            <Link to="/researchers">View community</Link>
            <button type="button" onClick={toggleTheme}>
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
          </span>
        </nav>

        <Outlet />
      </div>
    </main>
  );
}
