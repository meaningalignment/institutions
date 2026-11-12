import { useState } from "react";
import { Link, useFetcher } from "react-router";
import type { Route } from "./+types/requests";
import { getSignedInResearcher, requireAdminSession } from "../lib/auth.server";
import {
  createRequest,
  createSite,
  deleteRequest,
  deleteSite,
  getRequests,
  updateRequestField,
  updateSiteField,
} from "../lib/requests.server";
import { REQUEST_STATUSES, type InstitutionRequest, type RequestSite } from "../lib/requests";
import {
  COLS,
  OG_IMAGE_META,
  ROWS,
  SITE_NAME,
  SITE_ORIGIN,
  VISIONS,
  colName,
  rowName,
} from "../lib/constants";

type ActionResult = { ok: boolean; error?: string };

export async function loader({ request }: Route.LoaderArgs) {
  const [session, requests] = await Promise.all([getSignedInResearcher(request), getRequests()]);
  const rowOrder = ROWS.map((r) => r.id);
  const colOrder = COLS.map((c) => c.id);
  requests.sort(
    (a, b) =>
      rowOrder.indexOf(a.row) - rowOrder.indexOf(b.row) ||
      colOrder.indexOf(a.column) - colOrder.indexOf(b.column)
  );
  return { requests, canEdit: !!session?.isAdmin };
}

function positiveInteger(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  await requireAdminSession(request);
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "");
  const id = positiveInteger(fd.get("id"));
  const field = String(fd.get("field") || "");
  const value = String(fd.get("value") ?? "");
  try {
    if (intent === "create-request") {
      await createRequest(String(fd.get("row") || ""), String(fd.get("column") || ""));
    } else if (!id) {
      return { ok: false, error: "Missing id." };
    } else if (intent === "update-request") await updateRequestField(id, field, value);
    else if (intent === "delete-request") await deleteRequest(id);
    else if (intent === "create-site") await createSite(id, value);
    else if (intent === "update-site") await updateSiteField(id, field, value);
    else if (intent === "delete-site") await deleteSite(id);
    else return { ok: false, error: "Unknown action." };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "The change could not be saved." };
  }
}

