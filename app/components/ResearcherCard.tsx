import { Link } from "react-router";
import type { Researcher } from "../lib/researchers.server";

export function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="researcher-highlight">{children}</span>;
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

export function ResearcherCard({ researcher: r }: { researcher: Researcher }) {
  const profileHref = `/researchers/${bareHandle(r.handle)}`;

  return (
    // Stretched-link card: the name <Link> covers the whole card via its
    // ::after, so the card is clickable and crawlable; the X/Scholar links sit
    // above it (relative z-10) so they stay independently clickable.
    <article className="researcher-card group">
      <div className="researcher-card-person">
        {r.photoUrl ? (
          <img
            src={r.photoUrl}
            alt=""
            className="researcher-card-photo"
            loading="lazy"
          />
        ) : (
          <span className="researcher-card-photo researcher-card-initials">
            {initials(r.name)}
          </span>
        )}
        <div className="researcher-card-identity">
          <Link
            to={profileHref}
            className="researcher-card-name"
          >
            {r.name}
          </Link>
          {r.affiliation && (
            <div className="researcher-card-affiliation">{r.affiliation}</div>
          )}
        </div>
      </div>

      {r.advisesAbout && (
        <div className="researcher-card-scouts">
          <Highlight>
            <span>Scouts for </span>
            {r.advisesAbout}
          </Highlight>
        </div>
      )}

      <div className="researcher-card-links">
        {r.handle && (
          <a
            href={`https://x.com/${bareHandle(r.handle)}`}
            target="_blank"
            rel="noreferrer"
          >
            {r.handle}
          </a>
        )}
        {r.scholarUrl && (
          <a
            href={r.scholarUrl}
            target="_blank"
            rel="noreferrer"
          >
            Scholar
          </a>
        )}
      </div>
    </article>
  );
}
