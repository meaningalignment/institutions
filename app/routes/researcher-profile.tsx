import { Link, data } from "react-router";
import type { Route } from "./+types/researcher-profile";
import { getResearcher } from "../lib/researchers.server";
import { Highlight } from "../components/ResearcherCard";
import { SiteFooter } from "../components/Controls";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { getAuthorizedAdminSession } from "../lib/auth.server";
import { ComingSoon } from "../components/ComingSoon";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await getAuthorizedAdminSession(request);
  if (!session) return { preview: false as const };
  const researcher = await getResearcher(params.handle);
  if (!researcher) throw data("Researcher not found", { status: 404 });
  return { preview: true as const, researcher };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const researcher = loaderData?.preview ? loaderData.researcher : null;
  const name = researcher?.name ?? "Research community";
  return [
    { title: `${name} — ${SITE_NAME}` },
    ...(!loaderData?.preview ? [{ name: "robots", content: "noindex" }] : []),
    {
      tagName: "link",
      rel: "canonical",
      href: researcher
        ? `${SITE_ORIGIN}/researchers/${researcher.handle.replace(/^@/, "")}`
        : `${SITE_ORIGIN}/researchers/`,
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

export default function ResearcherProfile({ loaderData }: Route.ComponentProps) {
  if (!loaderData.preview) {
    return <ComingSoon section="Research community" source="researchers" />;
  }
  const r = loaderData.researcher;
  const bare = r.handle.replace(/^@/, "");
  const communitySection = r.advisesAbout
    ? { id: "scouts-advisors", label: "Scouts & advisors" }
    : r.involvements.length
      ? { id: "community-members", label: "Community members" }
      : { id: "friends", label: "Friends" };

  return (
    <>
      <div className="researcher-profile">
        <nav className="researcher-profile-breadcrumb" aria-label="Breadcrumb">
          <Link to="/researchers">Research community</Link>
          <span aria-hidden="true">›</span>
          <Link to={`/researchers#${communitySection.id}`}>{communitySection.label}</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{r.name}</span>
        </nav>

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
