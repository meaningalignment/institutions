import { Link, data } from "react-router";
import type { Route } from "./+types/researcher-profile";
import { getResearcher } from "../lib/researchers.server";
import { Highlight } from "../components/ResearcherCard";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { researcherProfilePath } from "../lib/researcher-links";

export async function loader({ params }: Route.LoaderArgs) {
  const researcher = await getResearcher(params.handle);
  if (!researcher) throw data("Researcher not found", { status: 404 });
  return { researcher };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const researcher = loaderData?.researcher;
  const name = researcher?.name ?? "Research community";
  return [
    { title: `${name} — ${SITE_NAME}` },
    {
      tagName: "link",
      rel: "canonical",
      href: researcher
        ? `${SITE_ORIGIN}${researcherProfilePath(researcher)}`
        : `${SITE_ORIGIN}/researchers/`,
    },
  ];
}

// The profile shows the person's own roster tags rather than the coarse
// research fields: the tags are what they actually said they work on, and a
// field label ("AI governance & policy") loses that precision. They are not
// links -- a specific tag pointing at a much broader field filter promises
// something the click does not deliver. Fields still drive the directory
// filter; this is display only.
function TagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="researcher-profile-field">
      <div className="researcher-profile-label">Works on</div>
      <div className="researcher-profile-tags">
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default function ResearcherProfile({ loaderData }: Route.ComponentProps) {
  const r = loaderData.researcher;
  const tags = r.tags ?? [];
  const bare = r.handle.replace(/^@/, "");
  const communitySection = r.advisesAbout
    ? { id: "scouts-advisors", label: "Scouts & advisors" }
    : r.involvements.length
      ? { id: "community-members", label: "Community members" }
      // Friends is hidden on /researchers for now, so there is no anchor to link to.
      : { id: null, label: "Friends" };

  return (
    <>
      <div className="researcher-profile">
        <Link className="researcher-profile-back" to="/researchers">
          ← Back to community
        </Link>
        <nav className="researcher-profile-breadcrumb" aria-label="Breadcrumb">
          <Link to="/researchers">Research community</Link>
          <span aria-hidden="true">›</span>
          {communitySection.id
            ? <Link to={`/researchers#${communitySection.id}`}>{communitySection.label}</Link>
            : <span>{communitySection.label}</span>}
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
          </div>
        )}

        {r.advisesAbout && (
          <div className="researcher-profile-field">
            <div className="researcher-profile-label">Scouts for</div>
            <p className="researcher-profile-scouts">
              <Highlight>{r.advisesAbout}</Highlight>
            </p>
          </div>
        )}

        <TagList tags={tags} />

        {r.canonicalWorks.length > 0 && (
          <section className="researcher-profile-works">
            <h2>Selected papers</h2>
            <p className="researcher-profile-work-intro">
              Chosen by the community&rsquo;s{" "}
              <Link to="/researchers#scouts-advisors">scouts</Link>{" "}
              as part of the project&rsquo;s shared core.
            </p>
            <div className="researcher-profile-work-list">
              {r.canonicalWorks.map((w, i) => (
                <article key={i}>
                  {w.year ? <span>{w.year}</span> : null}
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
                  {w.summary ? <p>{w.summary}</p> : null}
                </article>
              ))}
            </div>
          </section>
        )}

        {r.moreWorks.length > 0 && (
          <section className="researcher-profile-works">
            <h2>{r.canonicalWorks.length > 0 ? "More work in the field" : "Work in the field"}</h2>
            <div className="researcher-profile-work-list">
              {r.moreWorks.map((work) => (
                <article key={work.url}>
                  <span>{work.year}</span>
                  <a href={work.url} target="_blank" rel="noreferrer">{work.title}</a>
                  <p>{work.summary}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
