import React, { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useFetcher, useRouteLoaderData, useSearchParams } from "react-router";
import { RequestSankey } from "../components/RequestSankey";
import { StageMark } from "../components/StageMark";
import type { Route } from "./+types/requests";
import { getSignedInResearcher, requireAdminSession } from "../lib/auth.server";
import {
  createRequest,
  createSite,
  deleteRequest,
  deleteSite,
  getRequests,
  getLenses,
  createLens,
  updateLensField,
  deleteLens,
  updateRequestField,
  updateRequestFields,
  updateSiteField,
} from "../lib/requests.server";
import {
  LINK_KINDS,
  LINK_KIND_LABEL,
  REQUEST_STATUSES,
  STATUS_LABEL,
  PRIORITY_HELP,
  SCORE_HELP,
  SCORE_KEYS,
  SCORE_LABEL,
  STAGES,
  STAGE_LABEL,
  linkSources,
  priority,
  requestStage,
  type InstitutionRequest,
  type LinkKind,
  type Stage,
  type RequestLens,
  type RequestLink,
  type RequestScores,
  type RequestSite,
  type ScoreKey,
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

type ActionResult = { ok: boolean; error?: string; createdId?: number; createdLensId?: string };

const rowOrder = ROWS.map((r) => r.id);
const colOrder = COLS.map((c) => c.id);
const firstRowIndex = (r: InstitutionRequest) => Math.min(...r.rows.map((x) => rowOrder.indexOf(x)));

export async function loader({ request }: Route.LoaderArgs) {
  const [session, requests, lenses] = await Promise.all([
    getSignedInResearcher(request),
    getRequests(),
    getLenses(),
  ]);
  requests.sort((a, b) => firstRowIndex(a) - firstRowIndex(b) || a.name.localeCompare(b.name));
  return { requests, lenses, canEdit: !!session?.isAdmin };
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
    if (intent === "create-lens") {
      const createdLensId = await createLens(String(fd.get("label") || ""), String(fd.get("url") || ""));
      return { ok: true, createdLensId };
    } else if (intent === "update-lens") {
      await updateLensField(String(fd.get("lensId") || ""), field, value);
    } else if (intent === "delete-lens") {
      await deleteLens(String(fd.get("lensId") || ""));
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
  const title = `Institution tracker — ${SITE_NAME}`;
  const desc =
    "Requests for new institution designs: what each is for, where on the grid it sits, and the places that could adopt it.";
  return [
    { title },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/tracker/` },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    ...OG_IMAGE_META,
  ];
}

// The AGI grid cells a request sits in (each of its scales × each of its
// columns that exists on the grid), home cell first, with the cell's title.
interface RequestCell {
  href: string;
  title: string;
}
function useRequestCells(r: InstitutionRequest): RequestCell[] {
  const root = useRouteLoaderData("root") as { cellTitles?: { agi?: Record<string, string> } } | undefined;
  const titles = root?.cellTitles?.agi ?? {};
  const lens = r.lenses.find((l) => VISIONS.some((v) => v.id === l));
  return r.rows.flatMap((row) =>
    r.cols.flatMap((col) => {
      const title = titles[`${row}-${col}`];
      return title ? [{ href: `/cell/${row}/${col}${lens ? `?visions=${lens}` : ""}`, title }] : [];
    })
  );
}

// A tag that filters the list when clicked (adds a search pill).
function FilterTag({
  pill,
  onFilter,
  className = "",
  style,
}: {
  pill: Pill;
  onFilter: (p: Pill) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`req-tag req-tag-btn ${className}`}
      style={style}
      title={`Show only ${pill.label}`}
      onClick={() => onFilter(pill)}
    >
      {pill.label}
    </button>
  );
}

function LensTag({ lens, onFilter }: { lens: RequestLens; onFilter: (p: Pill) => void }) {
  return (
    <span className="req-lens-wrap">
      <FilterTag
        pill={{ kind: "lens", value: lens.id, label: lens.label }}
        onFilter={onFilter}
        className="req-vision"
      />
      {lens.url && (
        <a className="req-lens-link" href={lens.url} target="_blank" rel="noopener noreferrer" title={`Read about ${lens.label}`}>
          ↗
        </a>
      )}
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

function DeleteLink({ intent, id, label, text = "Delete" }: { intent: string; id: number; label: string; text?: string }) {
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
      {text}
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

const statusOptions = REQUEST_STATUSES.map((s) => ({ id: s, name: STATUS_LABEL[s] }));

// ── Sites ──────────────────────────────────────────────────────────

// Type a place: pick a site already used on another request, or add a new one.
function SitePicker({ requestId, taken, allSites }: { requestId: number; taken: string[]; allSites: string[] }) {
  const fetcher = useFetcher<ActionResult>();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
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
        placeholder="Add a pilot site: a real place that could adopt this"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
      {focused && options.length > 0 && (
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

// One site, shown inline in the request's modal; admins edit it in place.
const SITE_FIELDS = [
  { field: "instead", label: "Doing instead today", placeholder: "What do they do today?" },
  { field: "pain", label: "Pain point", placeholder: "What hurts?" },
  { field: "success", label: "What success looks like", placeholder: "What would we see if it worked?" },
] as const;

function SiteCard({ site, canEdit }: { site: RequestSite; canEdit: boolean }) {
  const fields = SITE_FIELDS.filter((f) => canEdit || site[f.field]);
  return (
    <div className="req-site-card">
      <div className="req-site-card-head">
        <span className="req-site-name">
          {canEdit ? <InlineText intent="update-site" id={site.id} field="name" value={site.name} placeholder="Site name" /> : site.name}
        </span>
        {canEdit ? (
          <InlineSelect
            intent="update-site"
            id={site.id}
            field="status"
            value={site.status}
            options={statusOptions}
            className={`req-status-${site.status}`}
          />
        ) : (
          <span className={`req-status req-status-${site.status}`}>{STATUS_LABEL[site.status]}</span>
        )}
      </div>
      {fields.length > 0 && (
        <dl>
          {fields.map((f) => (
            <div key={f.field} className="req-site-field">
              <dt>{f.label}</dt>
              <dd>
                {canEdit ? (
                  <InlineText intent="update-site" id={site.id} field={f.field} value={site[f.field]} multiline placeholder={f.placeholder} />
                ) : (
                  site[f.field]
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {canEdit && (
        <div className="req-site-card-foot">
          <DeleteLink intent="delete-site" id={site.id} label={`the site "${site.name}" from this request`} text="Remove pilot site" />
        </div>
      )}
    </div>
  );
}

// Kinds of organizations that might want this, hidden behind a discreet link.
function SiteHints({ hints, r, canEdit }: { hints: string[]; r: InstitutionRequest; canEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  if (!open) {
    return (
      <button type="button" className="req-more-sites" onClick={() => setOpen(true)}>
        Looking for more pilot sites?
      </button>
    );
  }
  return (
    <div className="req-hints-box">
      <h3 className="req-modal-heading">Who else might want this</h3>
      {hints.length > 0 && (
        <ul className="req-hint-list">
          {hints.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
      {canEdit && !editing && (
        <button type="button" className="req-more-sites" onClick={() => setEditing(true)}>
          Edit this list
        </button>
      )}
      {canEdit && editing && (
        <div className="req-hints-edit">
          <InlineText
            intent="update-request"
            id={r.id}
            field="siteHints"
            value={r.siteHints}
            multiline
            className="req-hints-inline"
            placeholder="Add kinds of organizations, one per line"
          />
        </div>
      )}
    </div>
  );
}

// The row's sites: the first site's name (and how many more), or "None yet".
// Opens the request's modal.
function SitesButton({ r, uid }: { r: InstitutionRequest; uid: string }) {
  const n = r.sites.length;
  const label = n ? `${r.sites[0].name}${n > 1 ? ` +${n - 1} more` : ""}` : "None yet";
  return (
    <button type="button" className={`req-sites-btn${n ? "" : " is-empty"}`} popoverTarget={`req-detail-${uid}`}>
      {label}
    </button>
  );
}

// ── Rows ───────────────────────────────────────────────────────────

// The one modal a request opens (from its title, links summary or sites
// count): stage, description, links, and the sites with their details, plus
// the site picker and site hints for admins.
function RequestModal({
  r,
  uid,
  canEdit,
  allSites,
}: {
  r: InstitutionRequest;
  uid: string;
  canEdit: boolean;
  allSites: string[];
}) {
  const id = `req-detail-${uid}`;
  const stage = requestStage(r.links, r.sites);
  const cells = useRequestCells(r);
  const hints = r.siteHints.split(/\n+/).filter((line) => line.trim());
  const links = LINK_KINDS.flatMap((k) => r.links.filter((l) => l.kind === k));
  return (
    <div id={id} popover="auto" className="req-popover req-modal">
      <button type="button" className="req-popover-close req-modal-close" popoverTarget={id} popoverTargetAction="hide" aria-label="Close">
        ×
      </button>
      <h2 className="req-modal-title">{r.name}</h2>
      <div className="req-modal-meta">
        <StageMark stage={stage} />
      </div>
      {r.description && <p className="req-modal-desc">{r.description}</p>}

      {links.length > 0 && (
        <section className="req-modal-section">
          <h3 className="req-modal-heading">Links</h3>
          <ul className="req-modal-links">
            {links.map((l, i) => (
              <li key={i}>
                <span className="req-modal-link-kind">{LINK_KIND_LABEL[l.kind]}</span>
                <a href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.title} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {cells.length > 0 && (
        <section className="req-modal-section">
          <h3 className="req-modal-heading">
            Relevant for <span className="req-modal-heading-note">{cells.length} grid {cells.length === 1 ? "cell" : "cells"}</span>
          </h3>
          <ul className="req-modal-cells">
            {cells.map((c) => (
              <li key={c.href}>
                <Link to={c.href}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="req-modal-section">
        <h3 className="req-modal-heading">
          Pilot sites <span className="req-modal-heading-note">real places that could adopt it</span>
        </h3>
        {r.sites.length ? (
          r.sites.map((s) => <SiteCard key={s.id} site={s} canEdit={canEdit} />)
        ) : (
          <p className="req-empty">None yet.</p>
        )}
        {canEdit && <SitePicker requestId={r.id} taken={r.sites.map((s) => s.name)} allSites={allSites} />}
        {(hints.length > 0 || canEdit) && <SiteHints hints={hints} r={r} canEdit={canEdit} />}
      </section>
    </div>
  );
}

// Links in a row's draft: kind, title and URL for each, plus "Add link".
function LinksEditor({
  links,
  sites,
  onChange,
}: {
  links: RequestLink[];
  sites: RequestSite[];
  onChange: (links: RequestLink[]) => void;
}) {
  const update = (i: number, patch: Partial<RequestLink>) =>
    onChange(links.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const stage = requestStage(links, sites);
  return (
    <div className="req-links-edit">
      <div className="req-stage-line">
        <StageMark stage={stage} />
        <span className="req-empty">follows from the links below and the sites</span>
      </div>
      {links.map((p, i) => (
        <div key={i} className="req-link-edit">
          <select
            className="req-tag req-tag-select"
            value={p.kind}
            onChange={(e) => update(i, { kind: e.target.value as LinkKind })}
            aria-label="Kind of link"
          >
            {LINK_KINDS.map((k) => (
              <option key={k} value={k}>
                {LINK_KIND_LABEL[k]}
              </option>
            ))}
          </select>
          <input value={p.title} placeholder="Title" onChange={(e) => update(i, { title: e.target.value })} aria-label="Link title" />
          <input value={p.url} placeholder="https://…" onChange={(e) => update(i, { url: e.target.value })} aria-label="Link URL" />
          <button
            type="button"
            className="req-popover-close"
            aria-label="Remove link"
            onClick={() => onChange(links.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="req-link-btn" onClick={() => onChange([...links, { kind: "case", title: "", url: "" }])}>
        + Add link
      </button>
    </div>
  );
}

// A row's edits are a local draft until Save; Cancel throws them away.
interface Draft {
  name: string;
  description: string;
  rows: string[];
  cols: string[];
  lenses: string[];
  scores: RequestScores;
  links: RequestLink[];
}

// Several values from a fixed list, as tags with × and a "+" select to add.
function MultiTags({
  values,
  options,
  onChange,
  addLabel,
  min = 0,
}: {
  values: string[];
  options: readonly { id: string; name: string }[];
  onChange: (values: string[]) => void;
  addLabel: string;
  min?: number;
}) {
  const rest = options.filter((o) => !values.includes(o.id));
  return (
    <span className="req-multi">
      {values.map((v, i) => (
        <span key={v} className="req-tag req-tag-chip">
          {options.find((o) => o.id === v)?.name ?? v}
          {i === 0 && values.length > 1 && <span className="req-home" title="Home cell (used for the cell link)">home</span>}
          {values.length > min && (
            <button type="button" aria-label="Remove" onClick={() => onChange(values.filter((x) => x !== v))}>
              ×
            </button>
          )}
        </span>
      ))}
      {rest.length > 0 && (
        <select
          className="req-tag req-tag-select req-tag-add"
          value=""
          onChange={(e) => e.target.value && onChange([...values, e.target.value])}
          aria-label={addLabel}
        >
          <option value="">+ {addLabel}</option>
          {rest.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      )}
    </span>
  );
}

const NEW_LENS = "__new__";

// The row's lenses in edit mode: add or remove lenses, create one ("New lens…"),
// and rename or relink a lens from the small popover on its tag.
function LensesEditor({
  uid,
  values,
  onChange,
  lenses,
}: {
  uid: string;
  values: string[];
  onChange: (values: string[]) => void;
  lenses: RequestLens[];
}) {
  const create = useFetcher<ActionResult>();
  const [adding, setAdding] = useState(false);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  // A new lens is created right away (lenses are shared); adding it to this
  // row is part of the row's draft.
  useEffect(() => {
    if (create.state === "idle" && create.data?.createdLensId && !values.includes(create.data.createdLensId))
      onChange([...values, create.data.createdLensId]);
  }, [create.state, create.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const submitNew = () => {
    if (!label.trim()) return;
    create.submit({ intent: "create-lens", label, url }, { method: "post" });
    setAdding(false);
    setLabel("");
    setUrl("");
  };
  const rest = lenses.filter((l) => !values.includes(l.id));

  return (
    <span className="req-multi">
      {values.map((id) => {
        const lens = lenses.find((l) => l.id === id);
        const popoverId = `req-lens-edit-${uid}-${id}`;
        return (
          <span key={id} className="req-tag req-tag-chip req-vision">
            {lens ? (
              <button type="button" className="req-chip-label" popoverTarget={popoverId} title="Edit this lens">
                {lens.label}
              </button>
            ) : (
              id
            )}
            <button type="button" aria-label="Remove lens" onClick={() => onChange(values.filter((x) => x !== id))}>
              ×
            </button>
            {lens && (
              <div id={popoverId} popover="auto" className="req-popover req-popover-small">
                <div className="req-popover-head">
                  <span className="req-popover-title">Lens</span>
                  <button type="button" className="req-popover-close" popoverTarget={popoverId} popoverTargetAction="hide" aria-label="Close">
                    ×
                  </button>
                </div>
                <p className="req-empty">Changes apply to every request with this lens.</p>
                <LensRow lens={lens} />
              </div>
            )}
          </span>
        );
      })}
      {adding ? (
        <span className="req-vision-new">
          <input
            autoFocus
            value={label}
            placeholder="Lens name"
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
      ) : (
        <select
          className="req-tag req-tag-select req-tag-add"
          value=""
          aria-label="Add a lens"
          onChange={(e) => {
            if (e.target.value === NEW_LENS) setAdding(true);
            else if (e.target.value) onChange([...values, e.target.value]);
          }}
        >
          <option value="">+ lens</option>
          {rest.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
          <option value={NEW_LENS}>New lens…</option>
        </select>
      )}
      {create.data && !create.data.ok ? <span className="req-error">{create.data.error}</span> : null}
    </span>
  );
}

function LensRow({ lens }: { lens: RequestLens }) {
  const fetcher = useFetcher<ActionResult>();
  const save = (field: string, value: string, current: string) => {
    if (value !== current) fetcher.submit({ intent: "update-lens", lensId: lens.id, field, value }, { method: "post" });
  };
  const error = fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
  return (
    <div className="req-vision-row">
      <input defaultValue={lens.label} onBlur={(e) => save("label", e.target.value, lens.label)} aria-label="Lens name" />
      <input defaultValue={lens.url} placeholder="https://…" onBlur={(e) => save("url", e.target.value, lens.url)} aria-label="Lens link" />
      <button
        type="button"
        className="req-link-btn req-danger"
        onClick={() => {
          if (confirm(`Delete the lens "${lens.label}"? It is removed from every request.`))
            fetcher.submit({ intent: "delete-lens", lensId: lens.id }, { method: "post" });
        }}
      >
        Delete
      </button>
      {error && <span className="req-error">{error}</span>}
    </div>
  );
}

const scoreOptions = [1, 2, 3, 4, 5];

// The three ranking scores, as small 1–5 selects in edit mode.
function ScoresEditor({ scores, onChange }: { scores: RequestScores; onChange: (s: RequestScores) => void }) {
  const p = priority(scores);
  return (
    <div className="req-scores req-scores-edit">
      {SCORE_KEYS.map((k) => (
        <label key={k} title={SCORE_HELP[k]}>
          {SCORE_LABEL[k]}
          <select
            className="req-tag req-tag-select"
            value={scores[k] ?? ""}
            onChange={(e) => onChange({ ...scores, [k]: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">–</option>
            {scoreOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      ))}
      <span className="req-priority" title={PRIORITY_HELP}>
        Importance {p ?? "–"}
      </span>
    </div>
  );
}

// The description, ending in small logos for where its links come from
// (Pax Machina, arXiv, …); they open the request like its title does.
function Description({ text, links, uid }: { text: string; links: RequestLink[]; uid: string }) {
  const sources = linkSources(links);
  if (!text && !sources.length) return null;
  return (
    <p className="req-desc">
      {text}
      {sources.length > 0 && (
        <button type="button" className="req-desc-sources" popoverTarget={`req-detail-${uid}`} aria-label={`Links from ${sources.map((s) => s.label).join(", ")}`}>
          {sources.map((src) => (
            <img key={src.id} className={`req-source-logo${src.mono ? " is-mono" : ""}${src.plate ? " is-plate" : ""}`} src={src.logo} alt="" title={src.label} width={14} height={14} />
          ))}
        </button>
      )}
    </p>
  );
}

// Scores are mostly shown by the sort order and the Review scores table; a
// row names only the ones that stand out: neglected, urgent, or high leverage.
function Standouts({ scores }: { scores: RequestScores }) {
  const notes = [
    scores.neglect === 5 && { text: "Neglected", help: SCORE_HELP.neglect },
    scores.urgency === 5 && { text: "Urgent", help: SCORE_HELP.urgency },
    scores.leverage === 5 && { text: "High leverage", help: SCORE_HELP.leverage },
  ].filter((n): n is { text: string; help: string } => !!n);
  if (!notes.length) return null;
  return (
    <div className="req-standouts">
      {notes.map((n) => (
        <span key={n.text} title={n.help}>
          {n.text}
        </span>
      ))}
    </div>
  );
}

const colOptions = COLS.map((c) => ({ id: c.id, name: c.name }));
const rowOptions = ROWS.map((r) => ({ id: r.id, name: r.name }));

function RequestRow({
  uid,
  groupCol,
  r,
  lenses,
  canEdit,
  editing,
  onEdit,
  onFilter,
  allSites,
}: {
  uid: string;
  /** The column group this row is shown under, if the list is grouped. */
  groupCol?: string;
  r: InstitutionRequest;
  lenses: RequestLens[];
  canEdit: boolean;
  editing: boolean;
  onEdit: (on: boolean) => void;
  onFilter: (p: Pill) => void;
  allSites: string[];
}) {
  const saved: Draft = {
    name: r.name,
    description: r.description,
    rows: r.rows,
    cols: r.cols,
    lenses: r.lenses,
    scores: r.scores,
    links: r.links,
  };
  const [draft, setDraft] = useState<Draft>(saved);
  // Start each edit from what's saved.
  useEffect(() => {
    if (editing) setDraft(saved);
  }, [editing]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = <K extends keyof Draft>(field: K) => (value: Draft[K]) => setDraft((d) => ({ ...d, [field]: value }));
  const changed = (Object.keys(saved) as (keyof Draft)[]).filter(
    (k) => JSON.stringify(draft[k]) !== JSON.stringify(saved[k])
  );
  const save = useFetcher<ActionResult>();
  const saving = save.state !== "idle";
  useEffect(() => {
    if (save.state === "idle" && save.data?.ok) onEdit(false);
  }, [save.state, save.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const stage = requestStage(editing ? draft.links : r.links, r.sites);
  const cells = useRequestCells(r);

  return (
    <tr className={`req-row${editing ? " req-editing" : ""}`}>
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
                <MoreMenu id={`req-more-${uid}`}>
                  <DeleteLink intent="delete-request" id={r.id} label={`the request "${r.name}" and its sites`} />
                </MoreMenu>
              </span>
            </div>
            {save.data && !save.data.ok && <div className="req-error">{save.data.error}</div>}
            <div className="req-tag-line">
              <span className="req-tag-label">Columns</span>
              <MultiTags values={draft.cols} options={colOptions} onChange={set("cols")} addLabel="column" min={1} />
            </div>
            <div className="req-tag-line">
              <span className="req-tag-label">Scales</span>
              <MultiTags values={draft.rows} options={rowOptions} onChange={set("rows")} addLabel="scale" min={1} />
            </div>
            <div className="req-tag-line">
              <span className="req-tag-label">Lenses</span>
              <LensesEditor uid={uid} values={draft.lenses} onChange={set("lenses")} lenses={lenses} />
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
            <LinksEditor links={draft.links} sites={r.sites} onChange={set("links")} />
            <ScoresEditor scores={draft.scores} onChange={set("scores")} />
          </>
        ) : (
          <>
            <div className="req-title-line">
              <button type="button" className="req-title-btn" popoverTarget={`req-detail-${uid}`}>
                {r.name}
              </button>
              {canEdit && (
                <button type="button" className="req-row-edit" onClick={() => onEdit(true)} aria-label={`Edit ${r.name}`}>
                  Edit
                </button>
              )}
            </div>
            {r.lenses.length > 0 && (
              <div className="req-tags">
                {r.lenses.map((id) => {
                  const lens = lenses.find((l) => l.id === id);
                  return lens ? <LensTag key={id} lens={lens} onFilter={onFilter} /> : null;
                })}
              </div>
            )}
            <Description text={r.description} links={r.links} uid={uid} />
            <Standouts scores={r.scores} />
          </>
        )}
      </td>
      <td className="req-sites">
        <dl className="req-side">
          <dt>Stage</dt>
          <dd>
            <StageMark
              stage={stage}
              title={`Show only ${STAGE_LABEL[stage]}`}
              onClick={() => onFilter({ kind: "stage", value: stage, label: STAGE_LABEL[stage] })}
            />
          </dd>
          {cells.length > 0 && (
            <>
              <dt>Relevant for</dt>
              <dd>
                <button type="button" className="req-sites-btn" popoverTarget={`req-detail-${uid}`}>
                  {cells.length} grid {cells.length === 1 ? "cell" : "cells"}
                </button>
                <span className="req-side-note">
                  <Link to={cells[0].href}>{cells[0].title}</Link>
                  {cells.length > 1 && ` and ${cells.length - 1} ${cells.length === 2 ? "other" : "others"}`}
                </span>
              </dd>
            </>
          )}
          <dt className="req-side-sites">Pilot sites</dt>
          <dd className="req-side-sites">
            <SitesButton r={r} uid={uid} />
          </dd>
        </dl>
        <RequestModal r={r} uid={uid} canEdit={canEdit} allSites={allSites} />
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
      + New request
    </button>
  );
}

// ── Search ─────────────────────────────────────────────────────────

type PillKind = "column" | "row" | "lens" | "stage" | "status" | "site" | "text";
interface Pill {
  kind: PillKind;
  value: string;
  label: string;
}
const KIND_LABEL: Record<PillKind, string> = {
  column: "Column",
  row: "Scale",
  lens: "Lens",
  stage: "Stage",
  status: "Site status",
  site: "Site",
  text: "Text",
};

function textOf(r: InstitutionRequest, lenses: RequestLens[]) {
  return [
    ...r.lenses.map((id) => lenses.find((l) => l.id === id)?.label ?? id),
    ...r.cols.map(colName),
    ...r.rows.map(rowName),
    r.name,
    r.description,
    r.siteHints,
    STAGE_LABEL[requestStage(r.links, r.sites)],
    ...r.links.map((p) => p.title),
    ...r.sites.flatMap((s) => [s.name, s.instead, s.pain, s.success, STATUS_LABEL[s.status]]),
  ]
    .join(" ")
    .toLowerCase();
}

// Pills of different kinds narrow the list (AND); pills of the same kind
// widen it (OR). Text pills, and whatever is being typed, must each appear.
function matches(r: InstitutionRequest, pills: Pill[], typed: string, lenses: RequestLens[]) {
  const byKind = new Map<PillKind, string[]>();
  for (const p of pills) byKind.set(p.kind, [...(byKind.get(p.kind) ?? []), p.value]);
  const test: Record<Exclude<PillKind, "text">, (v: string) => boolean> = {
    column: (v) => r.cols.includes(v),
    row: (v) => r.rows.includes(v),
    lens: (v) => r.lenses.includes(v),
    stage: (v) => requestStage(r.links, r.sites) === v,
    status: (v) => r.sites.some((s) => s.status === v),
    site: (v) => r.sites.some((s) => s.name.toLowerCase() === v),
  };
  for (const [kind, values] of byKind) {
    if (kind === "text") continue;
    if (!values.some(test[kind])) return false;
  }
  const words = [...(byKind.get("text") ?? []), ...typed.toLowerCase().split(/\s+/)].filter(Boolean);
  if (!words.length) return true;
  const hay = textOf(r, lenses);
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
        placeholder={pills.length ? "" : "Search by column, scale, lens, stage, site or any text"}
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

// ── Score review (admins) ──────────────────────────────────────────

// Five dots for a 1–5 score; clicking the current value clears it.
function ScoreDots({ value, label, onChange }: { value: number | null; label: string; onChange: (v: number | null) => void }) {
  return (
    <span className="req-dots" role="radiogroup" aria-label={label}>
      {scoreOptions.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${label} ${n}`}
          title={value === n ? "Click again to clear" : String(n)}
          className={`req-dot${value != null && n <= value ? " is-on" : ""}`}
          onClick={() => onChange(value === n ? null : n)}
        />
      ))}
      <span className="req-dots-num">{value ?? "–"}</span>
    </span>
  );
}

