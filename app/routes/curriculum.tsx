import { useEffect } from "react";
import type { Route } from "./+types/curriculum";
import { buildCurriculum } from "../lib/curriculum.server";
import { initCurriculum } from "../lib/curriculum-init";
import { OG_IMAGE_META, SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { getAuthorizedAdminSession } from "../lib/auth.server";
import { ComingSoon } from "../components/ComingSoon";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getAuthorizedAdminSession(request);
  if (!session) return { preview: false as const, title: "Curriculum" };
  return { preview: true as const, ...buildCurriculum() };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = `${loaderData?.title ?? "Curriculum"} — ${SITE_NAME}`;
  const desc =
    "A curriculum for institutional designers engaging with AI governance: mechanism design, constitutional design, market design, regulatory frameworks, and more — all contextualized for the age of autonomous AI agents.";
  return [
    { title },
    ...(!loaderData?.preview ? [{ name: "robots", content: "noindex" }] : []),
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/curriculum/` },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    ...OG_IMAGE_META,
  ];
}

export default function Curriculum({ loaderData: d }: Route.ComponentProps) {
  useEffect(() => {
    if (d.preview) initCurriculum();
  }, [d.preview]);
  if (!d.preview) return <ComingSoon section="Curriculum" source="curriculum" />;
  return (
    <>
      <div
        id="curriculum-view"
        className="curr-layout"
        dangerouslySetInnerHTML={{ __html: d.innerHtml }}
      />
    </>
  );
}
