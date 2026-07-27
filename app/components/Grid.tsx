import { Fragment, useState, type CSSProperties } from "react";
import { Link } from "react-router";
import {
  ROWS,
  COLS,
  VISIONS,
  TABS,
  READY_STATUSES,
  getMethodsForCol,
  type Cell,
  type HumanInstitution,
  type HumanInstitutionCell,
  type HumanInstitutionsData,
  type MethodTag,
  type TabId,
} from "../lib/constants";
import { impactFields } from "../lib/markdown";

interface GridProps {
  tabId: TabId;
  cells: Record<string, Cell>;
  methods: Record<string, MethodTag[]>;
  humanInstitutions?: HumanInstitutionsData;
}

function institutionEraIndex(data: HumanInstitutionsData, institution: HumanInstitution): number {
  return data.timeline.findIndex((point) => point.id === institution.era);
}

function visibleHumanInstitutions(
  data: HumanInstitutionsData,
  cell: HumanInstitutionCell | undefined,
  timelineIndex: number
): HumanInstitution[] {
  return (cell?.institutions || []).filter(
    (institution) => institutionEraIndex(data, institution) <= timelineIndex
  );
}

function HumanInstitutionText({
  records,
  data,
}: {
  records: HumanInstitution[];
  data: HumanInstitutionsData;
}) {
  return (
    <>
      {records.map((institution, index) => {
        const eraLabel = data.timeline.find((point) => point.id === institution.era)?.label;
        return (
          <Fragment key={institution.id}>
            {index > 0 && "; "}
            <span className="human-institution-entry" title={`${institution.since} — ${eraLabel}`}>
              {institution.name}
            </span>
          </Fragment>
        );
      })}
    </>
  );
}

function HumanTimeline({
  data,
  timelineIndex,
  onChange,
}: {
  data: HumanInstitutionsData;
  timelineIndex: number;
  onChange: (index: number) => void;
}) {
  const point = data.timeline[timelineIndex];
  const allInstitutions = Object.values(data.cells).flatMap((cell) => cell.institutions);
  const visibleInstitutionCount = allInstitutions.filter(
    (institution) => institutionEraIndex(data, institution) <= timelineIndex
  ).length;
  const visibleCellCount = Object.values(data.cells).filter(
    (cell) => visibleHumanInstitutions(data, cell, timelineIndex).length > 0
  ).length;
  const enteringCount = allInstitutions.filter((institution) => institution.era === point.id).length;
  const isBaseline = timelineIndex === 0;
  const progress = (timelineIndex / (data.timeline.length - 1)) * 100;

  return (
    <section className="human-timeline" aria-labelledby="human-timeline-title">
      <div className="human-timeline-readout" aria-live="polite">
        <div>
          <span className="human-timeline-eyebrow" id="human-timeline-title">
            Choose a point in institutional history
          </span>
          <div className="human-timeline-period">
            <strong>{point.date}</strong>
            <span>{point.label}</span>
          </div>
        </div>
      </div>
      <input
        className="human-timeline-range"
        type="range"
        min="0"
        max={data.timeline.length - 1}
        step="1"
        value={timelineIndex}
        onInput={(event) => onChange(Number(event.currentTarget.value))}
        aria-label="Point in institutional history"
        aria-valuetext={`${point.date}, ${visibleInstitutionCount} institutions across ${visibleCellCount} cells, ${isBaseline ? "baseline view" : `${enteringCount} added in this era`}`}
        style={{ "--timeline-progress": `${progress}%` } as CSSProperties}
      />
      <div className="human-timeline-stops" aria-hidden="true">
        {data.timeline.map((timelinePoint, index) => (
          <span key={timelinePoint.id} className={index === timelineIndex ? "is-current" : ""}>
            {timelinePoint.date}
          </span>
        ))}
      </div>
    </section>
  );
}

export function Grid({ tabId, cells, methods, humanInstitutions }: GridProps) {
  const [timelineIndex, setTimelineIndex] = useState(
    humanInstitutions ? humanInstitutions.timeline.length - 1 : 0
  );
  const tab = TABS[tabId];
  const cellHref = (row: string, col: string) =>
    tabId === "human" ? `/human/${row}/${col}` : `/cell/${row}/${col}`;

  return (
    <>
      <div className="pane-title">{tab.title}</div>
      <div className="pane-subtitle">{tab.subtitle}</div>
      {tabId === "human" && humanInstitutions && (
        <HumanTimeline data={humanInstitutions} timelineIndex={timelineIndex} onChange={setTimelineIndex} />
      )}
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
                  const humanCell = humanInstitutions?.cells[key];
                  const humanRecords = humanInstitutions
                    ? visibleHumanInstitutions(humanInstitutions, humanCell, timelineIndex)
                    : [];
                  const hideOnTab =
                    cell &&
                    ((tabId === "agi" && cell.frontmatter?.hide_agi === true) ||
                      (tabId === "human" && cell.frontmatter?.hide_human === true));
                  const summary =
                    cell && !hideOnTab
                      ? tabId === "agi"
                        ? cell.summary
                        : humanCell?.title || ""
                      : "";
                  const visionEntries =
                    tabId === "agi" && cell?.frontmatter?.visions && typeof cell.frontmatter.visions === "object"
                      ? VISIONS.filter((v) => cell.frontmatter.visions[v.id]).map((v) => ({
                          id: v.id,
                          label: cell.frontmatter.visions[v.id] as string,
                        }))
                      : [];

                  const outsideTimeline = tabId === "human" && !hideOnTab && humanRecords.length === 0;

                  if (!cell || (tabId === "agi" && !summary && !visionEntries.length) || (tabId === "human" && !humanCell)) {
                    return (
                      <td key={col.id}>
                        <div className="cell-empty" />
                      </td>
                    );
                  }

                  if (outsideTimeline) {
                    return (
                      <td key={col.id} className="human-timeline-outside">
                        <span className="human-timeline-placeholder" aria-hidden="true" />
                        <span className="sr-only">
                          No institutions in this cell are in view at {humanInstitutions?.timeline[timelineIndex].date}
                        </span>
                      </td>
                    );
                  }

                  const classes = ["clickable"];
                  const status = cell.frontmatter?.status;
                  if (tabId === "agi" && READY_STATUSES.has(status)) classes.push("status-body-ok");
                  if (tabId === "agi" && impactFields(cell.frontmatter)) classes.push("has-theory");
                  if (tabId === "human") classes.push("human-institution-tile");

                  return (
                    <td key={col.id} className={classes.join(" ")}>
                      <Link className="cell-link" to={cellHref(row.id, col.id)}>
                        {tabId === "human" && humanInstitutions ? (
                          <div className="cell-content human-institution-list">
                            {(() => {
                              const currentEraId = timelineIndex === 0
                                ? null
                                : humanInstitutions.timeline[timelineIndex].id;
                              const inherited = humanRecords.filter((record) => record.era !== currentEraId);
                              const arrivals = currentEraId
                                ? humanRecords.filter((record) => record.era === currentEraId)
                                : [];
                              return (
                                <>
                                  {inherited.length > 0 && (
                                    <span className="human-institution-inherited">
                                      <HumanInstitutionText records={inherited} data={humanInstitutions} />
                                    </span>
                                  )}
                                  {arrivals.length > 0 && (
                                    <span className="human-institution-new-line">
                                      <span className="human-institution-new-label" aria-hidden="true">New!</span>
                                      <span className="sr-only">Added in this era: </span>
                                      <HumanInstitutionText records={arrivals} data={humanInstitutions} />
                                    </span>
                                  )}
                                </>
                              );
                            })()}
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
