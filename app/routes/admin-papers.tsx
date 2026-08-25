import { useFetcher } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/admin-papers";
import {
  addPaperResearcher,
  createPaper,
  getPapers,
  getResearchersList,
  removePaperResearcher,
  updatePaper,
  type AdminResearcher,
} from "../lib/admin.server";
import {
  type ActionResult,
  btn,
  heading,
  input,
  panel,
  ResearcherCombobox,
  SaveState,
} from "../components/admin/AdminControls";
import { requireAdminSession } from "../lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdminSession(request);
  const [researchers, papers] = await Promise.all([getResearchersList(), getPapers()]);
  return { researchers, papers };
}

function positiveInteger(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  await requireAdminSession(request);
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "");
  const researcherId = positiveInteger(fd.get("researcherId"));
  const canonicalWorkId = positiveInteger(fd.get("canonicalWorkId"));

  try {
    if (intent === "add-paper-researcher") {
      if (!canonicalWorkId || !researcherId) {
        return { ok: false, error: "Choose a researcher." };
      }
      await addPaperResearcher(canonicalWorkId, researcherId);
    } else if (intent === "remove-paper-researcher") {
      if (!canonicalWorkId || !researcherId) {
        return { ok: false, error: "Missing paper or researcher." };
      }
      await removePaperResearcher(canonicalWorkId, researcherId);
    } else if (intent === "update-paper") {
      if (!canonicalWorkId) return { ok: false, error: "Missing paper." };
      await updatePaper(
        canonicalWorkId,
        String(fd.get("title") || ""),
        String(fd.get("url") || "")
      );
    } else if (intent === "create-paper") {
      await createPaper(String(fd.get("title") || ""), String(fd.get("url") || ""));
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

function PaperResearcherChip({
  canonicalWorkId,
  researcher,
}: {
  canonicalWorkId: number;
  researcher: { id: number; name: string };
}) {
  const fetcher = useFetcher<ActionResult>();
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="remove-paper-researcher" />
      <input type="hidden" name="canonicalWorkId" value={canonicalWorkId} />
      <input type="hidden" name="researcherId" value={researcher.id} />
      <button
        type="submit"
        className="rounded-none border border-[color:var(--line)] bg-[var(--wash)] px-2.5 py-1 text-xs text-[color:var(--text)] hover:border-[color:var(--line-strong)]"
        aria-label={`Remove ${researcher.name} from this paper`}
        disabled={fetcher.state !== "idle"}
      >
        {researcher.name}{" "}
        <span aria-hidden="true" className="ml-1 text-[color:var(--faint)]">
          ×
        </span>
      </button>
    </fetcher.Form>
  );
}

function PaperRow({
  paper,
  researchers,
}: {
  paper: Route.ComponentProps["loaderData"]["papers"][number];
  researchers: AdminResearcher[];
}) {
  const fetcher = useFetcher<ActionResult>();
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmitted = useRef(
    JSON.stringify({ title: paper.title, url: paper.url ?? "" })
  );
  const lastServerSnapshot = useRef(
    JSON.stringify({ title: paper.title, url: paper.url ?? "" })
  );
  const [title, setTitle] = useState(paper.title);
  const [url, setUrl] = useState(paper.url ?? "");

  useEffect(() => {
    const nextServerSnapshot = JSON.stringify({ title: paper.title, url: paper.url ?? "" });
    const localSnapshot = JSON.stringify({ title, url });
    if (localSnapshot === lastServerSnapshot.current) {
      setTitle(paper.title);
      setUrl(paper.url ?? "");
      lastSubmitted.current = nextServerSnapshot;
    }
    lastServerSnapshot.current = nextServerSnapshot;
    // Keep an in-progress local edit when another action revalidates this route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paper.title, paper.url]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  function save(nextTitle: string, nextUrl: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    const snapshot = JSON.stringify({ title: nextTitle, url: nextUrl });
    if (!formRef.current || snapshot === lastSubmitted.current) return;
    lastSubmitted.current = snapshot;
    fetcher.submit(formRef.current, { method: "post" });
  }

  const associatedIds = new Set(paper.researchers.map((researcher) => researcher.id));
  const availableResearchers = researchers.filter((researcher) => !associatedIds.has(researcher.id));
  const dirty = JSON.stringify({ title, url }) !== lastSubmitted.current;

  return (
    <li className="border-t border-[color:var(--line)] py-4 first:border-t-0">
      <fetcher.Form
        method="post"
        ref={formRef}
        className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
      >
        <input type="hidden" name="intent" value="update-paper" />
        <input type="hidden" name="canonicalWorkId" value={paper.id} />
        <input
          className={input}
          name="title"
          aria-label="Paper title"
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => save(value, url), 650);
          }}
          onBlur={() => save(title, url)}
        />
        <input
          className={input}
          name="url"
          aria-label={`URL for ${paper.title}`}
          value={url}
          placeholder="URL"
          onChange={(event) => {
            const value = event.target.value;
            setUrl(value);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => save(title, value), 650);
          }}
          onBlur={() => save(title, url)}
        />
        <span className="w-14 text-right">
          <SaveState state={fetcher.state} data={fetcher.data} dirty={dirty} />
        </span>
      </fetcher.Form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {paper.researchers.map((researcher) => (
          <PaperResearcherChip
            key={researcher.id}
            canonicalWorkId={paper.id}
            researcher={researcher}
          />
        ))}
        {!paper.researchers.length && (
          <span className="text-xs text-[color:var(--muted)]">No researchers associated.</span>
        )}
      </div>

      <div className="mt-3 max-w-lg">
        <ResearcherCombobox
          options={availableResearchers}
          intent="add-paper-researcher"
          canonicalWorkId={paper.id}
          placeholder="Add a researcher…"
        />
      </div>
    </li>
  );
}