function ScoreReviewRow({ r }: { r: InstitutionRequest }) {
  const fetcher = useFetcher<ActionResult>();
  const [scores, setScores] = useState(r.scores);
  useEffect(() => setScores(r.scores), [r.scores]);
  const change = (k: ScoreKey) => (v: number | null) => {
    const next = { ...scores, [k]: v };
    setScores(next);
    fetcher.submit({ intent: "update-request-many", id: String(r.id), value: JSON.stringify({ scores: next }) }, { method: "post" });
  };
  const p = priority(scores);
  const stage = requestStage(r.links, r.sites);
  return (
    <tr>
      <th scope="row">
        {r.name}
        {fetcher.data && !fetcher.data.ok && <span className="req-error"> {fetcher.data.error}</span>}
      </th>
      <td className="req-review-stage">
        <StageMark stage={stage} />
      </td>
      {SCORE_KEYS.map((k) => (
        <td key={k}>
          <ScoreDots value={scores[k]} label={SCORE_LABEL[k]} onChange={change(k)} />
        </td>
      ))}
      <td className="req-review-imp">{p ?? "–"}</td>
    </tr>
  );
}

type ReviewKey = "name" | "stage" | ScoreKey | "importance";
type ReviewSort = { key: ReviewKey; desc: boolean };

