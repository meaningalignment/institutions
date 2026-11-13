import React, { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
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
  updateRequestFields,
  updateSiteField,
} from "../lib/requests.server";
import {
  PAPER_KINDS,
  PAPER_KIND_LABEL,
  REQUEST_STATUSES,
  STAGES,
  STAGE_LABEL,
  requestStage,
  type InstitutionRequest,
  type PaperKind,
  type RequestPaper,
  type RequestSite,
  type RequestVision,
} from "../lib/requests";
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

type ActionResult = { ok: boolean; error?: string; createdId?: number; createdVisionId?: string };

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
      const createdVisionId = await createVision(String(fd.get("label") || ""), String(fd.get("url") || ""));
      return { ok: true, createdVisionId };
    } else if (intent === "update-vision") {
      await updateVisionField(String(fd.get("visionId") || ""), field, value);
    } else if (intent === "delete-vision") {
      await deleteVision(String(fd.get("visionId") || ""));
    } else if (intent === "create-request") {
      const createdId = await createRequest(String(fd.get("row") || ""), String(fd.get("column") || ""));
      return { ok: true, createdId };
    } else if (!id) {
      return { ok: false, error: "Missing id." };
    } else if (intent === "update-request") await updateRequestField(id, field, value);
    else if (intent === "update-request-many") await updateRequestFields(id, JSON.parse(value));
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

// ── Edit in place ──────────────────────────────────────────────────

type Intent = "update-request" | "update-site";

// Text that becomes an input (or textarea) of the same size when clicked, and
// saves on blur or Enter (Cmd/Ctrl+Enter in multi-line fields). Escape cancels.
function InlineText({
  intent,
  id,
  field,
  value,
  multiline = false,
  placeholder,
  className = "",
  onLocalChange,
}: {
  intent: Intent;
  id: number;
  field: string;
  value: string;
  multiline?: boolean;
  placeholder: string;
  className?: string;
  /** Draft mode: report the new value instead of saving it. */
  onLocalChange?: (value: string) => void;
}) {
  const fetcher = useFetcher<ActionResult>();
  const pending = fetcher.formData?.get("value");
  const shown = !onLocalChange && typeof pending === "string" ? pending : value;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(shown);
  const startRef = useRef(shown);
  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  // In draft mode every keystroke updates the row's draft, so Save shows up at once.
  const change = (v: string) => {
    setDraft(v);
    onLocalChange?.(v);
  };

  useEffect(() => {
    if (!editing) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [editing]);
  useEffect(() => {
    const el = ref.current;
    if (editing && multiline && el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [draft, editing, multiline]);

  const commit = () => {
    setEditing(false);
    if (onLocalChange || draft === shown) return;
    fetcher.submit({ intent, id: String(id), field, value: draft }, { method: "post" });
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setDraft(startRef.current);
      onLocalChange?.(startRef.current);
      setEditing(false);
    } else if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      commit();
    }
  };
  const error = fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;

  return (
    <>
      {editing ? (
        multiline ? (
          <textarea
            ref={ref}
            className={`req-inline-input ${className}`}
            value={draft}
            placeholder={placeholder}
            rows={1}
            onChange={(e) => change(e.target.value)}
            onBlur={commit}
            onKeyDown={onKeyDown}
          />
        ) : (
          <input
            ref={ref}
            className={`req-inline-input ${className}`}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => change(e.target.value)}
            onBlur={commit}
            onKeyDown={onKeyDown}
          />
        )
      ) : (
        <span
          role="button"
          tabIndex={0}
          title="Click to edit"
          className={`req-inline ${className}${shown ? "" : " is-empty"}`}
          onClick={() => {
            setDraft(shown);
            startRef.current = shown;
            setEditing(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setDraft(shown);
              startRef.current = shown;
              setEditing(true);
            }
          }}
        >
          {shown || placeholder}
        </span>
      )}
      {error && <span className="req-error">{error}</span>}
    </>
  );
}

