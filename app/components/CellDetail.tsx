import { Link, useSearchParams } from "react-router";
import type { CellDetailData } from "../lib/detail.server";
import { colName, rowName } from "../lib/constants";
import { RESEARCH_FIELDS } from "../lib/research-fields";

// Renders the cell detail DOM at parity with the legacy app.js renderDetail.
// The inner HTML pieces (summary box, theory box, body) are produced
// server-side and injected. Lives inside #detail-view (shown via inline style,
// since the legacy default is display:none).
export function CellDetail({
  data,
  resourceFields = [],
}: {
  data: CellDetailData;
  resourceFields?: { id: string; label: string }[];
}) {
  // Arriving from a field-highlighted grid (?field=), go back to that view.
  const [searchParams] = useSearchParams();
  const field = RESEARCH_FIELDS.find((f) => f.id === searchParams.get("field"));
  const gridHref = field && data.tabId === "agi" ? `${data.backHref}?field=${field.id}` : data.backHref;
  return (
    <div id="detail-view" style={{ display: "block" }}>
      <Link className="detail-grid-back" to={gridHref}>
        ← Back to grid
      </Link>
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link to={gridHref}>
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
          {resourceFields.length > 0 && (
            <nav className="detail-resources" aria-label="Further reading">
              <span className="detail-resources-label">Further reading</span>
              {resourceFields.map((f) => (
                <Link key={f.id} to={`/resources?field=${f.id}`}>
                  {f.label}
                </Link>
              ))}
            </nav>
          )}
          <div className="detail-footer">
            <a href={data.ghLink}>Edit this page on GitHub →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
