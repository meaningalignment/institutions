import { useFetcher } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/admin-x-list";
import { requireAdminSession } from "../lib/auth.server";
import { invalidateCommunityCache } from "../lib/researchers.server";
import { applyXListSync, getXListStatus, planXListSync } from "../lib/x-list.server";
import { planChangeCount, type SyncPlan } from "../lib/x-list-plan";
import { btn, heading, panel } from "../components/admin/AdminControls";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdminSession(request);
  return getXListStatus();
}

type XListActionResult =
  | { ok: false; error: string }
  | { ok: true; intent: "preview"; plan: SyncPlan; listSize: number }
  | { ok: true; intent: "apply"; log: string[] };

export async function action({ request }: Route.ActionArgs): Promise<XListActionResult> {
  const session = await requireAdminSession(request);
  const intent = String((await request.formData()).get("intent") || "");
  try {
    if (intent === "preview") {
      const { plan, listSize } = await planXListSync();
      return { ok: true, intent, plan, listSize };
    }
    if (intent === "apply") {
      // Re-read X rather than trusting the preview, in case either side moved.
      const { plan } = await planXListSync();
      const log = await applyXListSync(plan);
      console.log(`X list sync by researcher ${session.researcherId}:\n${log.join("\n")}`);
      invalidateCommunityCache();
      return { ok: true, intent, log };
    }
    return { ok: false, error: "Unknown action." };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The sync didn't finish.",
    };
  }
}

function Section<T>({
  title,
  rows,
  line,
}: {
  title: string;
  rows: T[];
  line: (row: T) => string;
}) {
  if (!rows.length) return null;
  return (
    <div className="mb-4">
      <h3 className="mb-1 text-sm font-semibold text-[color:var(--ink)]">
        {title} <span className="font-normal text-[color:var(--faint)]">({rows.length})</span>
      </h3>
      <ul className="space-y-0.5 text-sm text-[color:var(--text)]">
        {rows.map((row, i) => (
          <li key={i}>{line(row)}</li>
        ))}
      </ul>
    </div>
  );
}

const who = (p: { name: string; handle: string }) => `${p.name}${p.handle ? ` ${p.handle}` : ""}`;

function PlanView({ plan, listSize }: { plan: SyncPlan; listSize: number }) {
  const changes = planChangeCount(plan);
  return (
    <div className="mt-4">
      <p className="mb-4 text-sm text-[color:var(--muted)]">
        {listSize} on the X list.{" "}
        {changes ? `${changes} ${changes === 1 ? "change" : "changes"} to make.` : "Everything matches."}
      </p>
      <Section title="Add to the X list (ticked here)" rows={plan.addToX} line={who} />
      <Section title="Remove from the X list (unticked here)" rows={plan.removeFromX} line={who} />
      <Section title="Tick here (added on X)" rows={plan.markInApp} line={who} />
      <Section title="Untick here (removed on X)" rows={plan.unmarkInApp} line={who} />
      <Section
        title="Create new people (on X, not here)"
        rows={plan.create}
        line={(p) => `${p.name} ${p.handle}`}
      />
      <Section
        title="Give an existing person their handle (same name, no handle yet)"
        rows={plan.link}
        line={(p) => `${p.name} → ${p.handle}`}
      />
      <div className="text-[color:var(--muted)]">
        <Section
          title="Can't add to X, left as is"
          rows={plan.cannotAdd}
          line={(p) => `${who(p)}: ${p.reason}`}
        />
        <Section
          title="Handle differs from X, not changed"
          rows={plan.handleChanges}
          line={(p) => `${p.name}: ${p.handle || "no handle"} here, ${p.to} on X`}
        />
        <Section
          title="Handle now belongs to a different X account, skipped"
          rows={plan.conflicts}
          line={(p) => `${p.name} ${p.handle}: the list has @${p.member.username} (${p.member.name})`}
        />
      </div>
    </div>
  );
}

export default function AdminXList({ loaderData: status }: Route.ComponentProps) {
  const preview = useFetcher<XListActionResult>();
  const apply = useFetcher<XListActionResult>();
  // Which fetcher's result to show: the most recently submitted one.
  const [shown, setShown] = useState<"preview" | "apply">("preview");
  const busy = preview.state !== "idle" || apply.state !== "idle";
  const current = shown === "apply" ? apply.data : preview.data;
  const previewData = preview.data?.ok && preview.data.intent === "preview" ? preview.data : null;
  const applied = shown === "apply" && apply.data?.ok && apply.data.intent === "apply" ? apply.data : null;
  const error = current && !current.ok ? current.error : null;

  return (
    <section className={panel}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className={heading}>X list</h2>
        {status.listUrl && (
          <a
            className="text-xs text-[color:var(--accent)] hover:underline"
            href={status.listUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open on X
          </a>
        )}
      </div>

      {!status.connected ? (
        <p className="text-sm text-[color:var(--muted)]">
          X isn't connected yet. Set <code>X_API_KEY</code>, <code>X_API_SECRET</code>,{" "}
          <code>X_ACCESS_TOKEN</code>, <code>X_ACCESS_SECRET</code> and <code>X_LIST_ID</code> in
          the environment. Until then the X list checkbox on the People tab only records who should
          be on the list.
        </p>
      ) : (
        <>
          <p className="mb-4 text-sm text-[color:var(--muted)]">
            {status.ticked} people are ticked on the People tab, and ticking or unticking someone
            there changes the list right away. Checking here picks up changes made on X itself, and
            creates people who are on the list but not here.
            {status.neverSynced &&
              " The first check treats the X list as correct: everyone on it gets ticked, and nobody is removed."}{" "}
            Changes are made as the list owner's X account. X bills about half a cent per list
            member read, so each check costs a little.
          </p>

          <preview.Form
            method="post"
            className="flex items-center gap-3"
            onSubmit={() => setShown("preview")}
          >
            <input type="hidden" name="intent" value="preview" />
            <button className={btn} disabled={busy}>
              {preview.state !== "idle" ? "Checking…" : "Check X list"}
            </button>
          </preview.Form>

          {error && <p className="admin-error mt-3 text-sm">{error}</p>}

          {applied ? (
            <div className="mt-4">
              <h3 className="mb-1 text-sm font-semibold text-[color:var(--ink)]">Done</h3>
              <ul className="space-y-0.5 text-sm text-[color:var(--text)]">
                {applied.log.length ? (
                  applied.log.map((line, i) => <li key={i}>{line}</li>)
                ) : (
                  <li>Nothing needed changing.</li>
                )}
              </ul>
            </div>
          ) : (
            previewData && (
              <>
                <PlanView plan={previewData.plan} listSize={previewData.listSize} />
                {planChangeCount(previewData.plan) > 0 && (
                  <apply.Form method="post" onSubmit={() => setShown("apply")}>
                    <input type="hidden" name="intent" value="apply" />
                    <button className={btn} disabled={busy}>
                      {apply.state !== "idle"
                        ? "Applying…"
                        : `Apply ${planChangeCount(previewData.plan)} ${
                            planChangeCount(previewData.plan) === 1 ? "change" : "changes"
                          }`}
                    </button>
                  </apply.Form>
                )}
              </>
            )
          )}
        </>
      )}
    </section>
  );
}
