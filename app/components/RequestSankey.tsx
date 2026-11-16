// The tracker's pipeline Sankey: every request starts on the left and flows
// right through the stages (in design → designed → tested → in use), peeling
// off at the stage it has currently reached. Clicking a node filters the list
// to the stages it stands for.

import { STAGES, STAGE_LABEL, requestStage, type InstitutionRequest, type Stage } from "../lib/requests";

interface FlowNode {
  key: string;
  label: string;
  count: number;
  stages: Stage[]; // the stages this node stands for (for filtering and colour)
  x: number;
  y: number;
  h: number;
  terminal: boolean;
}

const W = 1000;
const H = 120;
const NODE_W = 14;
const GAP = 24; // room for the label above the next node
const MIN_H = 7; // keep small counts visible next to large ones

export function RequestSankey({
  requests,
  onPick,
}: {
  requests: InstitutionRequest[];
  onPick: (stages: Stage[]) => void;
}) {
  const total = requests.length;
  if (!total) return null;

  const at = new Map<Stage, number>(STAGES.map((s) => [s, 0]));
  for (const r of requests) {
    const st = requestStage(r.links, r.sites);
    at.set(st, at.get(st)! + 1);
  }
  // reached[k] = requests at stage k or further along.
  const reached = STAGES.map((_, k) => STAGES.slice(k).reduce((n, s) => n + at.get(s)!, 0));

  const scale = (H - GAP - MIN_H) / total;
  const h = (n: number) => (n ? MIN_H + n * scale : 0);
  const step = (W - NODE_W) / (STAGES.length - 1);

  // Column k holds "reached stage k" on top and, below it, the requests that
  // stopped at the previous stage. The last column's "reached" is In use itself.
  const nodes: FlowNode[] = [];
  const flows: { from: FlowNode; to: FlowNode; value: number; offset: number }[] = [];
  let prev: FlowNode | null = null;
  STAGES.forEach((stage, k) => {
    const x = k * step;
    const reach: FlowNode = {
      key: `reach-${stage}`,
      // "In design+" = at that stage or further along.
      label: k === 0 ? "All" : k === STAGES.length - 1 ? STAGE_LABEL[stage] : `${STAGE_LABEL[stage]}+`,
      count: reached[k],
      stages: STAGES.slice(k) as Stage[],
      x,
      y: 0,
      h: h(reached[k]),
      terminal: k === STAGES.length - 1,
    };
    nodes.push(reach);
    if (prev) {
      const stoppedStage = STAGES[k - 1];
      const stopped: FlowNode = {
        key: `stop-${stoppedStage}`,
        label: STAGE_LABEL[stoppedStage],
        count: at.get(stoppedStage)!,
        stages: [stoppedStage],
        x,
        y: reach.h + GAP,
        h: h(at.get(stoppedStage)!),
        terminal: true,
      };
      nodes.push(stopped);
      if (reach.count) flows.push({ from: prev, to: reach, value: reach.count, offset: 0 });
      if (stopped.count) flows.push({ from: prev, to: stopped, value: stopped.count, offset: reach.count });
    }
    prev = reach;
  });

  // A band is a filled ribbon: at the source it takes the source's share of
  // that node's height (offset/value are request counts), at the target it
  // fills the target node, so ribbons always match the blocks they join.
  const band = (f: (typeof flows)[number]) => {
    const x0 = f.from.x + NODE_W;
    const x1 = f.to.x;
    const sTop = f.from.y + (f.from.h * f.offset) / f.from.count;
    const sBot = f.from.y + (f.from.h * (f.offset + f.value)) / f.from.count;
    const tTop = f.to.y;
    const tBot = f.to.y + f.to.h;
    const mx = (x0 + x1) / 2;
    return `M${x0},${sTop} C${mx},${sTop} ${mx},${tTop} ${x1},${tTop} L${x1},${tBot} C${mx},${tBot} ${mx},${sBot} ${x0},${sBot} Z`;
  };
  const colourOf = (n: FlowNode) => (n.terminal ? `req-strip-${n.stages[0]}` : "");

  return (
    <figure className="req-sankey">
      <svg viewBox={`-4 -22 ${W + 170} ${H + 34}`} role="img" aria-label="Requests by how far along they are">
        <g>
          {flows.map((f) => {
            return (
              <path key={`${f.from.key}-${f.to.key}`} d={band(f)} className={`req-sankey-link ${colourOf(f.to)}`}>
                <title>{`${f.to.label}: ${f.value}`}</title>
              </path>
            );
          })}
        </g>
        {nodes
          .filter((n) => n.count > 0 || n.terminal)
          .map((n) => (
            <g
              key={n.key}
              className={`req-sankey-node ${colourOf(n)}${n.count ? "" : " is-empty"}`}
              role="button"
              tabIndex={n.count ? 0 : -1}
              onClick={() => n.count && onPick(n.stages)}
              onKeyDown={(e) => e.key === "Enter" && n.count && onPick(n.stages)}
            >
              <title>{`${n.label}: ${n.count} request${n.count === 1 ? "" : "s"}${n.count ? " (click to filter)" : ""}`}</title>
              {n.count > 0 && <rect x={n.x} y={n.y} width={NODE_W} height={n.h} rx={2} />}
              <text
                x={n.terminal ? n.x + NODE_W + 8 : n.x}
                y={n.terminal ? (n.count ? n.y + n.h / 2 : n.y + 5) : n.y - 7}
                dy={n.terminal ? "0.35em" : 0}
              >
                {n.label} <tspan className="req-sankey-count">{n.count}</tspan>
              </text>
            </g>
          ))}
      </svg>
    </figure>
  );
}