// A tag-shaped select that saves on change.
function InlineSelect({
  intent,
  id,
  field,
  value,
  options,
  className = "",
  onLocalChange,
}: {
  intent: Intent;
  id: number;
  field: string;
  value: string;
  options: readonly { id: string; name: string }[];
  className?: string;
  onLocalChange?: (value: string) => void;
}) {
  const fetcher = useFetcher<ActionResult>();
  const pending = fetcher.formData?.get("value");
  const shown = !onLocalChange && typeof pending === "string" ? pending : value;
  return (
    <select
      className={`req-tag req-tag-select ${className}`}
      value={shown}
      onChange={(e) =>
        onLocalChange
          ? onLocalChange(e.target.value)
          : fetcher.submit({ intent, id: String(id), field, value: e.target.value }, { method: "post" })
      }
    >
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  );
}

function DeleteLink({ intent, id, label }: { intent: string; id: number; label: string }) {
  const fetcher = useFetcher<ActionResult>();
  return (
    <button
      type="button"
      className="req-link-btn req-danger"
      disabled={fetcher.state !== "idle"}
      onClick={() => {
        if (confirm(`Delete ${label}?`)) fetcher.submit({ intent, id: String(id) }, { method: "post" });
      }}
    >
      Delete
    </button>
  );
}

// A "⋯" button that opens a small menu of less common actions.
function MoreMenu({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <>
      <button type="button" className="req-more-btn" popoverTarget={id} aria-label="More actions" style={{ anchorName: `--${id}` } as React.CSSProperties}>
        ⋯
      </button>
      <div id={id} popover="auto" className="req-menu" style={{ positionAnchor: `--${id}` } as React.CSSProperties}>
        {children}
      </div>
    </>
  );
}

const statusOptions = REQUEST_STATUSES.map((s) => ({ id: s, name: s }));

// ── Sites ──────────────────────────────────────────────────────────

