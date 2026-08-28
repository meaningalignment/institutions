import { Link } from "react-router";
import type { Route } from "./+types/methods";
import { loadMethodCell } from "../lib/content.server";
import { renderBody } from "../lib/render.server";
import { useBodyClass } from "../lib/useBodyClass";
import { GITHUB_REPO, OG_IMAGE_META, SITE_NAME, TABS, colName } from "../lib/constants";
import { staticContentHeaders } from "../lib/cache.server";

export const headers = staticContentHeaders;

interface MethodDetailData {
  col: string;
  colLabel: string;
  breadcrumb: string;
  title: string;
  hasBody: boolean;
  bodyHtml: string;
  ghLink: string;
  ghNew: string;
}

const methodDetailCache = new Map<string, MethodDetailData>();

export function loader({ params }: Route.LoaderArgs) {
  const col = params.col;
  const cached = methodDetailCache.get(col);
  if (cached) return cached;

  const cell = loadMethodCell(col);
  const ghLink = `${GITHUB_REPO}/edit/main/data/methods/${col}.md`;
  const detail = {
    col,
    colLabel: colName(col),
    breadcrumb: `${TABS.agi.title} › Methods › ${colName(col)}`,
    title: cell?.summary || colName(col),
    hasBody: !!(cell?.body && cell.body.trim()),
    bodyHtml: cell?.body?.trim() ? renderBody(cell.body) : "",
    ghLink,
    ghNew: `${GITHUB_REPO}/new/main/data/methods?filename=${col}.md`,
  };
  methodDetailCache.set(col, detail);
  return detail;
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData ? `${loaderData.title} — ${SITE_NAME}` : SITE_NAME;
  return [{ title }, { property: "og:title", content: title }, ...OG_IMAGE_META];
}

export default function MethodsRoute({ loaderData: d }: Route.ComponentProps) {
  useBodyClass("tab-agi viewing-detail");
  return (
    <>
      <div id="detail-view" style={{ display: "block" }}>
        <Link to="/" className="detail-back">
          ← Back to grid
        </Link>
        <div className="detail-breadcrumb">{d.breadcrumb}</div>
        <div className="detail-title">{d.title}</div>
        {d.hasBody ? (
          <div className="detail-body" dangerouslySetInnerHTML={{ __html: d.bodyHtml }} />
        ) : (
          <div className="detail-placeholder">
            This page hasn’t been documented yet. <a href={d.ghNew}>Contribute on GitHub →</a>
          </div>
        )}
        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid #e6e1d8",
            fontSize: 12,
            color: "#b5b0a8",
          }}
        >
          <a href={d.ghLink} style={{ color: "#8a8378" }}>
            Edit this page on GitHub →
          </a>
        </div>
      </div>
    </>
  );
}
