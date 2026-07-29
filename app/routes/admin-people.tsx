import { useFetcher } from "react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/admin-people";
import {
  getInvolvements,
  getPeople,
  setInvolvement,
  updateCloseness,
  type AdminPerson,
  type Closeness,
} from "../lib/admin.server";
import {
  type ActionResult,
  heading,
  input,
  panel,
} from "../components/admin/AdminControls";

const CLOSENESS_LEVELS: { value: Closeness; label: string }[] = [
  { value: "core-team", label: "⭐ Core team" },
  { value: "committed", label: "✅ Committed" },
  { value: "warm", label: "🔥 Warm" },
  { value: "not-on-slack", label: "🧊 Cold" },
  { value: "unknown", label: "❓ Unknown" },
];

const CLOSENESS_NAMES: Record<Closeness, string> = {
  "core-team": "Core team",
  committed: "Committed",
  warm: "Warm",
  "not-on-slack": "Cold",
  unknown: "Unknown",
};

const CLOSENESS_VALUES = new Set<Closeness>(
  CLOSENESS_LEVELS.map((level) => level.value)
);

export async function loader() {
  const [people, involvements] = await Promise.all([getPeople(), getInvolvements()]);
  return { people, involvements };
}

function positiveInteger(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "");
  const researcherId = positiveInteger(fd.get("researcherId"));
  if (!researcherId) return { ok: false, error: "Missing researcher." };

  try {
    if (intent === "update-closeness") {
      const closeness = String(fd.get("closeness") || "") as Closeness;
      if (!CLOSENESS_VALUES.has(closeness)) {
        return { ok: false, error: "Choose a closeness level." };
      }
      await updateCloseness(researcherId, closeness);
    } else if (intent === "set-involvement") {
      const involvementId = positiveInteger(fd.get("involvementId"));
      if (!involvementId) return { ok: false, error: "Missing involvement." };
      await setInvolvement(researcherId, involvementId, fd.get("active") === "true");
    } else {
      return { ok: false, error: "Unknown action." };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The change could not be saved.",
    };
  }
}

