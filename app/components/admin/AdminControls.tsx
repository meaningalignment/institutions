import { useFetcher } from "react-router";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { AdminResearcher } from "../../lib/admin.server";

export type ActionResult = { ok: boolean; error?: string };

export const panel =
  "mb-6 rounded-xl border border-[color:var(--line)] bg-[var(--card)] p-5";
export const heading = "text-lg font-semibold text-[color:var(--ink)]";
export const input =
  "rounded-md border border-[color:var(--line-strong)] bg-white px-2.5 py-1.5 text-sm text-[color:var(--ink)] outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/15";
export const btn =
  "rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--accent-dark)] disabled:cursor-not-allowed disabled:opacity-50";
export const btnGhost =
  "rounded-md border border-[color:var(--line-strong)] px-2.5 py-1 text-xs text-[color:var(--muted)] hover:bg-[var(--wash)] disabled:opacity-50";

export function SaveState({
  state,
  data,
  dirty,
}: {
  state: "idle" | "loading" | "submitting";
  data?: ActionResult;
  dirty: boolean;
}) {
  const error = data && !data.ok ? data.error : null;
  if (error) return <span className="text-xs text-red-700">{error}</span>;
  if (state !== "idle") return <span className="text-xs text-[color:var(--muted)]">Saving…</span>;
  if (dirty) return <span className="text-xs text-[color:var(--muted)]">Unsaved</span>;
  return <span className="text-xs text-[color:var(--faint)]">Saved</span>;
}

export function ResearcherCombobox({
  options,
  intent,
  canonicalWorkId,
  placeholder,
}: {
  options: AdminResearcher[];
  intent: "add-scout" | "add-paper-researcher";
  canonicalWorkId?: number;
  placeholder: string;
}) {
  const fetcher = useFetcher<ActionResult>();
  const listboxId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return options
      .filter((option) => {
        if (!needle) return true;
        return `${option.name} ${option.handle}`.toLocaleLowerCase().includes(needle);
      })
      .slice(0, 8);
  }, [options, query]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setQuery("");
      setSelectedId(null);
      setOpen(false);
    }
  }, [fetcher.data, fetcher.state]);

  function choose(option: AdminResearcher) {
    setQuery(option.name);
    setSelectedId(option.id);
    setOpen(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    if (selectedId) return;
    const exact = options.find(
      (option) => option.name.toLocaleLowerCase() === query.trim().toLocaleLowerCase()
    );
    event.preventDefault();
    if (!exact) {
      setOpen(true);
      return;
    }
    const submission = new FormData(event.currentTarget);
    submission.set("researcherId", String(exact.id));
    fetcher.submit(submission, { method: "post" });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, Math.max(matches.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && matches[activeIndex]) {
      event.preventDefault();
      choose(matches[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <fetcher.Form method="post" className="flex flex-wrap items-start gap-2" onSubmit={submit}>
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="researcherId" value={selectedId ?? ""} />
      {canonicalWorkId != null && (
        <input type="hidden" name="canonicalWorkId" value={canonicalWorkId} />
      )}
      <div className="relative min-w-[240px] flex-1" ref={wrapperRef}>
        <input
          className={input + " w-full"}
          value={query}
          placeholder={placeholder}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && matches[activeIndex] ? `${listboxId}-${matches[activeIndex].id}` : undefined
          }
          onFocus={() => setOpen(true)}
          onBlur={(event) => {
            if (!wrapperRef.current?.contains(event.relatedTarget)) setOpen(false);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedId(null);
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {open && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-[color:var(--line-strong)] bg-white p-1 shadow-lg"
          >
            {matches.length ? (
              matches.map((option, index) => (
                <li
                  id={`${listboxId}-${option.id}`}
                  key={option.id}
                  role="option"
                  aria-selected={selectedId === option.id}
                >
                  <button
                    type="button"
                    className={`w-full rounded px-2.5 py-2 text-left text-sm ${
                      index === activeIndex
                        ? "bg-[var(--wash)] text-[color:var(--ink)]"
                        : "text-[color:var(--text)] hover:bg-[var(--wash)]"
                    }`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => choose(option)}
                  >
                    {option.name}
                    {option.handle && (
                      <span className="ml-2 text-xs text-[color:var(--faint)]">{option.handle}</span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-2.5 py-2 text-sm text-[color:var(--muted)]">No matching people</li>
            )}
          </ul>
        )}
      </div>
      <button
        className={btn}
        type="submit"
        disabled={!options.length || fetcher.state !== "idle"}
      >
        Add
      </button>
      {fetcher.data && !fetcher.data.ok && (
        <span className="w-full text-xs text-red-700">{fetcher.data.error}</span>
      )}
    </fetcher.Form>
  );
}
