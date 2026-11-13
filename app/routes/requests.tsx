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
  getVisions,
  createVision,
  updateVisionField,
  deleteVision,
  updateRequestField,
  updateSiteField,
} from "../lib/requests.server";
import { REQUEST_STATUSES, type InstitutionRequest, type RequestSite, type RequestVision } from "../lib/requests";
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
  const [session, requests, visions] = await Promise.all([
    getSignedInResearcher(request),
    getRequests(),
    getVisions(),
  ]);
  const rowOrder = ROWS.map((r) => r.id);
  const colOrder = COLS.map((c) => c.id);
  requests.sort(
    (a, b) =>
      colOrder.indexOf(a.column) - colOrder.indexOf(b.column) ||
      rowOrder.indexOf(a.row) - rowOrder.indexOf(b.row)
  );
  return { requests, visions, canEdit: !!session?.isAdmin };
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
    if (intent === "create-vision") {
      await createVision(String(fd.get("label") || ""), String(fd.get("url") || ""));
    } else if (intent === "update-vision") {
      await updateVisionField(String(fd.get("visionId") || ""), field, value);
    } else if (intent === "delete-vision") {
      await deleteVision(String(fd.get("visionId") || ""));
    } else if (intent === "create-request") {
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

// Grid visions keep their colour here; other vision tags use the accent colour.
const visionColor = (id: string) => VISIONS.find((v) => v.id === id)?.color ?? "var(--accent)";

function VisionTag({ vision }: { vision: RequestVision }) {
  const style = { color: visionColor(vision.id) };
  return vision.url ? (
    <a className="req-tag req-vision" style={style} href={vision.url} target="_blank" rel="noopener noreferrer">
      {vision.label}
    </a>
  ) : (
    <span className="req-tag req-vision" style={style}>
      {vision.label}
    </span>
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

function RequestRow({
  r,
  editing,
  visions,
}: {
  r: InstitutionRequest;
  editing: boolean;
  visions: RequestVision[];
}) {
  const visionOptions = [{ id: "", name: "None" }, ...visions.map((v) => ({ id: v.id, name: v.label }))];
  const vision = visions.find((v) => v.id === r.vision);
  if (editing) {
    return (
      <tr className="req-editing">
        <td className="req-name">
          <Field intent="update-request" id={r.id} field="name" value={r.name} kind="textarea" />
          <div className="req-place-edit">
            <Field intent="update-request" id={r.id} field="column" value={r.column} kind="select" options={COLS} />
            <Field intent="update-request" id={r.id} field="row" value={r.row} kind="select" options={ROWS} />
            <Field intent="update-request" id={r.id} field="vision" value={r.vision ?? ""} kind="select" options={visionOptions} />
          </div>
          <label>Description</label>
          <Field
            intent="update-request"
            id={r.id}
            field="description"
            value={r.description}
            kind="textarea"
            placeholder="Two or three sentences on what needs to be built."
          />
          <label>Read more link</label>
          <Field intent="update-request" id={r.id} field="readMoreUrl" value={r.readMoreUrl} placeholder="https://…" />
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
      <td className="req-name">
        <div className="req-title-line">
          <Link to={`/cell/${r.row}/${r.column}${r.vision && VISIONS.some((v) => v.id === r.vision) ? `?visions=${r.vision}` : ""}`}>{r.name}</Link>
          <span className="req-tag">{rowName(r.row)}</span>
          {r.vision && (vision ? <VisionTag vision={vision} /> : <span className="req-tag">{r.vision}</span>)}
        </div>
        {r.description && <p className="req-desc">{r.description}</p>}
        {r.readMoreUrl && (
          <a className="req-more" href={r.readMoreUrl} target="_blank" rel="noopener noreferrer">
            Read more ↗
          </a>
        )}
      </td>
      <td className="req-sites">
        <SitesPopover r={r} editing={false} />
      </td>
    </tr>
  );
}

function NewRequest() {
  const fetcher = useFetcher<ActionResult>();
  return (
    <button
      type="button"
      className="req-btn-ghost"
      disabled={fetcher.state !== "idle"}
      onClick={() =>
        fetcher.submit(
          { intent: "create-request", row: ROWS[0].id, column: COLS[0].id },
          { method: "post" }
        )
      }
    >
      New request
    </button>
  );
}

// Edit mode: rename vision tags, set their links, add or remove them.
function VisionRow({ vision }: { vision: RequestVision }) {
  const fetcher = useFetcher<ActionResult>();
  const save = (field: string, value: string, current: string) => {
    if (value !== current) fetcher.submit({ intent: "update-vision", visionId: vision.id, field, value }, { method: "post" });
  };
  const error = fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
  return (
    <div className="req-vision-row">
      <input defaultValue={vision.label} onBlur={(e) => save("label", e.target.value, vision.label)} aria-label="Vision name" />
      <input
        defaultValue={vision.url}
        placeholder="https://…"
        onBlur={(e) => save("url", e.target.value, vision.url)}
        aria-label="Vision link"
      />
      <button
        type="button"
        className="req-btn-ghost"
        onClick={() => {
          if (confirm(`Delete the vision "${vision.label}"? Requests tagged with it become untagged.`))
            fetcher.submit({ intent: "delete-vision", visionId: vision.id }, { method: "post" });
        }}
      >
        Delete
      </button>
      {error && <span className="req-error">{error}</span>}
    </div>
  );
}

function VisionsPanel({ visions }: { visions: RequestVision[] }) {
  const fetcher = useFetcher<ActionResult>();
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const add = () => {
    if (!label.trim()) return;
    fetcher.submit({ intent: "create-vision", label, url }, { method: "post" });
    setLabel("");
    setUrl("");
  };
  return (
    <div className="req-visions-panel">
      <div className="req-popover-section">Vision tags</div>
      {visions.map((v) => (
        <VisionRow key={v.id} vision={v} />
      ))}
      <div className="req-vision-row">
        <input value={label} placeholder="New vision" onChange={(e) => setLabel(e.target.value)} />
        <input value={url} placeholder="https://… (optional)" onChange={(e) => setUrl(e.target.value)} />
        <button type="button" className="req-btn-ghost" onClick={add} disabled={!label.trim()}>
          Add vision
        </button>
        {fetcher.data && !fetcher.data.ok && <span className="req-error">{fetcher.data.error}</span>}
      </div>
    </div>
  );
}

export default function Requests({ loaderData: { requests, visions, canEdit } }: Route.ComponentProps) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(false);

  // Every word must appear somewhere in the request: its vision, column, row,
  // name, site hints, or any site's name, details or status.
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = words.length
    ? requests.filter((r) => {
        const haystack = [
          visions.find((v) => v.id === r.vision)?.label ?? r.vision ?? "",
          colName(r.column),
          rowName(r.row),
          r.name,
          r.siteHints,
          r.description,
          ...r.sites.flatMap((s) => [s.name, s.instead, s.pain, s.success, s.status]),
        ]
          .join(" ")
          .toLowerCase();
        return words.every((w) => haystack.includes(w));
      })
    : requests;

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
        <input
          type="search"
          className="req-search"
          value={query}
          placeholder="Search requests, visions, rows, columns, sites and hints"
          aria-label="Search requests"
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="req-count">
          {shown.length} of {requests.length} requests
        </span>
        {canEdit && (
          <span className="req-edit-controls">
            {editing && <NewRequest />}
            <button type="button" className="req-btn" onClick={() => setEditing((e) => !e)}>
              {editing ? "Done editing" : "Edit"}
            </button>
          </span>
        )}
      </div>

      {canEdit && editing && <VisionsPanel visions={visions} />}

      <div className="req-table-wrap">
        <table className="req-table">
          {COLS.map((c) => {
            const group = shown.filter((r) => r.column === c.id);
            if (!group.length) return null;
            return (
              <tbody key={c.id}>
                <tr className="req-group">
                  <th colSpan={2}>
                    {c.name} <span className="req-group-desc">{c.desc}</span>
                  </th>
                </tr>
                {group.map((r) => (
                  <RequestRow key={r.id} r={r} editing={editing} visions={visions} />
                ))}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
