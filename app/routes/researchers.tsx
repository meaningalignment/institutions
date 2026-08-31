import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/researchers";
import { getCommunity, type Researcher } from "../lib/researchers.server";
import { ResearcherCard } from "../components/ResearcherCard";
import { CommunityHeader } from "../components/CommunityHeader";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { getAuthorizedAdminSession } from "../lib/auth.server";
import { ComingSoon } from "../components/ComingSoon";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getAuthorizedAdminSession(request);
  if (!session) return { preview: false as const };
  return { preview: true as const, ...(await getCommunity()), session };
}

export function meta(_: Route.MetaArgs) {
  const title = `Research Community — ${SITE_NAME}`;
  const desc =
    "The researchers building institutions for a world of autonomous AI agents: scouts and advisors, community members, and friends.";
  return [
    { title },
    ...(!_.loaderData?.preview ? [{ name: "robots", content: "noindex" }] : []),
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/researchers/` },
  ];
}

function Section({
  id,
  title,
  blurb,
  people,
}: {
  id: string;
  title: string;
  blurb: string;
  people: Researcher[];
}) {
  if (!people.length) return null;
  return (
    <section id={id} className="community-section">
      <div className="community-section-heading">
        <h2>{title}</h2>
        <span aria-label={`${people.length} people`}>{people.length}</span>
      </div>
      <p className="community-section-intro">{blurb}</p>
      <div className="researcher-grid">
        {people.map((r) => (
          <ResearcherCard key={r.id} researcher={r} />
        ))}
      </div>
    </section>
  );
}

export default function Researchers({ loaderData: d }: Route.ComponentProps) {
  if (!d.preview) {
    return <ComingSoon section="Research community" source="researchers" />;
  }
  return (
    <>
      <div className="community-page">
        <CommunityHeader editing={false} session={d.session} />

        <Section
          id="scouts-advisors"
          title="Scouts & Advisors"
          blurb="Advisors who help us find and vet the right people and problems, with what they scout for."
          people={d.advisors}
        />
        <Section
          id="community-members"
          title="Community members"
          blurb="Researchers active in the group — on Signal or Slack, or at a Zoom meeting or workshop."
          people={d.community}
        />
        <Section
          id="friends"
          title="Friends"
          blurb="Warm and committed people we're building with who aren't yet in the channels above."
          people={d.friends}
        />
      </div>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? error.statusText || "Error"
    : "The community directory is unavailable right now.";
  return (
    <div className="community-page">
      <CommunityHeader editing={false} session={null} />
      <p className="community-unavailable">{message}</p>
    </div>
  );
}
