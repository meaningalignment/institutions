import { Link, data } from "react-router";
import type { Route } from "./+types/researcher-profile";
import { getResearcher } from "../lib/researchers.server";
import { Highlight } from "../components/ResearcherCard";
import { SiteFooter } from "../components/Controls";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";

export async function loader({ params }: Route.LoaderArgs) {
  const researcher = await getResearcher(params.handle);
  if (!researcher) throw data("Researcher not found", { status: 404 });
  return researcher;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const name = loaderData?.name ?? "Researcher";
  return [
    { title: `${name} — ${SITE_NAME}` },
    {
      tagName: "link",
      rel: "canonical",
      href: `${SITE_ORIGIN}/researchers/${(loaderData?.handle ?? "").replace(/^@/, "")}`,
    },
  ];
}

function Chips({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mb-4">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--faint)]">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((m) => (
          <span
            key={m}
            className="rounded-full border border-[color:var(--line)] bg-[var(--wash)] px-2.5 py-0.5 text-xs leading-normal text-[color:var(--text)]"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ResearcherProfile({ loaderData: r }: Route.ComponentProps) {
  const bare = r.handle.replace(/^@/, "");

  return (
    <>
      <div className="w-full max-w-[720px]">
        <Link to="/researchers" className="detail-back">
          ← Back to community
        </Link>

        <div className="mb-6 flex items-center gap-4">
          {r.photoUrl ? (
            <img src={r.photoUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--wash)] text-lg font-semibold text-[color:var(--muted)]">
              {r.name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("")}
            </span>
          )}
          <div>
            <h1
              className="text-[color:var(--ink)]"
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28 }}
            >
              {r.name}
            </h1>
            {r.affiliation && (
              <div className="text-sm text-[color:var(--muted)]">{r.affiliation}</div>
            )}
            <div className="mt-1 flex gap-3 text-sm">
              {r.handle && (
                <a
                  href={`https://x.com/${bare}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--accent)] no-underline hover:underline"
                >
                  {r.handle}
                </a>
              )}
              {r.scholarUrl && (
                <a
                  href={r.scholarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--accent)] no-underline hover:underline"
                >
                  Google Scholar
                </a>
              )}
            </div>
          </div>
        </div>

        {r.advisesAbout && (
          <p className="mb-6 leading-relaxed text-[color:var(--text)]">
            <Highlight>
              <span className="text-[color:var(--muted)]">Scouts for </span>
              {r.advisesAbout}
            </Highlight>
          </p>
        )}

        <Chips label="Tags" items={r.tags} />

        {r.canonicalWorks.length > 0 && (
          <div className="mb-4">
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--faint)]">
              Selected work
            </div>
            <ul className="list-disc pl-5 text-sm text-[color:var(--text)]">
              {r.canonicalWorks.map((w, i) => (
                <li key={i}>
                  {w.url ? (
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[color:var(--accent)] no-underline hover:underline"
                    >
                      {w.title}
                    </a>
                  ) : (
                    w.title
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
