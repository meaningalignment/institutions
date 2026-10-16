import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/researchers-signal";
import { getCommunity } from "../lib/researchers.server";
import { CommunityHeader } from "../components/CommunityHeader";
import { ResearcherSection } from "../components/ResearchAtlas";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { requireSignedIn } from "../lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  // Same gate as /researchers: signed-in researchers only, edit toggle for admins.
  const signedIn = await requireSignedIn(request);
  const session = signedIn?.isAdmin ? signedIn : null;
  const community = await getCommunity();
  // Everyone in the Signal group, in one alphabetical list regardless of
  // scout/community grouping. signal_name is set exactly for group members.
  const people = [...community.advisors, ...community.community, ...community.friends]
    .filter((person) => person.signalName)
    .sort((a, b) => a.name.localeCompare(b.name))
    // TODO: show "Scouts for …" here again once the scouts are bought in;
    // until then this page leaves it off the cards (just drop this map).
    .map(({ advisesAbout: _, ...person }) => person);
  return { people, session };
}

export function meta(_: Route.MetaArgs) {
  const title = `Signal group — ${SITE_NAME}`;
  return [
    { title },
    { name: "description", content: "Researchers in the AGI Institutions Signal group." },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/researchers/signal/` },
  ];
}

export default function ResearchersSignal({ loaderData: d }: Route.ComponentProps) {
  return (
    <div className="community-page">
      <CommunityHeader
        editing={false}
        session={d.session}
        title="Signal group"
        intro="Researchers in the AGI Institutions Signal group."
      />
      <ResearcherSection id="signal-group" title="Members" people={d.people} />
      {!d.people.length ? <p className="community-unavailable">No one is marked as in the Signal group yet.</p> : null}
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? error.statusText || "Error"
    : "The Signal group directory is unavailable right now.";
  return (
    <div className="community-page">
      <CommunityHeader editing={false} session={null} title="Signal group" />
      <p className="community-unavailable">{message}</p>
    </div>
  );
}
