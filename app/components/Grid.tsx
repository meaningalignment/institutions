import { Link } from "react-router";
import {
  ROWS,
  COLS,
  VISIONS,
  TABS,
  READY_STATUSES,
  HUMAN_ERA_BUCKETS,
  getHumanEra,
  getMethodsForCol,
  type Cell,
  type MethodTag,
  type TabId,
} from "../lib/constants";
import { impactFields } from "../lib/markdown";

interface GridProps {
  tabId: TabId;
  cells: Record<string, Cell>;
  methods: Record<string, MethodTag[]>;
}

function AxisGuide() {
  return (
    <details className="axis-guide">
      <summary className="axis-guide-trigger" aria-label="How to read this grid">
        How to read this
      </summary>
      <div className="axis-guide-pop" role="note">
        <div className="axis-guide-row">
          <span className="axis-guide-tag">Rows ↓</span>
          <span className="axis-guide-text">
            <b>Scale</b> — how many actors are coordinating, dyadic to global
          </span>
        </div>
        <div className="axis-guide-row">
          <span className="axis-guide-tag">Cols →</span>
          <span className="axis-guide-text">
            <b>Informational basis</b> — the kind of information the group coordinates around
          </span>
        </div>
      </div>
    </details>
  );
}

function HumanEraLegend({ cells }: { cells: Record<string, Cell> }) {
  const used = new Set(
    Object.values(cells)
      .map((cell) => getHumanEra(cell.frontmatter)?.bucket)
      .filter(Boolean)
  );
  return (
    <div className="human-era-legend" aria-label="Human institution design era">
      {HUMAN_ERA_BUCKETS.filter((b) => used.has(b.id)).map((bucket) => (
        <span key={bucket.id} className={`human-era-legend-item era-${bucket.id}`}>
          <span className="human-era-legend-label">{bucket.label}</span>
        </span>
      ))}
    </div>
  );
}

export function Grid({ tabId, cells, methods }: GridProps) {
  const tab = TABS[tabId];
  const cellHref = (row: string, col: string) =>
    tabId === "human" ? `/human/${row}/${col}` : `/cell/${row}/${col}`;

  return (
    <>
      <div className="pane-title">{tab.title}</div>
      <div className="pane-subtitle">{tab.subtitle}</div>
      <AxisGuide />
      {tabId === "human" && <HumanEraLegend cells={cells} />}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="corner-cell axis-label-col">
                <span className="axis-corner-y">
                  Scale <span className="axis-arrow">↓</span>
                </span>
                <span className="axis-corner-x">
                  <span className="axis-arrow">→</span> Basis
                </span>
              </th>
              {COLS.map((col) => (
                <th key={col.id} className="col-header">
                  <span className="col-name">{col.name}</span>
                  <span className="col-desc">{col.desc}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.id}>
                <th className="row-header">
                  <span className="row-name">{row.name}</span>
                  <span className="row-desc">{row.desc}</span>
                </th>
                {COLS.map((col) => {
                  const key = `${row.id}-${col.id}`;
                  const cell = cells[key];
                  const hideOnTab =
                    cell &&
                    ((tabId === "agi" && cell.frontmatter?.hide_agi === true) ||
                      (tabId === "human" && cell.frontmatter?.hide_human === true));
                  const summary =
                    cell && !hideOnTab
                      ? tabId === "human"
                        ? cell.frontmatter?.human_label || cell.summary
                        : cell.summary
                      : "";
                  const visionEntries =
                    tabId === "agi" && cell?.frontmatter?.visions && typeof cell.frontmatter.visions === "object"
                      ? VISIONS.filter((v) => cell.frontmatter.visions[v.id]).map((v) => ({
                          id: v.id,
                          label: cell.frontmatter.visions[v.id] as string,
                        }))
                      : [];

                  if (!cell || (!summary && !visionEntries.length)) {
                    return (
                      <td key={col.id}>
                        <div className="cell-empty" />
                      </td>
                    );
                  }

                  const classes = ["clickable"];
                  const status = cell.frontmatter?.status;
                  if (tabId === "agi" && READY_STATUSES.has(status)) classes.push("status-body-ok");
                  if (tabId === "agi" && impactFields(cell.frontmatter)) classes.push("has-theory");
                  const humanEra = tabId === "human" ? getHumanEra(cell.frontmatter) : null;
                  if (humanEra) classes.push("human-era-tile", `era-${humanEra.bucket}`);

                  return (
                    <td key={col.id} className={classes.join(" ")}>
                      <Link className="cell-link" to={cellHref(row.id, col.id)}>
                        {humanEra ? (
                          <div className="cell-content">
                            <span className="human-era-label">{humanEra.label}</span>
                            <span className="human-cell-label">{summary}</span>
                          </div>
                        ) : (
                          <div className="cell-content">
                            {summary && <span className="cell-required-label">{summary}</span>}
                            {visionEntries.map((ve) => (
                              <span key={ve.id} className="vision-chip" data-vision={ve.id}>
                                {ve.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="methods-row">
              <th className="row-header">
                <span className="row-name">Methods</span>
                <span className="row-desc">design practices</span>
              </th>
              {COLS.map((col) => {
                const tags = getMethodsForCol(col.id, tabId, methods);
                return (
                  <td key={col.id} className="clickable">
                    <Link className="cell-link" to={`/methods/${col.id}`}>
                      <div className="cell-content">
                        {tags.map((tag, i) => (
                          <span key={i} className={tag.bold ? "method-tag bold" : "method-tag"}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
