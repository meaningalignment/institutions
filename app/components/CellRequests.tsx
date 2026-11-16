import { useEffect } from "react";
import { Link, useFetcher } from "react-router";
import { StageMark } from "./StageMark";
import type { CellRequest } from "../routes/tracker-cell";

// The tracker's requests for this cell, fetched after the (static) cell page
// loads. Renders nothing until there is at least one.
export function CellRequests({ rowId, colId }: { rowId: string; colId: string }) {
  const fetcher = useFetcher<{ requests: CellRequest[] }>();
  useEffect(() => {
    fetcher.load(`/tracker/cell/${rowId}/${colId}`);
  }, [rowId, colId]); // eslint-disable-line react-hooks/exhaustive-deps
  const requests = fetcher.data?.requests ?? [];
  if (!requests.length) return null;
  return (
    <section className="detail-requests" aria-label="Institutions wanted here">
      <div className="detail-requests-head">
        <h2>Institutions wanted here</h2>
        <Link to="/tracker">Institution tracker →</Link>
      </div>
      <ul>
        {requests.map((r) => (
          <li key={r.id}>
            <div className="detail-requests-line">
              <Link to={`/tracker?request=${r.id}`} className="detail-requests-name">
                {r.name}
              </Link>
              <StageMark stage={r.stage} />
              {r.sites > 0 && (
                <span className="detail-requests-sites">
                  {r.sites} site{r.sites === 1 ? "" : "s"}
                </span>
              )}
            </div>
            {r.description && <p>{r.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