function PersonRow({
  person,
  involvements,
}: {
  person: AdminPerson;
  involvements: Route.ComponentProps["loaderData"]["involvements"];
}) {
  const closenessFetcher = useFetcher<ActionResult>();
  const [closeness, setCloseness] = useState(person.closeness);
  const [expanded, setExpanded] = useState(false);
  const signal = involvements.find((involvement) => involvement.kind === "signal");
  const signalActive = signal ? person.involvementIds.includes(signal.id) : false;
  const otherInvolvements = involvements.filter(
    (involvement) => involvement.kind !== "signal"
  );
  const involvementSummary = summarizeOtherInvolvements(person, involvements);

  useEffect(() => setCloseness(person.closeness), [person.closeness]);
  useEffect(() => {
    if (closenessFetcher.state === "idle" && closenessFetcher.data && !closenessFetcher.data.ok) {
      setCloseness(person.closeness);
    }
  }, [closenessFetcher.data, closenessFetcher.state, person.closeness]);

  return (
    <li className="border-t border-[color:var(--line)] py-3 first:border-t-0">
      <div className="grid gap-2 sm:grid-cols-[minmax(170px,240px)_180px_110px_minmax(100px,1fr)] sm:items-center">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-[color:var(--ink)]">{person.name}</div>
          {person.handle && (
            <div className="truncate text-xs text-[color:var(--faint)]">{person.handle}</div>
          )}
        </div>

        <closenessFetcher.Form method="post">
          <input type="hidden" name="intent" value="update-closeness" />
          <input type="hidden" name="researcherId" value={person.id} />
          <select
            className={input + " w-full"}
            name="closeness"
            aria-label={`Closeness for ${person.name}`}
            value={closeness}
            onChange={(event) => {
              setCloseness(event.target.value as Closeness);
              closenessFetcher.submit(event.currentTarget.form, { method: "post" });
            }}
          >
            {CLOSENESS_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          {closenessFetcher.data && !closenessFetcher.data.ok && (
            <span className="block text-xs text-red-700">{closenessFetcher.data.error}</span>
          )}
        </closenessFetcher.Form>

        {signal ? (
          <MembershipToggle
            researcherId={person.id}
            researcherName={person.name}
            involvement={signal}
            active={signalActive}
            label="Signal"
          />
        ) : (
          <span />
        )}

        <button
          type="button"
          className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-[color:var(--muted)] hover:bg-[var(--wash)]"
          aria-expanded={expanded}
          aria-label={`Edit involvements for ${person.name}`}
          onClick={() => setExpanded((value) => !value)}
        >
          <span className="truncate">{involvementSummary || "No other involvement"}</span>
          <span aria-hidden="true" className="text-xs text-[color:var(--faint)]">
            {expanded ? "▲" : "▼"}
          </span>
        </button>
      </div>

      {expanded && (
        <div className="mt-3 rounded-lg bg-[var(--wash)] p-3">
          <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
            {otherInvolvements.map((involvement) => (
              <MembershipToggle
                key={involvement.id}
                researcherId={person.id}
                researcherName={person.name}
                involvement={involvement}
                active={person.involvementIds.includes(involvement.id)}
              />
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

function MembershipToggle({
  researcherId,
  researcherName,
  involvement,
  active,
  label,
}: {
  researcherId: number;
  researcherName: string;
  involvement: Route.ComponentProps["loaderData"]["involvements"][number];
  active: boolean;
  label?: string;
}) {
  const fetcher = useFetcher<ActionResult>();
  const [checked, setChecked] = useState(active);

  useEffect(() => setChecked(active), [active]);
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && !fetcher.data.ok) setChecked(active);
  }, [active, fetcher.data, fetcher.state]);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="set-involvement" />
      <input type="hidden" name="researcherId" value={researcherId} />
      <input type="hidden" name="involvementId" value={involvement.id} />
      <label
        className={`flex items-start gap-2 rounded-md px-2 py-1.5 text-[color:var(--text)] hover:bg-white ${
          label ? "text-sm" : "text-xs"
        } ${fetcher.state !== "idle" ? "opacity-60" : ""}`}
      >
        <input
          type="checkbox"
          name="active"
          value="true"
          checked={checked}
          className={label ? "" : "mt-0.5"}
          aria-label={`${label ?? involvement.name} membership for ${researcherName}`}
          onChange={(event) => {
            setChecked(event.currentTarget.checked);
            const form = event.currentTarget.form;
            if (!form) return;
            const submission = new FormData(form);
            submission.set("active", String(event.currentTarget.checked));
            fetcher.submit(submission, { method: "post" });
          }}
        />
        {label ? (
          label
        ) : (
          <span>
            <span className="text-[color:var(--faint)]">{involvement.kind}</span>{" "}
            {involvement.name}
          </span>
        )}
      </label>
      {fetcher.data && !fetcher.data.ok && (
        <span className="block px-2 text-xs text-red-700">{fetcher.data.error}</span>
      )}
    </fetcher.Form>
  );
}

function countLabel(
  involvements: Route.ComponentProps["loaderData"]["involvements"],
  kind: string,
  singular: string,
  plural: string
) {
  const count = involvements.filter((involvement) => involvement.kind === kind).length;
  if (!count) return null;
  return `${count} ${count === 1 ? singular : plural}`;
}

function summarizeOtherInvolvements(
  person: AdminPerson,
  involvements: Route.ComponentProps["loaderData"]["involvements"]
) {
  const active = involvements.filter(
    (involvement) =>
      involvement.kind !== "signal" && person.involvementIds.includes(involvement.id)
  );
  return [
    active.some((involvement) => involvement.kind === "slack") ? "Slack" : null,
    countLabel(active, "zoom", "Zoom", "Zooms"),
    countLabel(active, "workshop", "workshop", "workshops"),
  ]
    .filter(Boolean)
    .join(" · ");
}

function personMarkdown(
  person: AdminPerson,
  involvements: Route.ComponentProps["loaderData"]["involvements"],
  signalId: number | undefined
) {
  const details = [CLOSENESS_NAMES[person.closeness]];
  if (signalId && person.involvementIds.includes(signalId)) details.push("Signal");
  const involvementSummary = summarizeOtherInvolvements(person, involvements);
  if (involvementSummary) details.push(involvementSummary);
  const handle = person.handle
    ? ` (${person.handle.startsWith("@") ? person.handle : `@${person.handle}`})`
    : "";
  return `- **${person.name}**${handle} — ${details.join(" · ")}`;
}

export default function AdminPeople({ loaderData: d }: Route.ComponentProps) {
  const [search, setSearch] = useState("");
  const [closenessFilter, setClosenessFilter] = useState<Set<Closeness>>(new Set());
  const [signalFilter, setSignalFilter] = useState<"any" | "on" | "off">("any");
  const [slackFilter, setSlackFilter] = useState<"any" | "on" | "off">("any");
  const [eventFilter, setEventFilter] = useState<"any" | "involved" | "not-involved">("any");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const filtersRef = useRef<HTMLDivElement>(null);
  const signal = d.involvements.find((involvement) => involvement.kind === "signal");
  const slack = d.involvements.find((involvement) => involvement.kind === "slack");
  const otherInvolvementIds = useMemo(
    () =>
      new Set(
        d.involvements
          .filter((involvement) => involvement.kind !== "signal")
          .map((involvement) => involvement.id)
      ),
    [d.involvements]
  );
  const visiblePeople = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return d.people.filter((person) => {
      const matchesSearch =
        !needle || `${person.name} ${person.handle}`.toLocaleLowerCase().includes(needle);
      const matchesCloseness =
        closenessFilter.size === 0 || closenessFilter.has(person.closeness);
      const onSignal = signal ? person.involvementIds.includes(signal.id) : false;
      const matchesSignal =
        signalFilter === "any" ||
        (signalFilter === "on" && onSignal) ||
        (signalFilter === "off" && !onSignal);
      const onSlack = slack ? person.involvementIds.includes(slack.id) : false;
      const matchesSlack =
        slackFilter === "any" ||
        (slackFilter === "on" && onSlack) ||
        (slackFilter === "off" && !onSlack);
      const hasOtherInvolvement = person.involvementIds.some((id) =>
        otherInvolvementIds.has(id)
      );
      const matchesEvents =
        eventFilter === "any" ||
        (eventFilter === "involved" && hasOtherInvolvement) ||
        (eventFilter === "not-involved" && !hasOtherInvolvement);
      return matchesSearch && matchesCloseness && matchesSignal && matchesSlack && matchesEvents;
    });
  }, [
    closenessFilter,
    d.people,
    eventFilter,
    otherInvolvementIds,
    search,
    signal,
    signalFilter,
    slack,
    slackFilter,
  ]);
  const hasFacetFilters =
    closenessFilter.size > 0 ||
    signalFilter !== "any" ||
    slackFilter !== "any" ||
    eventFilter !== "any";
  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (closenessFilter.size) {
      parts.push(
        CLOSENESS_LEVELS.filter((level) => closenessFilter.has(level.value))
          .map((level) => level.label)
          .join(" or ")
      );
    }
    if (signalFilter === "on") parts.push("On Signal");
    else if (signalFilter === "off") parts.push("Not on Signal");
    if (slackFilter === "on") parts.push("On Slack");
    else if (slackFilter === "off") parts.push("Not on Slack");
    if (eventFilter === "involved") parts.push("Involved");
    else if (eventFilter === "not-involved") parts.push("Not involved");
    return parts.length ? `Showing ${parts.join(" · ")}` : "Showing all people";
  }, [closenessFilter, eventFilter, signalFilter, slackFilter]);

  useEffect(() => {
    if (!filtersOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!filtersRef.current?.contains(event.target as Node)) setFiltersOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setFiltersOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [filtersOpen]);

  useEffect(() => {
    setCopyStatus("idle");
  }, [closenessFilter, eventFilter, search, signalFilter, slackFilter]);

  function toggleCloseness(value: Closeness) {
    setClosenessFilter((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function clearFacetFilters() {
    setClosenessFilter(new Set());
    setSignalFilter("any");
    setSlackFilter("any");
    setEventFilter("any");
  }

  async function copyMarkdown() {
    const markdown = visiblePeople
      .map((person) => personMarkdown(person, d.involvements, signal?.id))
      .join("\n");
    try {
      await navigator.clipboard.writeText(markdown);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section className={panel}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className={heading}>People</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[color:var(--faint)]">
            {visiblePeople.length === d.people.length
              ? `${d.people.length} people`
              : `${visiblePeople.length} of ${d.people.length}`}
          </span>
          <button
            type="button"
            className="text-xs text-[color:var(--accent)] hover:underline disabled:text-[color:var(--faint)] disabled:no-underline"
            disabled={visiblePeople.length === 0}
            onClick={copyMarkdown}
          >
            {copyStatus === "copied"
              ? "Copied!"
              : copyStatus === "error"
                ? "Copy failed"
                : "Copy Markdown"}
          </button>
        </div>
      </div>
      <p className="mb-4 text-sm text-[color:var(--muted)]">
        Everyone stays visible whether or not they have an involvement. Closeness and involvement
        changes save automatically.
      </p>

      <div className="mb-4 space-y-2">
        <input
          className={input + " w-full"}
          type="search"
          value={search}
          placeholder="Search names…"
          aria-label="Search people"
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="relative" ref={filtersRef}>
          <button
            type="button"
            className={`flex w-full items-center gap-2 px-1 py-1 text-left text-sm ${
              hasFacetFilters ? "text-[color:var(--ink)]" : "text-[color:var(--muted)]"
            }`}
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <span aria-hidden="true">⚙</span>
            <span className="max-w-[420px] truncate">{filterSummary}</span>
          </button>

          {filtersOpen && (
            <div
              role="dialog"
              aria-label="People filters"
              className="absolute left-0 z-30 mt-2 w-[min(680px,calc(100vw-3rem))] rounded-xl border border-[color:var(--line-strong)] bg-white p-4 shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-[color:var(--ink)]">Filter people</div>
                <button
                  type="button"
                  className="rounded px-2 py-1 text-sm text-[color:var(--muted)] hover:bg-[var(--wash)]"
                  aria-label="Close filters"
                  onClick={() => setFiltersOpen(false)}
                >
                  ×
                </button>
              </div>
              <FacetRow label="Closeness">
                <FacetButton
                  active={closenessFilter.size === 0}
                  onClick={() => setClosenessFilter(new Set())}
                >
                  Any
                </FacetButton>
                {CLOSENESS_LEVELS.map((level) => (
                  <FacetButton
                    key={level.value}
                    active={closenessFilter.has(level.value)}
                    onClick={() => toggleCloseness(level.value)}
                  >
                    {level.label}
                  </FacetButton>
                ))}
              </FacetRow>
              <FacetRow label="Signal">
                <FacetButton active={signalFilter === "any"} onClick={() => setSignalFilter("any")}>
                  Any
                </FacetButton>
                <FacetButton active={signalFilter === "on"} onClick={() => setSignalFilter("on")}>
                  On Signal
                </FacetButton>
                <FacetButton active={signalFilter === "off"} onClick={() => setSignalFilter("off")}>
                  Not on Signal
                </FacetButton>
              </FacetRow>
              <FacetRow label="Slack">
                <FacetButton active={slackFilter === "any"} onClick={() => setSlackFilter("any")}>
                  Any
                </FacetButton>
                <FacetButton active={slackFilter === "on"} onClick={() => setSlackFilter("on")}>
                  On Slack
                </FacetButton>
                <FacetButton active={slackFilter === "off"} onClick={() => setSlackFilter("off")}>
                  Not on Slack
                </FacetButton>
              </FacetRow>
              <FacetRow label="Other involvement">
                <FacetButton active={eventFilter === "any"} onClick={() => setEventFilter("any")}>
                  Any
                </FacetButton>
                <FacetButton
                  active={eventFilter === "involved"}
                  onClick={() => setEventFilter("involved")}
                >
                  Involved
                </FacetButton>
                <FacetButton
                  active={eventFilter === "not-involved"}
                  onClick={() => setEventFilter("not-involved")}
                >
                  Not involved
                </FacetButton>
              </FacetRow>
              <div className="mt-2 flex items-center justify-between border-t border-[color:var(--line)] pt-3">
                <button
                  type="button"
                  className="text-xs text-[color:var(--accent)] hover:underline disabled:text-[color:var(--faint)] disabled:no-underline"
                  onClick={clearFacetFilters}
                  disabled={!hasFacetFilters}
                >
                  Clear filters
                </button>
                <button
                  type="button"
                  className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-dark)]"
                  onClick={() => setFiltersOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
        {search.trim() && (
          <div className="text-right">
            <button
              type="button"
              className="text-xs text-[color:var(--accent)] hover:underline"
              onClick={() => setSearch("")}
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {visiblePeople.length ? (
        <ul>
          {visiblePeople.map((person) => (
            <PersonRow key={person.id} person={person} involvements={d.involvements} />
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-sm text-[color:var(--muted)]">
          No people match these filters.
        </p>
      )}
    </section>
  );
}

function FacetRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-[color:var(--line)] py-2 first:border-t-0 sm:grid-cols-[125px_1fr] sm:items-start">
      <div className="pt-1 text-xs font-medium text-[color:var(--muted)]">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FacetButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs ${
        active
          ? "border-[color:var(--accent)] bg-white text-[color:var(--accent)]"
          : "border-transparent text-[color:var(--muted)] hover:border-[color:var(--line-strong)] hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}
