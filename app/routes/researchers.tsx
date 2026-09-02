import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/researchers";
import { getCommunity, getResearchWorks } from "../lib/researchers.server";
import { CommunityHeader } from "../components/CommunityHeader";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { getAuthorizedAdminSession } from "../lib/auth.server";
import { ResearchAtlas } from "../components/ResearchAtlas";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getAuthorizedAdminSession(request);
  const community = await getCommunity();
  const people = [...community.advisors, ...community.community, ...community.friends];
  const works = await getResearchWorks(people);
  return { community, works, session };
}

export function meta(_: Route.MetaArgs) {
  const title = `Research Community — ${SITE_NAME}`;
  const desc =
    "The researchers building institutions for a world of autonomous AI agents: scouts and advisors, and community members.";
  return [
    { title },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/researchers/` },
  ];
}

export default function Researchers({ loaderData: d }: Route.ComponentProps) {
  return (
    <>
      <div className="community-page">
        <CommunityHeader editing={false} session={d.session} />

        <ResearchAtlas community={d.community} works={d.works} />
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
