import { Link, isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/researchers";
import { getCommunity, type Researcher } from "../lib/researchers.server";
import { ResearcherCard } from "../components/ResearcherCard";
import { SiteFooter } from "../components/Controls";
import { CommunityHeader } from "../components/CommunityHeader";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { getAuthorizedAdminSession } from "../lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const [community, session] = await Promise.all([
    getCommunity(),
    getAuthorizedAdminSession(request),
  ]);
  return { ...community, session };
}

export function meta(_: Route.MetaArgs) {
  const title = `Community — ${SITE_NAME}`;
  const desc =
    "The researchers building institutions for a world of autonomous AI agents: scouts and advisors, community members, and friends.";
  return [
    { title },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/researchers/` },
  ];
}

function Section({
  title,
  blurb,
  people,
}: {
  title: string;
  blurb: string;
  people: Researcher[];
}) {
  if (!people.length) return null;
  return (
    <section className="mb-12">
      <div className="mb-1 flex items-baseline gap-2">
        <h2
          className="text-[color:var(--ink)]"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24 }}
        >
          {title}
        </h2>
        <span className="text-sm text-[color:var(--faint)]">{people.length}</span>
      </div>
      <p className="mb-4 text-sm text-[color:var(--muted)]">{blurb}</p>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
        {people.map((r) => (
          <ResearcherCard key={r.id} researcher={r} />
        ))}
      </div>
    </section>
  );
}

export default function Researchers({ loaderData: d }: Route.ComponentProps) {
  return (
    <>
      <div className="w-full max-w-[1000px]">
        <CommunityHeader editing={false} session={d.session} />

        <Section
          title="Scouts & Advisors"
          blurb="Advisors who help us find and vet the right people and problems, with what they scout for."
          people={d.advisors}
        />
        <Section
          title="Community members"
          blurb="Researchers active in the group — on Signal or Slack, or at a Zoom meeting or workshop."
          people={d.community}
        />
        <Section
          title="Friends"
          blurb="Warm and committed people we're building with who aren't yet in the channels above."
          people={d.friends}
        />
      </div>
      <SiteFooter />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? error.statusText || "Error"
    : "The community directory is unavailable right now.";
  return (
    <div className="w-full max-w-[1000px]">
      <Link to="/" className="detail-back">
        ← Back to grid
      </Link>
      <h1
        className="mb-2 text-[color:var(--ink)]"
        style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32 }}
      >
        Community
      </h1>
      <p className="text-[color:var(--muted)]">{message}</p>
    </div>
  );
}