function reviewValue(r: InstitutionRequest, key: ReviewKey): number | string | null {
  if (key === "name") return r.name;
  if (key === "stage") return STAGES.indexOf(requestStage(r.links, r.sites));
  if (key === "importance") return priority(r.scores);
  return r.scores[key];
}

// Unscored rows go last whichever way a column is sorted; ties go by name.
function reviewOrder(list: InstitutionRequest[], { key, desc }: ReviewSort): number[] {
  return [...list]
    .sort((a, b) => {
      const va = reviewValue(a, key);
      const vb = reviewValue(b, key);
      if (va == null || vb == null) return va == null && vb == null ? a.name.localeCompare(b.name) : va == null ? 1 : -1;
      const c = typeof va === "string" ? va.localeCompare(vb as string) : va - (vb as number);
      return (desc ? -c : c) || a.name.localeCompare(b.name);
    })
    .map((r) => r.id);
}

// A table of every shown request's scores, edited in place with dots. Any
// column heading sorts it (again to reverse). The order is fixed until you
// sort or reopen, so rows don't jump while you score them.
function ScoreReview({ requests }: { requests: InstitutionRequest[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<ReviewSort>({ key: "importance", desc: true });
  const [order, setOrder] = useState<number[]>(() => reviewOrder(requests, sort));
  const latest = useRef(requests);
  latest.current = requests;
  const sortRef = useRef(sort);
  const arrange = (next: ReviewSort) => {
    sortRef.current = next;
    setSort(next);
    setOrder(reviewOrder(latest.current, next));
  };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState === "open") arrange(sortRef.current);
    };
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const byId = new Map(requests.map((r) => [r.id, r]));
  const known = new Set(order);
  const rows = [...order.map((id) => byId.get(id)), ...requests.filter((r) => !known.has(r.id))].filter(
    (r): r is InstitutionRequest => !!r
  );
  const heading = (key: ReviewKey, label: string, title?: string) => {
    const active = sort.key === key;
    return (
      <th scope="col" title={title} aria-sort={active ? (sort.desc ? "descending" : "ascending") : "none"}>
        <button
          type="button"
          className={`req-review-sort${active ? " is-active" : ""}`}
          // Name starts A→Z; stage and scores start highest first.
          onClick={() => arrange({ key, desc: active ? !sort.desc : key !== "name" })}
        >
          {label}
          <span className="req-review-arrow" aria-hidden="true">
            {active ? (sort.desc ? "↓" : "↑") : "↕"}
          </span>
        </button>
      </th>
    );
  };
  return (
    <>
      <button type="button" className="req-btn-ghost req-review-open" popoverTarget="req-score-review">
        Review scores
      </button>
      <div id="req-score-review" ref={ref} popover="auto" className="req-popover req-modal req-review">
        <button type="button" className="req-popover-close req-modal-close" popoverTarget="req-score-review" popoverTargetAction="hide" aria-label="Close">
          ×
        </button>
        <h2 className="req-modal-title">Review scores</h2>
        <p className="req-review-lede">
          {rows.length} {rows.length === 1 ? "request" : "requests"} matching the current filters. Click a dot to set a score (again to clear); changes save
          straight away. Click a column heading to sort by it (again to reverse). Importance = leverage × neglectedness.
        </p>
        <table className="req-review-table">
          <thead>
            <tr>
              {heading("name", "Request")}
              {heading("stage", "Stage")}
              {SCORE_KEYS.map((k) => (
                <React.Fragment key={k}>{heading(k, SCORE_LABEL[k], SCORE_HELP[k])}</React.Fragment>
              ))}
              {heading("importance", "Importance", PRIORITY_HELP)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <ScoreReviewRow key={r.id} r={r} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Sorting ────────────────────────────────────────────────────────

type SortKey = "column" | "stage" | "priority" | ScoreKey;
const SORTS: { id: SortKey; name: string }[] = [
  { id: "priority", name: "Importance to work on" },
  { id: "column", name: "Grouped by column" },
  { id: "stage", name: "Grouped by stage" },
  { id: "urgency", name: "Urgency" },
  { id: "leverage", name: "Leverage" },
  { id: "neglect", name: "Neglectedness" },
];

// Unscored requests sort last.
function sortValue(r: InstitutionRequest, key: Exclude<SortKey, "column" | "stage">): number {
  if (key === "priority") return priority(r.scores) ?? -Infinity;
  return r.scores[key as ScoreKey] ?? -Infinity;
}

// ── Page ───────────────────────────────────────────────────────────

export default function Requests({ loaderData: { requests, lenses, canEdit } }: Route.ComponentProps) {
  const [pills, setPills] = useState<Pill[]>([]);
  const [typed, setTyped] = useState("");
  const [sort, setSort] = useState<SortKey>("priority");
  const [editingIds, setEditingIds] = useState<Set<number>>(new Set());
  const setEditing = (id: number, on: boolean) =>
    setEditingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  // Arriving from a grid cell (?request=<id>): show that request and open it.
  const [searchParams] = useSearchParams();
  const openId = searchParams.get("request");
  useEffect(() => {
    if (!openId) return;
    const modal = document.getElementById(`req-detail-${openId}`);
    if (!modal) return;
    modal.closest("tr")?.scrollIntoView({ block: "center" });
    try {
      (modal as HTMLElement & { showPopover(): void }).showPopover();
    } catch {
      // Already open, or popovers unsupported: the row is in view either way.
    }
  }, [openId]);
  const addPill = (p: Pill) =>
    setPills((prev) => (prev.some((x) => x.kind === p.kind && x.value === p.value) ? prev : [...prev, p]));

  const allSites = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of requests) for (const s of r.sites) if (!seen.has(s.name.toLowerCase())) seen.set(s.name.toLowerCase(), s.name);
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [requests]);

  const suggestions = useMemo<Pill[]>(
    () => [
      ...COLS.map((c) => ({ kind: "column" as const, value: c.id, label: c.name })),
      ...ROWS.map((r) => ({ kind: "row" as const, value: r.id, label: r.name })),
      ...lenses.map((l) => ({ kind: "lens" as const, value: l.id, label: l.label })),
      ...STAGES.map((st) => ({ kind: "stage" as const, value: st, label: STAGE_LABEL[st] })),
      ...REQUEST_STATUSES.map((s) => ({ kind: "status" as const, value: s, label: STATUS_LABEL[s] })),
      ...allSites.map((s) => ({ kind: "site" as const, value: s.toLowerCase(), label: s })),
    ],
    [lenses, allSites]
  );

  const shown = requests.filter((r) => editingIds.has(r.id) || matches(r, pills, typed, lenses));
  // The stage summary and the pipeline count what every filter but stage leaves.
  const [showPipeline, setShowPipeline] = useState(false);
  const beforeStage = requests.filter((r) => matches(r, pills.filter((p) => p.kind !== "stage"), typed, lenses));
  const stageCounts = new Map<Stage, number>();
  for (const r of beforeStage) {
    const st = requestStage(r.links, r.sites);
    stageCounts.set(st, (stageCounts.get(st) ?? 0) + 1);
  }
  const toggleStage = (st: Stage) =>
    setPills((prev) =>
      prev.some((p) => p.kind === "stage" && p.value === st)
        ? prev.filter((p) => !(p.kind === "stage" && p.value === st))
        : [...prev, { kind: "stage", value: st, label: STAGE_LABEL[st] }]
    );
  const row = (r: InstitutionRequest, key: string, groupCol?: string) => (
    <RequestRow
      key={key}
      uid={key}
      groupCol={groupCol}
      r={r}
      lenses={lenses}
      canEdit={canEdit}
      editing={editingIds.has(r.id)}
      onEdit={(on) => setEditing(r.id, on)}
      onFilter={addPill}
      allSites={allSites}
    />
  );

  return (
    <div className="req-page">
      <Link to="/" className="detail-back">
        ← Back to grid
      </Link>
      <h1 className="req-title">Institution tracker</h1>
      <p className="req-lede">Institutions we'd like designed and where they could be adopted.</p>

      <div className="req-filters">
        <SearchBar pills={pills} setPills={setPills} typed={typed} setTyped={setTyped} suggestions={suggestions} />
        <label className="req-sort">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORTS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </label>
        {canEdit && <ScoreReview requests={shown} />}
      </div>

      <div className="req-summary">
        <span className="req-count">
          {shown.length === requests.length ? `${requests.length} requests` : `${shown.length} of ${requests.length} requests`}
        </span>
        <span className="req-summary-stages">
          {/* Every stage, so the four pips read as a scale; empty ones are faint. */}
          {STAGES.map((st) =>
            stageCounts.get(st) ? (
              <StageMark
                key={st}
                stage={st}
                count={stageCounts.get(st)}
                active={pills.some((p) => p.kind === "stage" && p.value === st)}
                title={`Show only ${STAGE_LABEL[st]}`}
                onClick={() => toggleStage(st)}
              />
            ) : (
              <span key={st} className="req-stage-none">
                <StageMark stage={st} count={0} />
              </span>
            )
          )}
        </span>
        <button type="button" className="req-pipeline-toggle" aria-expanded={showPipeline} onClick={() => setShowPipeline((v) => !v)}>
          {showPipeline ? "Hide pipeline" : "Show pipeline"}
        </button>
      </div>

      {showPipeline && (
        <RequestSankey
          requests={beforeStage}
          onPick={(stages) =>
            setPills([
              ...pills.filter((p) => p.kind !== "stage"),
              ...stages.map((st) => ({ kind: "stage" as const, value: st, label: STAGE_LABEL[st] })),
            ])
          }
        />
      )}

      <div className="req-table-wrap">
        <table className="req-table">
          {sort === "stage" ? (
            [...STAGES].reverse().map((st) => {
              const group = shown
                .filter((r) => requestStage(r.links, r.sites) === st)
                .sort((a, b) => sortValue(b, "priority") - sortValue(a, "priority") || a.name.localeCompare(b.name));
              if (!group.length) return null;
              return (
                <tbody key={st}>
                  <tr className="req-group">
                    <th colSpan={2}>
                      <button type="button" className="req-group-btn" onClick={() => addPill({ kind: "stage", value: st, label: STAGE_LABEL[st] })} title={`Show only ${STAGE_LABEL[st]}`}>
                        {STAGE_LABEL[st]}
                      </button>{" "}
                      <span className="req-group-desc">{group.length}</span>
                    </th>
                  </tr>
                  {group.map((r) => row(r, `${st}-${r.id}`))}
                </tbody>
              );
            })
          ) : sort === "column" ? (
            COLS.map((c) => {
              // A request in several columns appears under each of them.
              const group = shown.filter((r) => r.cols.includes(c.id));
              if (!group.length) return null;
              return (
                <tbody key={c.id}>
                  <tr className="req-group">
                    <th colSpan={2}>
                      <button type="button" className="req-group-btn" onClick={() => addPill({ kind: "column", value: c.id, label: c.name })} title={`Show only ${c.name}`}>
                        {c.name}
                      </button>{" "}
                      <span className="req-group-desc">{c.desc}</span>
                    </th>
                  </tr>
                  {group.map((r) => row(r, `${c.id}-${r.id}`, c.id))}
                </tbody>
              );
            })
          ) : (
            <tbody>
              {[...shown]
                .sort((a, b) => sortValue(b, sort) - sortValue(a, sort) || a.name.localeCompare(b.name))
                .map((r) => row(r, String(r.id)))}
            </tbody>
          )}
        </table>
      </div>
      {canEdit && (
        <div className="req-new">
          <NewRequest onCreated={(id) => setEditing(id, true)} />
        </div>
      )}
    </div>
  );
}
