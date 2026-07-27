// Composes a cell detail page's data server-side: parses the cell, renders the
// summary box / theory box / body HTML, and returns serializable strings for
// the route loader. Mirrors app.js renderDetail's data prep.

import { loadCell, loadHumanInstitutions } from "./content.server";
import { renderBody } from "./render.server";
import {
  renderSummaryBox,
  renderTheoryOfChange,
  renderVisionToggleBar,
  visionTagsInBody,
} from "./markdown";
import { READY_STATUSES, GITHUB_REPO, TABS, rowName, colName, type TabId } from "./constants";

export interface CellDetailData {
  found: boolean;
  hasBody: boolean;
  tabId: TabId;
  rowId: string;
  colId: string;
  breadcrumb: string;
  title: string;
  backHref: string;
  ghLink: string;
  summaryBoxHtml: string;
  theoryBoxHtml: string;
  humanEraHtml: string;
  bodyHtml: string;
  statusClass: string;
}

export function buildCellDetail(tabId: TabId, rowId: string, colId: string): CellDetailData {
  const key = `${rowId}-${colId}`;
  const cell = loadCell(key);
  const tab = TABS[tabId];
  const breadcrumb = `${tab.title} › ${rowName(rowId)} › ${colName(colId)}`;
  const backHref = tabId === "human" ? "/human" : "/";
  const ghLink = `${GITHUB_REPO}/edit/main/data/cells/${key}.md`;

  if (!cell) {
    return {
      found: false,
      hasBody: false,
      tabId,
      rowId,
      colId,
      breadcrumb,
      title: `${rowName(rowId)} × ${colName(colId)}`,
      backHref,
      ghLink: `${GITHUB_REPO}/new/main/data/cells?filename=${key}.md`,
      summaryBoxHtml: "",
      theoryBoxHtml: "",
      humanEraHtml: "",
      bodyHtml: "",
      statusClass: "",
    };
  }

  const fm = cell.frontmatter;
  const humanCell = tabId === "human" ? loadHumanInstitutions().cells[key] : null;
  const title = tabId === "human" ? humanCell?.title || cell.summary : cell.summary;
  const summaryBoxHtml = renderSummaryBox(fm);
  const theoryBoxHtml = tabId === "agi" ? renderTheoryOfChange(fm) : "";
  const humanEraHtml = "";
  const visionBar = tabId === "agi" ? renderVisionToggleBar(visionTagsInBody(cell.body)) : "";

  const status = (fm && fm.status) || "";
  const bodyStatus = READY_STATUSES.has(status) ? "body_ok" : status;
  const statusClass = bodyStatus ? ` status-${bodyStatus.replace(/_/g, "-")}` : "";

  const hasBody = !!(cell.body && cell.body.trim());
  const bodyHtml = hasBody ? renderBody(cell.body, visionBar) : "";

  return {
    found: true,
    hasBody,
    tabId,
    rowId,
    colId,
    breadcrumb,
    title,
    backHref,
    ghLink,
    summaryBoxHtml,
    theoryBoxHtml,
    humanEraHtml,
    bodyHtml,
    statusClass,
  };
}