// Type a place: pick a site already used on another request, or add a new one.
function SitePicker({ requestId, taken, allSites }: { requestId: number; taken: string[]; allSites: string[] }) {
  const fetcher = useFetcher<ActionResult>();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const q = query.trim().toLowerCase();
  const takenSet = new Set(taken.map((t) => t.toLowerCase()));
  const matches = allSites
    .filter((s) => !takenSet.has(s.toLowerCase()) && (!q || s.toLowerCase().includes(q)))
    .slice(0, 6);
  const exact = allSites.some((s) => s.toLowerCase() === q) || takenSet.has(q);
  const options = [...matches.map((name) => ({ name, isNew: false })), ...(q && !exact ? [{ name: query.trim(), isNew: true }] : [])];

  const add = (name: string) => {
    fetcher.submit({ intent: "create-site", id: String(requestId), value: name }, { method: "post" });
    setQuery("");
    setActive(0);
  };

  return (
    <div className="req-site-picker">
      <input
        value={query}
        placeholder="Add a site: type a real place, or pick one used elsewhere"
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && options[active]) {
            e.preventDefault();
            add(options[active].name);
          }
        }}
      />
      {(q || matches.length > 0) && options.length > 0 && (
        <ul className="req-suggest" role="listbox">
          {options.map((o, i) => (
            <li
              key={`${o.isNew}-${o.name}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "is-active" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                add(o.name);
              }}
              onMouseEnter={() => setActive(i)}
            >
              {o.isNew ? (
                <>
                  Add <strong>{o.name}</strong> as a new site
                </>
              ) : (
                o.name
              )}
            </li>
          ))}
        </ul>
      )}
      {fetcher.data && !fetcher.data.ok && <span className="req-error">{fetcher.data.error}</span>}
    </div>
  );
}

// Site info opens in a popover (native Popover API); admins edit it in place.
function Site({ site, canEdit }: { site: RequestSite; canEdit: boolean }) {
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
          <span className="req-popover-title">
            {canEdit ? (
              <InlineText intent="update-site" id={site.id} field="name" value={site.name} placeholder="Site name" />
            ) : (
              site.name
            )}
          </span>
          <button type="button" className="req-popover-close" popoverTarget={popoverId} popoverTargetAction="hide" aria-label="Close">
            ×
          </button>
        </div>
        {canEdit ? (
          <dl>
            <dt>Status</dt>
            <dd>
              <InlineSelect
                intent="update-site"
                id={site.id}
                field="status"
                value={site.status}
                options={statusOptions}
                className={`req-status-${site.status}`}
              />
            </dd>
            <dt>Currently doing instead</dt>
            <dd>
              <InlineText intent="update-site" id={site.id} field="instead" value={site.instead} multiline placeholder="What do they do today?" />
            </dd>
            <dt>Pain point</dt>
            <dd>
              <InlineText intent="update-site" id={site.id} field="pain" value={site.pain} multiline placeholder="What hurts?" />
            </dd>
            <dt>How we'd recognize success</dt>
            <dd>
              <InlineText intent="update-site" id={site.id} field="success" value={site.success} multiline placeholder="What would we see if it worked?" />
            </dd>
            <dd className="req-popover-actions">
              <DeleteLink intent="delete-site" id={site.id} label={`the site "${site.name}" from this request`} />
            </dd>
          </dl>
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
function SitesPopover({ r, canEdit, allSites }: { r: InstitutionRequest; canEdit: boolean; allSites: string[] }) {
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
          r.sites.map((s) => <Site key={s.id} site={s} canEdit={canEdit} />)
        ) : (
          <p className="req-empty">No sites yet.</p>
        )}
        {canEdit && <SitePicker requestId={r.id} taken={r.sites.map((s) => s.name)} allSites={allSites} />}
        <div className="req-popover-section">Site hints</div>
        {canEdit ? (
          <InlineText
            intent="update-request"
            id={r.id}
            field="siteHints"
            value={r.siteHints}
            multiline
            className="req-hints-inline"
            placeholder="Who might have demand for this?"
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

// ── Rows ───────────────────────────────────────────────────────────

// The stage tag sits under the description: "Design wanted", "Designed" or
// "Tested", followed by the papers behind it (cases, designs, test reports).
function StageLine({ id, papers }: { id: number; papers: RequestPaper[] }) {
  const stage = requestStage(papers);
  const popoverId = `req-links-${id}`;
  return (
    <div className="req-stage-line">
      <button type="button" className={`req-tag req-stage req-stage-${stage}`} popoverTarget={popoverId}>
        {STAGE_LABEL[stage]}
      </button>
      {PAPER_KINDS.flatMap((kind) =>
        papers
          .filter((p) => p.kind === kind)
          .map((p, i) => (
            <a key={`${kind}-${i}`} className="req-paper" href={p.url} target="_blank" rel="noopener noreferrer">
              <span className="req-paper-kind">{PAPER_KIND_LABEL[kind]}</span>
              {p.title} ↗
            </a>
          ))
      )}
      <div id={popoverId} popover="auto" className="req-popover req-popover-small">
        <div className="req-popover-head">
          <span className="req-popover-title">{STAGE_LABEL[stage]}</span>
          <button type="button" className="req-popover-close" popoverTarget={popoverId} popoverTargetAction="hide" aria-label="Close">
            ×
          </button>
        </div>
        {PAPER_KINDS.map((kind) => {
          const list = papers.filter((p) => p.kind === kind);
          return (
            <div key={kind}>
              <div className="req-popover-section">{PAPER_KIND_PLURAL[kind]}</div>
              {list.length ? (
                <ul className="req-link-list">
                  {list.map((p, i) => (
                    <li key={i}>
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        {p.title} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="req-empty">{PAPER_KIND_EMPTY[kind]}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PAPER_KIND_PLURAL: Record<PaperKind, string> = {
  case: "The case for it",
  project: "Projects designing it",
  design: "Designs",
  test: "Test reports",
};
const PAPER_KIND_EMPTY: Record<PaperKind, string> = {
  case: "No case written up yet.",
  project: "No one is designing it yet that we know of.",
  design: "No designs yet.",
  test: "Not tested yet.",
};

// Links in a row's draft: kind, title and URL for each, plus "Add link".
function PapersEditor({ papers, onChange }: { papers: RequestPaper[]; onChange: (papers: RequestPaper[]) => void }) {
  const update = (i: number, patch: Partial<RequestPaper>) =>
    onChange(papers.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const stage = requestStage(papers);
  return (
    <div className="req-papers-edit">
      <div className="req-stage-line">
        <span className={`req-tag req-stage req-stage-${stage}`}>{STAGE_LABEL[stage]}</span>
        <span className="req-empty">follows from the papers below</span>
      </div>
      {papers.map((p, i) => (
        <div key={i} className="req-paper-edit">
          <select
            className="req-tag req-tag-select"
            value={p.kind}
            onChange={(e) => update(i, { kind: e.target.value as PaperKind })}
            aria-label="Kind of paper"
          >
            {PAPER_KINDS.map((k) => (
              <option key={k} value={k}>
                {PAPER_KIND_LABEL[k]}
              </option>
            ))}
          </select>
          <input value={p.title} placeholder="Title" onChange={(e) => update(i, { title: e.target.value })} aria-label="Paper title" />
          <input value={p.url} placeholder="https://…" onChange={(e) => update(i, { url: e.target.value })} aria-label="Paper link" />
          <button
            type="button"
            className="req-popover-close"
            aria-label="Remove paper"
            onClick={() => onChange(papers.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="req-link-btn" onClick={() => onChange([...papers, { kind: "case", title: "", url: "" }])}>
        + Add link
      </button>
    </div>
  );
}

// A row's edits are a local draft until Save; Cancel throws them away.
interface Draft {
  name: string;
  column: string;
  row: string;
  vision: string;
  description: string;
  papers: RequestPaper[];
}

function RequestRow({
  r,
  visions,
  canEdit,
  editing,
  onEdit,
  allSites,
}: {
  r: InstitutionRequest;
  visions: RequestVision[];
  canEdit: boolean;
  editing: boolean;
  onEdit: (on: boolean) => void;
  allSites: string[];
}) {
  const vision = visions.find((v) => v.id === r.vision);
  const saved: Draft = {
    name: r.name,
    column: r.column,
    row: r.row,
    vision: r.vision ?? "",
    description: r.description,
    papers: r.papers,
  };
  const [draft, setDraft] = useState<Draft>(saved);
  // Start each edit from what's saved.
  useEffect(() => {
    if (editing) setDraft(saved);
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (field: Exclude<keyof Draft, "papers">) => (value: string) => setDraft((d) => ({ ...d, [field]: value }));
  const changed = (Object.keys(saved) as (keyof Draft)[]).filter(
    (k) => JSON.stringify(draft[k]) !== JSON.stringify(saved[k])
  );
  const save = useFetcher<ActionResult>();
  const saving = save.state !== "idle";
  useEffect(() => {
    if (save.state === "idle" && save.data?.ok) onEdit(false);
  }, [save.state, save.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <tr className={editing ? "req-editing" : undefined}>
      <td className="req-name">
        {editing ? (
          <>
            <div className="req-title-line">
              <span className="req-title-edit">
                <InlineText intent="update-request" id={r.id} field="name" value={draft.name} onLocalChange={set("name")} multiline placeholder="Name" className="req-name-text" />
              </span>
              <span className="req-row-tools">
                <button type="button" className="req-btn-ghost req-btn-small" onClick={() => onEdit(false)} disabled={saving}>
                  Cancel
                </button>
                {changed.length > 0 && (
                  <button
                    type="button"
                    className="req-btn req-btn-small"
                    disabled={saving}
                    onClick={() =>
                      save.submit(
                        {
                          intent: "update-request-many",
                          id: String(r.id),
                          value: JSON.stringify(Object.fromEntries(changed.map((k) => [k, draft[k]]))),
                        },
                        { method: "post" }
                      )
                    }
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                )}
                <MoreMenu id={`req-more-${r.id}`}>
                  <DeleteLink intent="delete-request" id={r.id} label={`the request "${r.name}" and its sites`} />
                </MoreMenu>
              </span>
            </div>
            {save.data && !save.data.ok && <div className="req-error">{save.data.error}</div>}
            <div className="req-tag-line">
              <InlineSelect intent="update-request" id={r.id} field="column" value={draft.column} onLocalChange={set("column")} options={COLS} />
              <InlineSelect intent="update-request" id={r.id} field="row" value={draft.row} onLocalChange={set("row")} options={ROWS} />
              <VisionEditor requestId={r.id} value={draft.vision} onChange={set("vision")} visions={visions} />
            </div>
            <p className="req-desc">
              <InlineText
                intent="update-request"
                id={r.id}
                field="description"
                value={draft.description}
                onLocalChange={set("description")}
                multiline
                placeholder="Add two or three sentences on what needs to be built"
              />
            </p>
            <PapersEditor papers={draft.papers} onChange={(papers) => setDraft((d) => ({ ...d, papers }))} />
          </>
        ) : (
          <>
            <div className="req-title-line">
              <Link to={`/cell/${r.row}/${r.column}${r.vision && VISIONS.some((v) => v.id === r.vision) ? `?visions=${r.vision}` : ""}`}>
                {r.name}
              </Link>
              <span className="req-tag">{rowName(r.row)}</span>
              {r.vision && (vision ? <VisionTag vision={vision} /> : <span className="req-tag">{r.vision}</span>)}
              {canEdit && (
                <button type="button" className="req-row-edit" onClick={() => onEdit(true)} aria-label={`Edit ${r.name}`}>
                  Edit
                </button>
              )}
            </div>
            {r.description && <p className="req-desc">{r.description}</p>}
            <StageLine id={r.id} papers={r.papers} />
          </>
        )}
      </td>
      <td className="req-sites">
        <SitesPopover r={r} canEdit={canEdit} allSites={allSites} />
      </td>
    </tr>
  );
}

// ── Admin toolbar ──────────────────────────────────────────────────

function NewRequest({ onCreated }: { onCreated: (id: number) => void }) {
  const fetcher = useFetcher<ActionResult>();
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.createdId) onCreated(fetcher.data.createdId);
  }, [fetcher.state, fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <button
      type="button"
      className="req-btn-ghost"
      disabled={fetcher.state !== "idle"}
      onClick={() =>
        fetcher.submit({ intent: "create-request", row: ROWS[0].id, column: COLS[0].id }, { method: "post" })
      }
    >
      New request
    </button>
  );
}

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
        className="req-link-btn req-danger"
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

const NEW_VISION = "__new__";

// The row's vision tag in edit mode: pick a vision, create one ("New vision…"),
// or rename it and set its link from the small popover beside the tag.
function VisionEditor({
  requestId,
  value,
  onChange,
  visions,
}: {
  requestId: number;
  value: string;
  onChange: (value: string) => void;
  visions: RequestVision[];
}) {
  const create = useFetcher<ActionResult>();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const shown = value;
  const current = visions.find((v) => v.id === shown);
  // A new vision tag is created right away (tags are shared); choosing it for
  // this row is part of the row's draft.
  useEffect(() => {
    if (create.state === "idle" && create.data?.createdVisionId) onChange(create.data.createdVisionId);
  }, [create.state, create.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const popoverId = `req-vision-edit-${requestId}`;

  const submitNew = () => {
    if (!label.trim()) return;
    create.submit({ intent: "create-vision", label, url }, { method: "post" });
    setAdding(false);
    setLabel("");
    setUrl("");
  };

  if (adding) {
    return (
      <span className="req-vision-new">
        <input
          autoFocus
          value={label}
          placeholder="Vision name"
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitNew();
            if (e.key === "Escape") setAdding(false);
          }}
        />
        <input
          value={url}
          placeholder="Link (optional)"
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitNew();
            if (e.key === "Escape") setAdding(false);
          }}
        />
        <button type="button" className="req-link-btn" onClick={submitNew} disabled={!label.trim()}>
          Add
        </button>
        <button type="button" className="req-link-btn" onClick={() => setAdding(false)}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <span className="req-vision-editor">
      <select
        className="req-tag req-tag-select req-vision"
        style={current ? { color: visionColor(current.id) } : undefined}
        value={shown}
        onChange={(e) => {
          if (e.target.value === NEW_VISION) setAdding(true);
          else onChange(e.target.value);
        }}
      >
        <option value="">No vision</option>
        {visions.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
          </option>
        ))}
        <option value={NEW_VISION}>New vision…</option>
      </select>
      {current && (
        <>
          <button type="button" className="req-link-btn" popoverTarget={popoverId} aria-label={`Edit the ${current.label} vision`}>
            edit vision
          </button>
          <div id={popoverId} popover="auto" className="req-popover req-popover-small">
            <div className="req-popover-head">
              <span className="req-popover-title">Vision tag</span>
              <button type="button" className="req-popover-close" popoverTarget={popoverId} popoverTargetAction="hide" aria-label="Close">
                ×
              </button>
            </div>
            <p className="req-empty">Changes apply to every request with this tag.</p>
            <VisionRow vision={current} />
          </div>
        </>
      )}
      {create.data && !create.data.ok ? (
        <span className="req-error">{create.data.error}</span>
      ) : null}
    </span>
  );
}

// ── Search ─────────────────────────────────────────────────────────

type PillKind = "column" | "row" | "vision" | "stage" | "status" | "site" | "text";
interface Pill {
  kind: PillKind;
  value: string;
  label: string;
}
const KIND_LABEL: Record<PillKind, string> = {
  column: "Column",
  row: "Row",
  vision: "Vision",
  stage: "Stage",
  status: "Site status",
  site: "Site",
  text: "Text",
};

function textOf(r: InstitutionRequest, visions: RequestVision[]) {
  return [
    visions.find((v) => v.id === r.vision)?.label ?? r.vision ?? "",
    colName(r.column),
    rowName(r.row),
    r.name,
    r.description,
    r.siteHints,
    STAGE_LABEL[requestStage(r.papers)],
    ...r.papers.map((p) => p.title),
    ...r.sites.flatMap((s) => [s.name, s.instead, s.pain, s.success, s.status]),
  ]
    .join(" ")
    .toLowerCase();
}

// Pills of different kinds narrow the list (AND); pills of the same kind
// widen it (OR). Text pills, and whatever is being typed, must each appear.
function matches(r: InstitutionRequest, pills: Pill[], typed: string, visions: RequestVision[]) {
  const byKind = new Map<PillKind, string[]>();
  for (const p of pills) byKind.set(p.kind, [...(byKind.get(p.kind) ?? []), p.value]);
  const test: Record<Exclude<PillKind, "text">, (v: string) => boolean> = {
    column: (v) => r.column === v,
    row: (v) => r.row === v,
    vision: (v) => r.vision === v,
    stage: (v) => requestStage(r.papers) === v,
    status: (v) => r.sites.some((s) => s.status === v),
    site: (v) => r.sites.some((s) => s.name.toLowerCase() === v),
  };
  for (const [kind, values] of byKind) {
    if (kind === "text") continue;
    if (!values.some(test[kind])) return false;
  }
  const words = [...(byKind.get("text") ?? []), ...typed.toLowerCase().split(/\s+/)].filter(Boolean);
  if (!words.length) return true;
  const hay = textOf(r, visions);
  return words.every((w) => hay.includes(w));
}

function SearchBar({
  pills,
  setPills,
  typed,
  setTyped,
  suggestions,
}: {
  pills: Pill[];
  setPills: (p: Pill[]) => void;
  typed: string;
  setTyped: (s: string) => void;
  suggestions: Pill[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const q = typed.trim().toLowerCase();
  const chosen = new Set(pills.map((p) => `${p.kind}:${p.value}`));
  const options = q
    ? [
        ...suggestions
          .filter((s) => !chosen.has(`${s.kind}:${s.value}`) && s.label.toLowerCase().includes(q))
          .slice(0, 8),
        { kind: "text" as const, value: q, label: typed.trim() },
      ]
    : [];

  const choose = (p: Pill) => {
    setPills([...pills, p]);
    setTyped("");
    setActive(0);
    inputRef.current?.focus();
  };

  return (
    <div className="req-search" onClick={() => inputRef.current?.focus()}>
      {pills.map((p, i) => (
        <span key={`${p.kind}:${p.value}`} className={`req-pill req-pill-${p.kind}`}>
          <span className="req-pill-kind">{KIND_LABEL[p.kind]}</span>
          {p.label}
          <button
            type="button"
            aria-label={`Remove ${p.label}`}
            onClick={(e) => {
              e.stopPropagation();
              setPills(pills.filter((_, j) => j !== i));
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={typed}
        placeholder={pills.length ? "" : "Search by column, row, vision, site, status or any text"}
        aria-label="Search requests"
        onChange={(e) => {
          setTyped(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, options.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && options[active]) {
            e.preventDefault();
            choose(options[active]);
          } else if (e.key === "Backspace" && !typed && pills.length) {
            setPills(pills.slice(0, -1));
          } else if (e.key === "Escape") {
            setTyped("");
          }
        }}
      />
      {open && options.length > 0 && (
        <ul className="req-suggest" role="listbox">
          {options.map((o, i) => (
            <li
              key={`${o.kind}:${o.value}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "is-active" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(o);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="req-pill-kind">{o.kind === "text" ? "Contains" : KIND_LABEL[o.kind]}</span>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────

export default function Requests({ loaderData: { requests, visions, canEdit } }: Route.ComponentProps) {
  const [pills, setPills] = useState<Pill[]>([]);
  const [typed, setTyped] = useState("");
  const [editingIds, setEditingIds] = useState<Set<number>>(new Set());
  const setEditing = (id: number, on: boolean) =>
    setEditingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const allSites = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of requests) for (const s of r.sites) if (!seen.has(s.name.toLowerCase())) seen.set(s.name.toLowerCase(), s.name);
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [requests]);

  const suggestions = useMemo<Pill[]>(
    () => [
      ...COLS.map((c) => ({ kind: "column" as const, value: c.id, label: c.name })),
      ...ROWS.map((r) => ({ kind: "row" as const, value: r.id, label: r.name })),
      ...visions.map((v) => ({ kind: "vision" as const, value: v.id, label: v.label })),
      ...STAGES.map((st) => ({ kind: "stage" as const, value: st, label: STAGE_LABEL[st] })),
      ...REQUEST_STATUSES.map((s) => ({ kind: "status" as const, value: s, label: s })),
      ...allSites.map((s) => ({ kind: "site" as const, value: s.toLowerCase(), label: s })),
    ],
    [visions, allSites]
  );

  const shown = requests.filter((r) => editingIds.has(r.id) || matches(r, pills, typed, visions));

  return (
    <div className="req-page">
      <Link to="/" className="detail-back">
        ← Back to grid
      </Link>
      <h1 className="req-title">Requests for institutions</h1>
      <p className="req-lede">Institutions we'd like designed and where they could be adopted.</p>

      <div className="req-filters">
        <SearchBar pills={pills} setPills={setPills} typed={typed} setTyped={setTyped} suggestions={suggestions} />
        <span className="req-count">
          {shown.length} of {requests.length} requests
        </span>
        {canEdit && (
          <span className="req-edit-controls">
            <NewRequest onCreated={(id) => setEditing(id, true)} />
          </span>
        )}
      </div>

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
                  <RequestRow
                    key={r.id}
                    r={r}
                    visions={visions}
                    canEdit={canEdit}
                    editing={editingIds.has(r.id)}
                    onEdit={(on) => setEditing(r.id, on)}
                    allSites={allSites}
                  />
                ))}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
