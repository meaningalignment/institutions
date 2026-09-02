import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { COLS, GITHUB_REPO, ROWS, SITE_NAME } from "../lib/constants";

const INTERNAL_ROUTE_PREFIXES = ["/researchers/admin", "/admin", "/login", "/logout"];

// "{row}-{col}" → cell title, per tab. AGI titles are each cell's H1; Human
// titles come from human-institutions.json. Supplied by the root loader.
export type CellTitles = {
  agi: Record<string, string>;
  human: Record<string, string>;
};

function AtlasTree({ kind, titles }: { kind: "human" | "agi"; titles: Record<string, string> }) {
  const location = useLocation();
  const rootHref = kind === "human" ? "/human" : "/";
  const label = kind === "human" ? "Existing institutions" : "AGI institutions";
  const detailPrefix = kind === "human" ? "/human/" : "/cell/";
  const detailActive = location.pathname.startsWith(detailPrefix);
  const sectionActive =
    kind === "human"
      ? location.pathname === "/human" || detailActive
      : location.pathname === "/" || detailActive;
  const [treeOpen, setTreeOpen] = useState(detailActive);

  useEffect(() => {
    setTreeOpen(detailActive);
  }, [detailActive, location.pathname]);

  return (
    <section
      className={`wiki-tree${sectionActive ? " is-active" : ""}${detailActive ? " is-detail" : ""}`}
    >
      <div className="wiki-tree-head">
        <NavLink to={rootHref} end={kind === "agi"}>
          {label}
        </NavLink>
        <button
          type="button"
          className="wiki-tree-toggle"
          aria-label={`${treeOpen ? "Collapse" : "Expand"} ${label}`}
          aria-expanded={treeOpen}
          onClick={() => setTreeOpen((value) => !value)}
        >
          <span className="wiki-tree-caret" aria-hidden="true" />
        </button>
      </div>
      {treeOpen && (
        <div className="wiki-tree-rows">
          {ROWS.map((row) => (
            <AtlasRow
              key={row.id}
              kind={kind}
              row={row}
              detailPrefix={detailPrefix}
              titles={titles}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AtlasRow({
  kind,
  row,
  detailPrefix,
  titles,
}: {
  kind: "human" | "agi";
  row: (typeof ROWS)[number];
  detailPrefix: string;
  titles: Record<string, string>;
}) {
  const location = useLocation();
  const rowActive = location.pathname.startsWith(`${detailPrefix}${row.id}/`);
  const [rowOpen, setRowOpen] = useState(rowActive);

  useEffect(() => {
    if (rowActive) setRowOpen(true);
  }, [rowActive]);

  return (
    <details
      className="wiki-tree-row"
      open={rowOpen}
      onToggle={(event) => setRowOpen(event.currentTarget.open)}
    >
      <summary>
        <span className="wiki-tree-caret" aria-hidden="true" />
        <span>{row.name}</span>
      </summary>
      <div className="wiki-tree-links">
        {COLS.map((col) => {
          const title = titles[`${row.id}-${col.id}`];
          // The AGI tree lists only cells that exist on the AGI grid; the
          // Human tree always has all columns (labels ship for every cell).
          if (!title && kind === "agi") return null;
          const href =
            kind === "human"
              ? `/human/${row.id}/${col.id}`
              : `/cell/${row.id}/${col.id}`;
          return (
            <NavLink key={col.id} to={href}>
              {title ?? col.name}
            </NavLink>
          );
        })}
      </div>
    </details>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18">
      <path d="M3 5h12M3 9h12M3 13h12" />
    </svg>
  );
}

export function SiteShell({
  children,
  adminPreview,
  cellTitles,
}: {
  children: React.ReactNode;
  adminPreview: boolean;
  cellTitles: CellTitles;
}) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const isInternal = INTERNAL_ROUTE_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("theme-dark"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("wiki-nav-mobile-open");
  }, [location.pathname]);

  if (isInternal) return <>{children}</>;

  const setSidebar = (nextOpen: boolean) => {
    document.documentElement.classList.toggle("wiki-nav-closed", !nextOpen);
    document.documentElement.classList.toggle("wiki-nav-mobile-open", nextOpen);
  };

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("theme-dark");
    document.documentElement.classList.toggle("theme-dark", nextDark);
    window.localStorage.setItem("wiki-theme", nextDark ? "dark" : "light");
    setDarkMode(nextDark);
  };

  return (
    <div className="wiki-shell">
      <button
        className="wiki-nav-reopen"
        type="button"
        onClick={() => setSidebar(true)}
        aria-label="Open navigation"
      >
        <MenuIcon />
      </button>

      <aside className="wiki-sidebar" aria-label="Site navigation">
        <div className="wiki-sidebar-head">
          <Link to="/theory-of-change" className="wiki-wordmark">
            {SITE_NAME}
          </Link>
          <button
            type="button"
            className="wiki-nav-close"
            onClick={() => setSidebar(false)}
            aria-label="Close navigation"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="wiki-nav">
          <AtlasTree kind="agi" titles={cellTitles.agi} />
          <AtlasTree kind="human" titles={cellTitles.human} />
          <div className="wiki-nav-separator" aria-hidden="true" />
          <NavLink className="wiki-nav-primary" to="/theory-of-change">
            What is this?
          </NavLink>
          <NavLink className="wiki-nav-primary" to="/curriculum">
            Curriculum
          </NavLink>
        </nav>
        <div className="wiki-sidebar-actions">
          <Link to={adminPreview ? "/researchers/admin" : "/login"}>
            <span>{adminPreview ? "Admin" : "Admin sign in"}</span>
          </Link>
          <a href="https://paxmachina.ai" target="_blank" rel="noopener noreferrer">
            <span>Pax Machina</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
            <span>Contribute on GitHub</span>
            <span aria-hidden="true">↗</span>
          </a>
          <button type="button" onClick={toggleTheme} aria-pressed={darkMode}>
            <span>{darkMode ? "Light mode" : "Dark mode"}</span>
            <span className="theme-switch-track" aria-hidden="true">
              <span />
            </span>
          </button>
        </div>
      </aside>
      <button
        className="wiki-nav-scrim"
        type="button"
        aria-label="Close navigation"
        onClick={() => setSidebar(false)}
      />

      <main className="wiki-content">{children}</main>
    </div>
  );
}
