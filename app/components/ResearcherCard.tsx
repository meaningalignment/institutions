import { Link } from "react-router";
import type { Researcher } from "../lib/researchers.server";

// Highlighter-pen effect: an angled, semi-transparent marker stroke with uneven
// ends. box-decoration-clone makes it wrap naturally across lines. Inline style
// (padding/background) also outranks the legacy `*{padding:0}` reset.
export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="box-decoration-clone"
      style={{
        backgroundImage:
          "linear-gradient(104deg, rgba(255,224,102,0) 0.3%, rgba(255,224,102,0.75) 2.2%, rgba(250,207,72,0.68) 96%, rgba(255,224,102,0.1) 98%, rgba(255,224,102,0) 100%)",
        padding: "0.06em 0.48em",
        margin: "0 -0.05em",
        borderRadius: "0.12em",
      }}
    >
      {children}
    </span>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function bareHandle(handle: string): string {
  return handle.replace(/^@/, "");
}

const MAX_CHIPS = 3;

export function ResearcherCard({ researcher: r }: { researcher: Researcher }) {
  const profileHref = `/researchers/${bareHandle(r.handle)}`;
  const shownMethods = r.methods.slice(0, MAX_CHIPS);
  const extraMethods = r.methods.length - shownMethods.length;

  return (
    // Stretched-link card: the name <Link> covers the whole card via its
    // ::after, so the card is clickable and crawlable; the X/Scholar links sit
    // above it (relative z-10) so they stay independently clickable.
    <div className="group relative flex flex-col gap-2.5 rounded-xl border border-[color:var(--line)] bg-[var(--card)] p-4 transition-colors hover:border-[color:var(--line-strong)] hover:bg-[var(--wash)]">
      <div className="flex items-center gap-4">
        {r.photoUrl ? (
          <img
            src={r.photoUrl}
            alt=""
            className="h-14 w-14 shrink-0 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--wash)] text-base font-semibold text-[color:var(--muted)]">
            {initials(r.name)}
          </span>
        )}
        <div className="min-w-0">
          <Link
            to={profileHref}
            className="truncate font-semibold text-[color:var(--ink)] no-underline after:absolute after:inset-0 after:content-[''] group-hover:text-[color:var(--accent)]"
          >
            {r.name}
          </Link>
          {r.affiliation && (
            <div className="truncate text-xs text-[color:var(--muted)]">{r.affiliation}</div>
          )}
        </div>
      </div>

      {r.advisesAbout && (
        <div className="text-sm leading-relaxed text-[color:var(--text)]">
          <Highlight>
            <span className="text-[color:var(--muted)]">Scouts for </span>
            {r.advisesAbout}
          </Highlight>
        </div>
      )}

      {shownMethods.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {shownMethods.map((m) => (
            <span
              key={m}
              className="rounded-full border border-[color:var(--line)] bg-[var(--wash)] px-2.5 py-0.5 text-[11px] leading-normal text-[color:var(--text)]"
            >
              {m}
            </span>
          ))}
          {extraMethods > 0 && (
            <span className="px-1 py-0.5 text-[11px] leading-normal text-[color:var(--faint)]">
              +{extraMethods}
            </span>
          )}
        </div>
      )}

      <div className="relative z-10 mt-auto flex items-center gap-3 pt-1 text-xs">
        {r.handle && (
          <a
            href={`https://x.com/${bareHandle(r.handle)}`}
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--muted)] no-underline hover:text-[color:var(--accent)]"
          >
            {r.handle}
          </a>
        )}
        {r.scholarUrl && (
          <a
            href={r.scholarUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--muted)] no-underline hover:text-[color:var(--accent)]"
          >
            Scholar
          </a>
        )}
      </div>
    </div>
  );
}
