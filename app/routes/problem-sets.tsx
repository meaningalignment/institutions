import { Link } from "react-router";
import type { Route } from "./+types/problem-sets";
import { loadCells } from "../lib/content.server";
import { renderProblemSetBody } from "../lib/render.server";
import { extractProblemSets } from "../lib/markdown";
import { VisionMenu, SiteFooter } from "../components/Controls";
import {
  VISIONS,
  SITE_NAME,
  SITE_ORIGIN,
  rowName,
  colName,
  splitCellKey,
} from "../lib/constants";

interface Entry {
  num: number;
  title: string;
  cellLabel: string;
  href: string;
  bodyHtml: string;
}

export function loader(_: Route.LoaderArgs) {
  const cells = loadCells();
  const all = extractProblemSets("agi", cells);

  const makeEntry = (ps: (typeof all)[number], i: number): Entry => {
    const { row, col } = splitCellKey(ps.cellKey);
    const cellLabel = `${rowName(row)} / ${colName(col)}`;
    const href = ps.vision ? `/cell/${row}/${col}?visions=${ps.vision}` : `/cell/${row}/${col}`;
    return { num: i + 1, title: ps.title, cellLabel, href, bodyHtml: renderProblemSetBody(ps.body) };
  };

  const required = all.filter((p) => !p.vision).map(makeEntry);
  const visionGroups = VISIONS.map((v) => ({
    id: v.id,
    label: v.label,
    items: all.filter((p) => p.vision === v.id).map(makeEntry),
  })).filter((g) => g.items.length);

  return { required, visionGroups };
}

export function meta(_: Route.MetaArgs) {
  const title = `Problem Sets — ${SITE_NAME}`;
  const desc =
    "Design problems for pairs and small teams exploring AGI institutional design: from agent contracts to global AI governance frameworks. Each problem is ~1 hour and produces a concrete design sketch.";
  return [
    { title },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/problem-sets/` },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
  ];
}

function ProblemEntry({ entry, vision }: { entry: Entry; vision?: string }) {
  return (
    <div className="ps-entry" {...(vision ? { "data-vision": vision } : {})}>
      <div className="ps-entry-header">
        <span className="ps-entry-number">{entry.num}</span>
        <span className="ps-entry-title">{entry.title}</span>
        <span className="ps-entry-cell">
          <Link to={entry.href}>{entry.cellLabel}</Link>
        </span>
      </div>
      <div className="ps-entry-body" dangerouslySetInnerHTML={{ __html: entry.bodyHtml }} />
    </div>
  );
}

export default function ProblemSets({ loaderData: d }: Route.ComponentProps) {
  return (
    <>
      <div id="problem-sets-view" style={{ display: "block", width: "100%", maxWidth: 800 }}>
        <Link to="/" className="detail-back">
          ← Back to grid
        </Link>
        <div className="ps-page-title">Problem Sets</div>
        <div className="ps-page-subtitle">
          For pairs/trios. ~1 hour each. Produce a concrete design sketch, not a literature review.
        </div>
        <VisionMenu />

        {d.required.length > 0 && (
          <>
            <div className="ps-group-title">Required</div>
            {d.required.map((e) => (
              <ProblemEntry key={`${e.num}-${e.title}`} entry={e} />
            ))}
          </>
        )}

        {d.visionGroups.map((g) => (
          <div key={g.id} className="ps-vision-group" data-vision={g.id}>
            <div className="ps-group-title">{g.label}</div>
            {g.items.map((e) => (
              <ProblemEntry key={`${g.id}-${e.num}-${e.title}`} entry={e} vision={g.id} />
            ))}
          </div>
        ))}

        <div className="ps-notes">
          <h3>Notes for Facilitators</h3>
          <ul>
            <li>
              Each problem is designed to reward mixed teams (e.g., a mechanism designer + a legal
              scholar; an Ostrom person + an AI safety researcher).
            </li>
            <li>
              The deliverables are deliberately concrete—a protocol, a charter, amendment text—to
              prevent the conversation from remaining at the level of “this is an important problem.”
            </li>
            <li>
              Encourage teams to identify where their design <em>breaks</em> and to state the failure
              conditions explicitly.
            </li>
          </ul>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
