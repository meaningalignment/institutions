import { Link } from "react-router";
import type { Route } from "./+types/theory-of-change";
import { readDataFile } from "../lib/content.server";
import { renderMarkdown } from "../lib/render.server";
import { esc, escapeHtml } from "../lib/markdown";
import { SiteFooter } from "../components/Controls";
import { OG_IMAGE_META, SITE_NAME, SITE_ORIGIN } from "../lib/constants";
import { staticContentHeaders } from "../lib/cache.server";

export const headers = staticContentHeaders;

// Port of build.cjs generateTheoryOfChangePage: prose H2 sections become
// .about-section blocks; the "Theory of change" section's ordered list becomes
// the numbered .about-stage ladder.
function buildSections(md: string): { title: string; sectionsHtml: string } {
  const title = (md.match(/^# (.+)$/m) || [, "Theory of change"])[1]!.trim();
  md = md.replace(/^# .+$/m, "").trim();

  const chunks = md.split(/(?=^## )/m).filter((c) => c.trim());
  let sectionsHtml = "";

  for (const chunk of chunks) {
    const heading = (chunk.match(/^## (.+)$/m) || [, ""])[1]!.trim();
    const body = chunk.replace(/^## .+$/m, "").trim();

    const olMatch = body.match(/(?:^|\n)((?:\d+\. .+(?:\n(?!\d+\. ).*)*\n?)+)$/m);
    if (heading.toLowerCase() === "theory of change" && olMatch) {
      const intro = body.slice(0, olMatch.index).trim();
      const items = olMatch[1]
        .split(/\n(?=\d+\. )/)
        .map((s) => s.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);

      let stages = "";
      items.forEach((item, i) => {
        const m = item.match(/^\*\*(.+?)\.?\*\*\s*(.*)$/s);
        const label = m ? m[1].trim() : item;
        const text = m ? m[2].trim() : "";
        stages += '<li class="about-stage">';
        stages += `<span class="about-stage-num">${i + 1}</span>`;
        stages += '<div class="about-stage-body">';
        stages += `<span class="about-stage-label">${esc(label)}</span>`;
        stages += `<span class="about-stage-text">${esc(text)}</span>`;
        stages += "</div>";
        if (i < items.length - 1) stages += '<span class="about-stage-arrow" aria-hidden="true">↓</span>';
        stages += "</li>";
      });

      sectionsHtml += `<div class="about-section"><h3>${esc(heading)}</h3>${
        intro ? renderMarkdown(intro) : ""
      }<ol class="about-stages">${stages}</ol></div>`;
    } else {
      sectionsHtml += `<div class="about-section"><h3>${escapeHtml(heading)}</h3>${renderMarkdown(body)}</div>`;
    }
  }

  return { title, sectionsHtml };
}

let theoryOfChangeCache: ReturnType<typeof buildSections> | undefined;

export function loader(_: Route.LoaderArgs) {
  if (!theoryOfChangeCache) {
    theoryOfChangeCache = buildSections(readDataFile("theory-of-change.md"));
  }
  return theoryOfChangeCache;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = `${loaderData?.title ?? "Theory of change"} — ${SITE_NAME}`;
  const desc =
    "What this grid of institutions for a world of autonomous AI agents is, why it is needed, and the theory of change behind it.";
  return [
    { title },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/theory-of-change/` },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    ...OG_IMAGE_META,
  ];
}

export default function TheoryOfChange({ loaderData: d }: Route.ComponentProps) {
  return (
    <>
      <div id="curriculum-view" className="curr-layout toc-page">
        <div className="curr-main">
          <Link to="/" className="detail-back">
            ← Back to grid
          </Link>
          <div className="curr-page-title">{d.title}</div>
          <div dangerouslySetInnerHTML={{ __html: d.sectionsHtml }} />
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