export function meta(_: Route.MetaArgs) {
  const title = `Requests for institutions — ${SITE_NAME}`;
  const desc =
    "Requests for new institution designs: what each is for, where on the grid it sits, and the places that could adopt it.";
  return [
    { title },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/requests/` },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    ...OG_IMAGE_META,
  ];
}

const visionLabel = (id: string | null) => (id ? VISIONS.find((v) => v.id === id)?.label ?? id : "");
const visionColor = (id: string | null) => (id ? VISIONS.find((v) => v.id === id)?.color : undefined);

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { id: string; name: string }[];
}) {
  return (
    <label className="req-filter">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}

// One field that saves itself: text fields on blur, selects on change.
function Field({
  intent,
  id,
  field,
  value,
  kind = "input",
  options,
  placeholder,
  className = "",
}: {
  intent: "update-request" | "update-site";
  id: number;
  field: string;
  value: string;
  kind?: "input" | "textarea" | "select";
  options?: readonly { id: string; name: string }[];
  placeholder?: string;
  className?: string;
}) {
  const fetcher = useFetcher<ActionResult>();
  const [draft, setDraft] = useState(value);
  const save = (next: string) => {
    if (next === value) return;
    fetcher.submit({ intent, id: String(id), field, value: next }, { method: "post" });
  };
  const error = fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
  const saving = fetcher.state !== "idle";
  return (
    <span className={`req-field ${className}`}>
      {kind === "select" ? (
        <select
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            save(e.target.value);
          }}
        >
          {options!.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      ) : kind === "textarea" ? (
        <textarea
          value={draft}
          placeholder={placeholder}
          rows={Math.min(8, Math.max(2, draft.split("\n").length + 1))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => save(draft)}
        />
      ) : (
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => save(draft)}
        />
      )}
      {(error || saving) && <span className={error ? "req-error" : "req-saving"}>{error || "Saving…"}</span>}
    </span>
  );
}

function DeleteButton({ intent, id, label }: { intent: string; id: number; label: string }) {
  const fetcher = useFetcher<ActionResult>();
  return (
    <button
      type="button"
      className="req-btn-ghost"
      disabled={fetcher.state !== "idle"}
      onClick={() => {
        if (confirm(`Delete ${label}?`)) fetcher.submit({ intent, id: String(id) }, { method: "post" });
      }}
    >
      Delete
    </button>
  );
}

function AddSite({ requestId }: { requestId: number }) {
  const fetcher = useFetcher<ActionResult>();
  const [name, setName] = useState("");
  const submit = () => {
    if (!name.trim()) return;
    fetcher.submit({ intent: "create-site", id: String(requestId), value: name }, { method: "post" });
    setName("");
  };
  return (
    <div className="req-add-site">
      <input
        value={name}
        placeholder="Add a real place, e.g. Westfield, NJ eldercare office"
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />
      <button type="button" className="req-btn-ghost" onClick={submit} disabled={!name.trim()}>
        Add site
      </button>
      {fetcher.data && !fetcher.data.ok && <span className="req-error">{fetcher.data.error}</span>}
    </div>
  );
}

const statusOptions = REQUEST_STATUSES.map((s) => ({ id: s, name: s }));

// Site info opens in a popover (native Popover API), for viewing and editing alike.
function Site({ site, editing }: { site: RequestSite; editing: boolean }) {
  const popoverId = `req-site-${site.id}`;
  const show = (label: string, text: string) =>
    text ? (
      <>
        <dt>{label}</dt>
        <dd>{text}</dd>
      </>
    ) : null;
  return (
    <div className="req-site">
      <button type="button" className="req-site-btn" popoverTarget={popoverId}>
        <span className="req-site-name">{site.name}</span>
        <span className={`req-status req-status-${site.status}`}>{site.status}</span>
      </button>
      <div id={popoverId} popover="auto" className="req-popover">
        <div className="req-popover-head">
          <span className="req-popover-title">{site.name}</span>
          <button type="button" className="req-popover-close" popoverTarget={popoverId} popoverTargetAction="hide" aria-label="Close">
            ×
          </button>
        </div>
        {editing ? (
          <div className="req-site-edit">
            <label>Name</label>
            <Field intent="update-site" id={site.id} field="name" value={site.name} />
            <label>Status</label>
            <Field intent="update-site" id={site.id} field="status" value={site.status} kind="select" options={statusOptions} />
            <label>Currently doing instead</label>
            <Field intent="update-site" id={site.id} field="instead" value={site.instead} kind="textarea" />
            <label>Pain point</label>
            <Field intent="update-site" id={site.id} field="pain" value={site.pain} kind="textarea" />
            <label>How we'd recognize success</label>
            <Field intent="update-site" id={site.id} field="success" value={site.success} kind="textarea" />
            <DeleteButton intent="delete-site" id={site.id} label={`the site "${site.name}"`} />
          </div>
        ) : site.instead || site.pain || site.success ? (
          <dl>
            <dt>Status</dt>
            <dd>{site.status}</dd>
            {show("Currently doing instead", site.instead)}
            {show("Pain point", site.pain)}
            {show("How we'd recognize success", site.success)}
          </dl>
        ) : (
          <p className="req-empty">Status: {site.status}. No details yet.</p>
        )}
      </div>
    </div>
  );
}

// "No sites yet" / "N sites" opens a popover with the request's sites and
// site hints. Site popovers opened from inside it nest as its children.
function SitesPopover({ r, editing }: { r: InstitutionRequest; editing: boolean }) {
  const popoverId = `req-sites-${r.id}`;
  const label = r.sites.length ? `${r.sites.length} site${r.sites.length === 1 ? "" : "s"}` : "No sites yet";
  const hints = r.siteHints.split(/\n+/).filter((line) => line.trim());
  return (
    <>
      <button type="button" className={`req-sites-btn${r.sites.length ? "" : " is-empty"}`} popoverTarget={popoverId}>
        {label}
      </button>
      <div id={popoverId} popover="auto" className="req-popover">
        <div className="req-popover-head">
          <span className="req-popover-title">{r.name}</span>
          <button type="button" className="req-popover-close" popoverTarget={popoverId} popoverTargetAction="hide" aria-label="Close">
            ×
          </button>
        </div>
        <div className="req-popover-section">Sites</div>
        {r.sites.length ? (
          r.sites.map((s) => <Site key={s.id} site={s} editing={editing} />)
        ) : (
          <p className="req-empty">No sites yet.</p>
        )}
        {editing && <AddSite requestId={r.id} />}
        <div className="req-popover-section">Site hints</div>
        {editing ? (
          <Field
            intent="update-request"
            id={r.id}
            field="siteHints"
            value={r.siteHints}
            kind="textarea"
            placeholder="Who might have demand for this? One per paragraph."
          />
        ) : hints.length ? (
          <div className="req-hints">
            {hints.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ) : (
          <p className="req-empty">None yet.</p>
        )}
      </div>
    </>
  );
}

const visionOptions = [{ id: "", name: "None" }, ...VISIONS.map((v) => ({ id: v.id, name: v.label }))];

function RequestRow({ r, editing }: { r: InstitutionRequest; editing: boolean }) {
  if (editing) {
    return (
      <tr className="req-editing">
        <td>
          <Field intent="update-request" id={r.id} field="vision" value={r.vision ?? ""} kind="select" options={visionOptions} />
        </td>
        <td className="req-name">
          <Field intent="update-request" id={r.id} field="name" value={r.name} kind="textarea" />
          <div className="req-place-edit">
            <Field intent="update-request" id={r.id} field="column" value={r.column} kind="select" options={COLS} />
            <Field intent="update-request" id={r.id} field="row" value={r.row} kind="select" options={ROWS} />
          </div>
          <DeleteButton intent="delete-request" id={r.id} label={`the request "${r.name}" and its sites`} />
        </td>
        <td className="req-sites">
          <SitesPopover r={r} editing />
        </td>
      </tr>
    );
  }
  return (
    <tr>
      <td>
        {r.vision && (
          <span className="req-vision" style={{ color: visionColor(r.vision) }}>
            {visionLabel(r.vision)}
          </span>
        )}
      </td>
      <td className="req-name">
        <Link to={`/cell/${r.row}/${r.column}${r.vision ? `?visions=${r.vision}` : ""}`}>{r.name}</Link>
        <div className="req-place">
          {colName(r.column)} · {rowName(r.row)}
        </div>
      </td>
      <td className="req-sites">
        <SitesPopover r={r} editing={false} />
      </td>
    </tr>
  );
}

function NewRequest({ row, col }: { row: string; col: string }) {
  const fetcher = useFetcher<ActionResult>();
  return (
    <button
      type="button"
      className="req-btn-ghost"
      disabled={fetcher.state !== "idle"}
      onClick={() =>
        fetcher.submit(
          { intent: "create-request", row: row || ROWS[0].id, column: col || COLS[0].id },
          { method: "post" }
        )
      }
    >
      New request
    </button>
  );
}

export default function Requests({ loaderData: { requests, canEdit } }: Route.ComponentProps) {
  const [vision, setVision] = useState("");
  const [row, setRow] = useState("");
  const [col, setCol] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(false);

  const shown = requests.filter(
    (r) =>
      (!vision || (vision === "none" ? !r.vision : r.vision === vision)) &&
      (!row || r.row === row) &&
      (!col || r.column === col) &&
      (!status || r.sites.some((s) => s.status === status))
  );

  return (
    <div className="req-page">
      <Link to="/" className="detail-back">
        ← Back to grid
      </Link>
      <h1 className="req-title">Requests for institutions</h1>
      <p className="req-lede">
        Institutions we'd like designed, and the real places that could adopt them. For each site: what it
        does today, what hurts, how we'd recognize success, and where the work stands.
      </p>

      <div className="req-filters">
        <Filter
          label="Vision"
          value={vision}
          onChange={setVision}
          options={[...VISIONS.map((v) => ({ id: v.id, name: v.label })), { id: "none", name: "None" }]}
        />
        <Filter label="Row" value={row} onChange={setRow} options={ROWS} />
        <Filter label="Column" value={col} onChange={setCol} options={COLS} />
        <Filter label="Site status" value={status} onChange={setStatus} options={statusOptions} />
        <span className="req-count">
          {shown.length} of {requests.length} requests
        </span>
        {canEdit && (
          <span className="req-edit-controls">
            {editing && <NewRequest row={row} col={col} />}
            <button type="button" className="req-btn" onClick={() => setEditing((e) => !e)}>
              {editing ? "Done editing" : "Edit"}
            </button>
          </span>
        )}
      </div>

      <div className="req-table-wrap">
        <table className="req-table">
          <thead>
            <tr>
              <th>Vision</th>
              <th>Name</th>
              <th>Sites</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <RequestRow key={r.id} r={r} editing={editing} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
