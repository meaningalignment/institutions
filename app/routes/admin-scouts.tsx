import { useFetcher } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/admin-scouts";
import {
  addScout,
  getResearchersList,
  getScouts,
  removeScout,
  updateScout,
} from "../lib/admin.server";
import {
  type ActionResult,
  btnGhost,
  heading,
  input,
  panel,
  ResearcherCombobox,
  SaveState,
} from "../components/admin/AdminControls";

export async function loader() {
  const [researchers, scouts] = await Promise.all([getResearchersList(), getScouts()]);
  return { researchers, scouts };
}

function positiveInteger(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "");
  const researcherId = positiveInteger(fd.get("researcherId"));
  if (!researcherId) return { ok: false, error: "Choose a researcher." };

  try {
    if (intent === "add-scout") await addScout(researcherId);
    else if (intent === "update-scout") {
      await updateScout(researcherId, String(fd.get("scoutsFor") || ""));
    } else if (intent === "remove-scout") await removeScout(researcherId);
    else return { ok: false, error: "Unknown action." };
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The change could not be saved.",
    };
  }
}

function ScoutRow({
  researcherId,
  name,
  scoutsFor: initialScoutsFor,
}: {
  researcherId: number;
  name: string;
  scoutsFor: string;
}) {
  const fetcher = useFetcher<ActionResult>();
  const removeFetcher = useFetcher<ActionResult>();
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSubmitted = useRef(initialScoutsFor);
  const lastServerValue = useRef(initialScoutsFor);
  const [scoutsFor, setScoutsFor] = useState(initialScoutsFor);

  useEffect(() => {
    if (scoutsFor === lastServerValue.current) {
      setScoutsFor(initialScoutsFor);
      lastSubmitted.current = initialScoutsFor;
    }
    lastServerValue.current = initialScoutsFor;
    // Keep an in-progress local edit when another action revalidates this route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialScoutsFor]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  function save(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!formRef.current || value === lastSubmitted.current) return;
    lastSubmitted.current = value;
    fetcher.submit(formRef.current, { method: "post" });
  }

  return (
    <li className="grid gap-2 border-t border-[color:var(--line)] py-3 first:border-t-0 sm:grid-cols-[minmax(150px,0.7fr)_minmax(260px,1.3fr)_auto] sm:items-center">
      <div className="text-sm font-medium text-[color:var(--ink)]">{name}</div>
      <fetcher.Form method="post" ref={formRef} className="flex items-center gap-2">
        <input type="hidden" name="intent" value="update-scout" />
        <input type="hidden" name="researcherId" value={researcherId} />
        <input
          className={input + " min-w-0 flex-1"}
          name="scoutsFor"
          aria-label={`What ${name} scouts for`}
          value={scoutsFor}
          placeholder="What they scout for"
          onChange={(event) => {
            const value = event.target.value;
            setScoutsFor(value);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => save(value), 650);
          }}
          onBlur={() => save(scoutsFor)}
        />
        <span className="w-14 shrink-0 text-right">
          <SaveState
            state={fetcher.state}
            data={fetcher.data}
            dirty={scoutsFor !== lastSubmitted.current}
          />
        </span>
      </fetcher.Form>
      <removeFetcher.Form method="post">
        <input type="hidden" name="intent" value="remove-scout" />
        <input type="hidden" name="researcherId" value={researcherId} />
        <button className={btnGhost} type="submit" disabled={removeFetcher.state !== "idle"}>
          Remove
        </button>
      </removeFetcher.Form>
    </li>
  );
}

export default function AdminScouts({ loaderData: d }: Route.ComponentProps) {
  const scoutIds = new Set(d.scouts.map((scout) => scout.researcherId));
  const availableScouts = d.researchers.filter((researcher) => !scoutIds.has(researcher.id));

  return (
    <section className={panel}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className={heading}>Scouts</h2>
        <span className="text-xs text-[color:var(--faint)]">{d.scouts.length} current</span>
      </div>
      <p className="mb-3 text-sm text-[color:var(--muted)]">
        Scouting areas save automatically as you edit.
      </p>
      {d.scouts.length ? (
        <ul className="mb-4">
          {d.scouts.map((scout) => (
            <ScoutRow key={scout.researcherId} {...scout} />
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-[color:var(--muted)]">No scouts yet.</p>
      )}
      <div className="border-t border-[color:var(--line)] pt-4">
        <div className="mb-2 text-sm font-medium text-[color:var(--ink)]">Add a scout</div>
        <ResearcherCombobox
          options={availableScouts}
          intent="add-scout"
          placeholder="Start typing a name…"
        />
      </div>
    </section>
  );
}
