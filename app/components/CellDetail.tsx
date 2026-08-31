import { Link } from "react-router";
import type { CellDetailData } from "../lib/detail.server";
import { colName, rowName } from "../lib/constants";

// Renders the cell detail DOM at parity with the legacy app.js renderDetail.
// The inner HTML pieces (summary box, theory box, body) are produced
// server-side and injected. Lives inside #detail-view (shown via inline style,
// since the legacy default is display:none).
export function CellDetail({ data }: { data: CellDetailData }) {
  return (
    <div id="detail-view" style={{ display: "block" }}>
      <Link className="detail-grid-back" to={data.backHref}>
        ← Back to grid
      </Link>
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link to={data.backHref}>
          {data.tabId === "human" ? "Existing institutions grid" : "AGI institutions grid"}
        </Link>
        <span aria-hidden="true">›</span>
        <Link to={`${data.backHref}?row=${data.rowId}#row-${data.rowId}`}>
          {rowName(data.rowId)}
        </Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{colName(data.colId)}</span>
      </nav>
      <div className="detail-title">{data.title}</div>
      {data.humanEraHtml && (
        <div dangerouslySetInnerHTML={{ __html: data.humanEraHtml }} />
      )}
      <div className="detail-layout detail-layout--no-rail">
        <div className="detail-main">
          {data.summaryBoxHtml && (
            <div dangerouslySetInnerHTML={{ __html: data.summaryBoxHtml }} />
          )}
          {data.theoryBoxHtml && (
            <div dangerouslySetInnerHTML={{ __html: data.theoryBoxHtml }} />
          )}
          {data.found && data.hasBody ? (
            <>
              <div
                className={`detail-body${data.statusClass}`}
                dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
              />
              <div className="detail-placeholder detail-body-hidden-notice">
                This cell isn’t ready yet.
              </div>
            </>
          ) : (
            <div className="detail-placeholder">
              This cell {data.found ? "hasn’t been documented" : "hasn’t been defined"} yet.{" "}
              <a href={data.ghLink}>
                {data.found ? "Contribute on GitHub" : "Create it on GitHub"} →
              </a>
            </div>
          )}
          <div className="detail-footer">
            <a href={data.ghLink}>Edit this page on GitHub →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