function AddPaperForm() {
  const fetcher = useFetcher<ActionResult>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) formRef.current?.reset();
  }, [fetcher.data, fetcher.state]);

  return (
    <fetcher.Form
      method="post"
      ref={formRef}
      className="grid gap-2 border-t border-[color:var(--line)] pt-4 sm:grid-cols-[1fr_1fr_auto]"
    >
      <input type="hidden" name="intent" value="create-paper" />
      <input className={input} name="title" placeholder="New paper title" required />
      <input className={input} name="url" placeholder="URL (optional)" />
      <button className={btn} type="submit" disabled={fetcher.state !== "idle"}>
        Add paper
      </button>
      {fetcher.data && !fetcher.data.ok && (
        <span className="admin-error text-xs sm:col-span-3">{fetcher.data.error}</span>
      )}
    </fetcher.Form>
  );
}

function ResearcherCoverage({
  researchers,
  papers,
}: {
  researchers: AdminResearcher[];
  papers: Route.ComponentProps["loaderData"]["papers"];
}) {
  const [query, setQuery] = useState("");
  const worksByResearcher = new Map<number, typeof papers>();
  for (const paper of papers) {
    for (const researcher of paper.researchers) {
      const works = worksByResearcher.get(researcher.id) ?? [];
      works.push(paper);
      worksByResearcher.set(researcher.id, works);
    }
  }
  const normalizedQuery = query.trim().toLowerCase();
  const visible = researchers.filter((researcher) => {
    if (!normalizedQuery) return true;
    return `${researcher.name} ${researcher.handle}`.toLowerCase().includes(normalizedQuery);
  });
  const covered = researchers.filter((researcher) => worksByResearcher.has(researcher.id)).length;

  return (
    <section className={`${panel} mb-5`}>
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={heading}>Researcher coverage</h2>
        <span className="text-xs text-[color:var(--faint)]">
          {covered} of {researchers.length} have selected work
        </span>
      </div>
      <p className="mb-3 text-sm text-[color:var(--muted)]">
        Work through the uncovered researchers, open their Scholar profile, then add the most
        institutionally relevant work in the paper editor below.
      </p>
      <input
        className={`${input} mb-3 max-w-sm`}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Find a researcher…"
        aria-label="Find a researcher"
      />
      <ul className="max-h-[440px] overflow-y-auto border-t border-[color:var(--line)]">
        {visible.map((researcher) => {
          const works = worksByResearcher.get(researcher.id) ?? [];
          return (
            <li
              key={researcher.id}
              className="grid gap-1 border-b border-[color:var(--line)] py-3 sm:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.6fr)_auto] sm:items-start sm:gap-4"
            >
              <div>
                <div className="text-sm font-medium text-[color:var(--ink)]">{researcher.name}</div>
                {researcher.handle && (
                  <div className="text-xs text-[color:var(--faint)]">{researcher.handle}</div>
                )}
              </div>
              <div className="text-xs leading-5 text-[color:var(--muted)]">
                {works.length
                  ? works.map((paper) => paper.title).join(" · ")
                  : "No selected work yet"}
              </div>
              {researcher.scholarUrl ? (
                <a
                  className="text-xs text-[color:var(--accent)] hover:underline"
                  href={researcher.scholarUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Scholar ↗
                </a>
              ) : (
                <span className="text-xs text-[color:var(--faint)]">No Scholar link</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function AdminPapers({ loaderData: d }: Route.ComponentProps) {
  return (
    <>
      <ResearcherCoverage researchers={d.researchers} papers={d.papers} />
      <section className={panel}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className={heading}>Papers</h2>
        <span className="text-xs text-[color:var(--faint)]">{d.papers.length} current</span>
      </div>
      <p className="mb-3 text-sm text-[color:var(--muted)]">
        Paper details save automatically. Add or remove associated researchers by name.
      </p>
      {d.papers.length ? (
        <ul className="mb-4">
          {d.papers.map((paper) => (
            <PaperRow key={paper.id} paper={paper} researchers={d.researchers} />
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-[color:var(--muted)]">No papers yet.</p>
      )}
      <AddPaperForm />
      </section>
    </>
  );
}
