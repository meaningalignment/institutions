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

function TopicList({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="researcher-profile-field">
      <div className="researcher-profile-label">{label}</div>
      <div className="researcher-profile-tags">
        {items.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

export default function ResearcherProfile({ loaderData: r }: Route.ComponentProps) {
  const bare = r.handle.replace(/^@/, "");

  return (
    <>
      <div className="researcher-profile">
        <Link to="/researchers" className="researcher-profile-back">
          Research community
        </Link>

        <div className="researcher-profile-header">
          {r.photoUrl ? (
            <img src={r.photoUrl} alt="" className="researcher-profile-photo" />
          ) : (
            <span className="researcher-profile-photo researcher-card-initials">
              {r.name.split(/\s+/).slice(0, 2).map((p) => p[0]).join("")}
            </span>
          )}
          <div className="researcher-profile-identity">
            <h1>{r.name}</h1>
            {r.affiliation && (
              <div className="researcher-profile-affiliation">{r.affiliation}</div>
            )}
            <div className="researcher-profile-links">
              {r.handle && (
                <a
                  href={`https://x.com/${bare}`}
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
                  Google Scholar
                </a>
              )}
            </div>
          </div>
        </div>

        {r.bio && (
          <div className="researcher-profile-bio-block">
            <p className="researcher-profile-bio">{r.bio}</p>
            {r.bioSourceUrl && (
              <a
                className="researcher-profile-bio-source"
                href={r.bioSourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                Bio from Pax Machina
              </a>
            )}
          </div>
        )}

        {r.advisesAbout && (
          <p className="researcher-profile-scouts">
            <Highlight>
              <span className="text-[color:var(--muted)]">Scouts for </span>
              {r.advisesAbout}
            </Highlight>
          </p>
        )}

        <TopicList label="Areas of work" items={r.tags} />

        {r.canonicalWorks.length > 0 && (
          <section className="researcher-profile-works">
            <h2>Selected work</h2>
            <ul>
              {r.canonicalWorks.map((w, i) => (
                <li key={i}>
                  {w.url ? (
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {w.title}
                    </a>
                  ) : (
                    w.title
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
