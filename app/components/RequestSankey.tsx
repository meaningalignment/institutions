// A three-layer Sankey for the tracker: scale → column → stage. Each request
// carries a weight of 1, split evenly across its (scale, column) pairs, so the
// flows into and out of every node add up. Clicking a node filters the list.

import { COLS, ROWS } from "../lib/constants";
import { STAGES, STAGE_LABEL, requestStage, type InstitutionRequest, type Stage } from "../lib/requests";

type Layer = "row" | "column" | "stage";
interface SankeyNode {
  layer: Layer;
  id: string;
  label: string;
  value: number;
  /** How many requests touch this node (labels show this, not the split weight). */
  count: number;
  y: number;
  h: number;
}
interface SankeyLink {
  from: SankeyNode;
  to: SankeyNode;
  value: number;
  sy: number; // y offset where the band leaves `from`
  ty: number; // y offset where the band enters `to`
}

const W = 1000;
const H = 300;
const NODE_W = 12;
const PAD = 8;
const X: Record<Layer, number> = { row: 120, column: 494, stage: 868 };


export function RequestSankey({
  requests,
  onPick,
}: {
  requests: InstitutionRequest[];
  onPick: (layer: Layer, id: string, label: string) => void;
}) {
  if (!requests.length) return null;

  // Flow weights.
  const rowCol = new Map<string, number>();
  const colStage = new Map<string, number>();
  for (const r of requests) {
    const pairs = r.rows.flatMap((row) => r.cols.map((col) => [row, col] as const));
    const w = 1 / pairs.length;
    const stage = requestStage(r.links);
    for (const [row, col] of pairs) {
      rowCol.set(`${row}|${col}`, (rowCol.get(`${row}|${col}`) ?? 0) + w);
      colStage.set(`${col}|${stage}`, (colStage.get(`${col}|${stage}`) ?? 0) + w);
    }
  }

  // Nodes, in grid order, only where something flows.
  const total = requests.length;
  const sumWhere = (m: Map<string, number>, pred: (k: string) => boolean) =>
    [...m].filter(([k]) => pred(k)).reduce((s, [, v]) => s + v, 0);
  const countOf = (layer: Layer, id: string) =>
    requests.filter((r) =>
      layer === "row" ? r.rows.includes(id) : layer === "column" ? r.cols.includes(id) : requestStage(r.links) === id
    ).length;
  const layerNodes = (layer: Layer, items: { id: string; label: string }[], value: (id: string) => number) => {
    const present = items.map((it) => ({ ...it, value: value(it.id) })).filter((n) => n.value > 1e-9);
    const scale = (H - PAD * (present.length - 1)) / total;
    let y = 0;
    return present.map((n) => {
      const node: SankeyNode = {
        layer,
        id: n.id,
        label: n.label,
        value: n.value,
        count: countOf(layer, n.id),
        y,
        h: Math.max(2, n.value * scale),
      };
      y += node.h + PAD;
      return node;
    });
  };
  const rows = layerNodes("row", ROWS.map((r) => ({ id: r.id, label: r.name })), (id) =>
    sumWhere(rowCol, (k) => k.startsWith(`${id}|`))
  );
  const cols = layerNodes("column", COLS.map((c) => ({ id: c.id, label: c.name })), (id) =>
    sumWhere(rowCol, (k) => k.endsWith(`|${id}`))
  );
  const stages = layerNodes("stage", STAGES.map((s) => ({ id: s, label: STAGE_LABEL[s] })), (id) =>
    sumWhere(colStage, (k) => k.endsWith(`|${id}`))
  );

  // Links, stacked in order down each node's height.
  const buildLinks = (left: SankeyNode[], right: SankeyNode[], m: Map<string, number>) => {
    const out = new Map(left.map((n) => [n.id, 0]));
    const inn = new Map(right.map((n) => [n.id, 0]));
    const links: SankeyLink[] = [];
    for (const a of left)
      for (const b of right) {
        const v = m.get(`${a.id}|${b.id}`);
        if (!v) continue;
        const sh = (v / a.value) * a.h;
        const th = (v / b.value) * b.h;
        links.push({ from: a, to: b, value: v, sy: out.get(a.id)! + sh / 2, ty: inn.get(b.id)! + th / 2 });
        out.set(a.id, out.get(a.id)! + sh);
        inn.set(b.id, inn.get(b.id)! + th);
      }
    return links;
  };
  const links = [...buildLinks(rows, cols, rowCol), ...buildLinks(cols, stages, colStage)];

  const band = (l: SankeyLink) => {
    const x0 = X[l.from.layer] + NODE_W;
    const x1 = X[l.to.layer];
    const y0 = l.from.y + l.sy;
    const y1 = l.to.y + l.ty;
    const mx = (x0 + x1) / 2;
    return `M${x0},${y0} C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  };
  const width = (l: SankeyLink) => Math.max(1, (l.value / l.from.value) * l.from.h);

  const node = (n: SankeyNode) => {
    const left = n.layer === "row";
    const cls = n.layer === "stage" ? `req-sankey-node req-strip-${n.id as Stage}` : "req-sankey-node";
    return (
      <g
        key={`${n.layer}-${n.id}`}
        className={cls}
        role="button"
        tabIndex={0}
        onClick={() => onPick(n.layer, n.id, n.label)}
        onKeyDown={(e) => e.key === "Enter" && onPick(n.layer, n.id, n.label)}
      >
        <title>{`${n.label}: ${n.count} request${n.count === 1 ? "" : "s"} (click to filter)`}</title>
        <rect x={X[n.layer]} y={n.y} width={NODE_W} height={n.h} rx={2} />
        <text
          x={left ? X[n.layer] - 8 : X[n.layer] + NODE_W + 8}
          y={n.y + n.h / 2}
          dy="0.35em"
          textAnchor={left ? "end" : "start"}
        >
          {n.label} <tspan className="req-sankey-count">{n.count}</tspan>
        </text>
      </g>
    );
  };

  return (
    <figure className="req-sankey">
      <svg viewBox={`-10 -6 ${W + 20} ${H + 12}`} role="img" aria-label="Requests by scale, column and stage">
        <g className="req-sankey-links">
          {links.map((l, i) => (
            <path
              key={i}
              d={band(l)}
              strokeWidth={width(l)}
              className={l.to.layer === "stage" ? `req-sankey-link req-strip-${l.to.id as Stage}` : "req-sankey-link"}
            >
              <title>{`${l.from.label} → ${l.to.label}`}</title>
            </path>
          ))}
        </g>
        {[...rows, ...cols, ...stages].map(node)}
      </svg>
      <figcaption>
        <span>Scale</span>
        <span>Column</span>
        <span>Stage</span>
      </figcaption>
    </figure>
  );
}
