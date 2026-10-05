import { useFetcher } from "react-router";
import type { Route } from "./+types/admin-appreciations";
import { requireMaiTeam } from "../lib/auth.server";
import {
  type Appreciation,
  approveGem,
  getAllAppreciations,
  getPendingGems,
  rejectGem,
  setFlowersSent,
  setPick,
  updateGem,
} from "../lib/appreciations.server";
import {
  type ActionResult,
  btn,
  btnGhost,
  heading,
  input,
  panel,
} from "../components/admin/AdminControls";
import { GemChip } from "../components/Gem";
import { monthKey } from "../lib/gems";

export async function loader({ request }: Route.LoaderArgs) {
  await requireMaiTeam(request);
  const [appreciations, pendingGems] = await Promise.all([
    getAllAppreciations(),
    getPendingGems(),
  ]);
  return { appreciations, pendingGems };
}

function positiveInteger(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  await requireMaiTeam(request);
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "");
  const id = positiveInteger(fd.get("id"));
  if (!id) return { ok: false, error: "Missing id." };

  try {
    if (intent === "pick") await setPick(id, fd.get("picked") === "true");
    else if (intent === "flowers") await setFlowersSent(id, fd.get("sent") === "true");
    else if (intent === "save-gem" || intent === "approve-gem") {
      await updateGem(id, String(fd.get("name") ?? ""), String(fd.get("description") ?? ""));
      if (intent === "approve-gem") await approveGem(id);
    } else if (intent === "reject-gem") await rejectGem(id);
    else return { ok: false, error: "Unknown action." };
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The change could not be saved.",
    };
  }
}

function monthLabel(key: string) {
  return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function PendingGem({
  gem,
}: {
  gem: { id: number; slug: string; name: string; description: string; createdByName: string | null };
}) {
  const fetcher = useFetcher<ActionResult>();
  return (
    <li className="border-t border-[color:var(--line)] py-3 first:border-t-0">
      <fetcher.Form method="post" className="grid gap-2">
        <input type="hidden" name="id" value={gem.id} />
        <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
          <GemChip slug={gem.slug} name={gem.name} pending />
          {gem.createdByName && <span>crafted by {gem.createdByName}</span>}
        </div>
        <input className={input} name="name" defaultValue={gem.name} aria-label="Gem name" />
        <textarea
          className={input}
          name="description"
          rows={2}
          defaultValue={gem.description}
          aria-label="Gem description"
        />
        <div className="flex items-center gap-2">
          <button className={btn} name="intent" value="approve-gem" disabled={fetcher.state !== "idle"}>
            Approve
          </button>
          <button className={btnGhost} name="intent" value="save-gem" disabled={fetcher.state !== "idle"}>
            Save
          </button>
          <button
            className={btnGhost}
            name="intent"
            value="reject-gem"
            disabled={fetcher.state !== "idle"}
            onClick={(event) => {
              if (!confirm(`Reject “${gem.name}”? It will be removed from any notes it’s on.`)) {
                event.preventDefault();
              }
            }}
          >
            Reject
          </button>
          {fetcher.data && !fetcher.data.ok && (
            <span className="admin-error text-xs">{fetcher.data.error}</span>
          )}
        </div>
      </fetcher.Form>
    </li>
  );
}

function AppreciationRow({ appreciation: a }: { appreciation: Appreciation }) {
  const pick = useFetcher<ActionResult>();
  const flowers = useFetcher<ActionResult>();
  const picked =
    pick.formData ? pick.formData.get("picked") === "true" : a.pickedMonth != null;
  const sent = flowers.formData ? flowers.formData.get("sent") === "true" : !!a.flowersSentAt;

  return (
    <li
      className={`border-t border-[color:var(--line)] py-4 first:border-t-0 ${
        picked ? "bg-[var(--wash)] px-3" : ""
      }`}
    >
      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 text-sm">
        <span className="font-medium text-[color:var(--ink)]">{a.recipient.name}</span>
        <span className="text-xs text-[color:var(--muted)]">
          from {a.sender?.name ?? "a former member"} ·{" "}
          {new Date(a.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })}
        </span>
        {picked && (
          <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--ink)]">
            ✿ This month’s pick
          </span>
        )}
      </div>
      <p className="mb-2 whitespace-pre-line text-sm leading-relaxed text-[color:var(--text)]">
        {a.note}
      </p>
      {a.gems.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {a.gems.map((gem) => (
            <GemChip
              key={gem.id}
              slug={gem.slug}
              name={gem.name}
              description={gem.description}
              pending={gem.status === "pending"}
            />
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <pick.Form method="post">
          <input type="hidden" name="intent" value="pick" />
          <input type="hidden" name="id" value={a.id} />
          <input type="hidden" name="picked" value={picked ? "false" : "true"} />
          <button className={picked ? btnGhost : btn} type="submit">
            {picked ? "Unpick" : `Pick for ${monthLabel(monthKey(a.createdAt))}`}
          </button>
        </pick.Form>
        <flowers.Form method="post" className="admin-section">
          <input type="hidden" name="intent" value="flowers" />
          <input type="hidden" name="id" value={a.id} />
          <label className="flex items-center gap-1.5 text-sm text-[color:var(--text)]">
            <input
              type="checkbox"
              name="sent"
              value="true"
              checked={sent}
              onChange={(event) =>
                flowers.submit(
                  { intent: "flowers", id: String(a.id), sent: String(event.target.checked) },
                  { method: "post" }
                )
              }
            />
            Flowers sent
          </label>
        </flowers.Form>
        {[pick.data, flowers.data].map((data, i) =>
          data && !data.ok ? (
            <span key={i} className="admin-error text-xs">
              {data.error}
            </span>
          ) : null
        )}
      </div>
    </li>
  );
}

export default function AdminAppreciations({ loaderData: d }: Route.ComponentProps) {
  const byMonth = new Map<string, Appreciation[]>();
  for (const a of d.appreciations) {
    const key = monthKey(a.createdAt);
    byMonth.set(key, [...(byMonth.get(key) ?? []), a]);
  }

  return (
    <>
      {d.pendingGems.length > 0 && (
        <section className={panel}>
          <h2 className={heading}>Pending gems</h2>
          <p className="mb-3 text-sm text-[color:var(--muted)]">
            Crafted by senders. Approving adds them to the shared gem picker on{" "}
            <a href="/appreciate" className="hover:underline">
              /appreciate
            </a>
            .
          </p>
          <ul>
            {d.pendingGems.map((gem) => (
              <PendingGem key={gem.id} gem={gem} />
            ))}
          </ul>
        </section>
      )}

      {byMonth.size === 0 && (
        <section className={panel}>
          <h2 className={heading}>Appreciations</h2>
          <p className="text-sm text-[color:var(--muted)]">
            None yet. Researchers send them from{" "}
            <a href="/appreciate" className="hover:underline">
              /appreciate
            </a>
            .
          </p>
        </section>
      )}

      {[...byMonth.entries()].map(([month, items]) => (
        <section key={month} className={panel}>
          <h2 className={heading}>
            {monthLabel(month)}{" "}
            <span className="text-sm font-normal text-[color:var(--muted)]">
              · {items.length} {items.length === 1 ? "appreciation" : "appreciations"}
            </span>
          </h2>
          <ul className="mt-2">
            {items.map((a) => (
              <AppreciationRow key={a.id} appreciation={a} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
