import { useEffect } from "react";
import type { Route } from "./+types/curriculum";
import { buildCurriculum } from "../lib/curriculum.server";
import { initCurriculum } from "../lib/curriculum-init";
import { SiteFooter } from "../components/Controls";
import { SITE_NAME, SITE_ORIGIN } from "../lib/constants";

export function loader(_: Route.LoaderArgs) {
  return buildCurriculum();
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = `${loaderData?.title ?? "Curriculum"} — ${SITE_NAME}`;
  const desc =
    "A curriculum for institutional designers engaging with AI governance: mechanism design, constitutional design, market design, regulatory frameworks, and more — all contextualized for the age of autonomous AI agents.";
  return [
    { title },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/curriculum/` },
  ];
}

export default function Curriculum({ loaderData: d }: Route.ComponentProps) {
  useEffect(() => initCurriculum(), []);
  return (
    <>
      <div
        id="curriculum-view"
        className="curr-layout"
        dangerouslySetInnerHTML={{ __html: d.innerHtml }}
      />
      <SiteFooter />
    </>
  );
}
