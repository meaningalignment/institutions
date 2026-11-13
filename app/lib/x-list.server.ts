// Keeps the People tab and the X list (X_LIST_ID) in step, for the admin.
// Writes go out as the list owner's X account whichever admin makes them.
// Server-only: every caller must require an admin session first.
import { getSql } from "./db.server";
import { createXClient, xConfig, XApiError, type XClient } from "./x.server";
import {
  bareHandle,
  buildPlan,
  matchMembers,
  usernamesToLookUp,
  type SyncPlan,
  type SyncResearcher,
} from "./x-list-plan";

export const X_LIST_URL = (listId: string) => `https://x.com/i/lists/${listId}`;

function requireX(): { listId: string; x: XClient } {
  const config = xConfig();
  if (!config) {
    throw new Error("X isn't connected. Set the X_* environment variables (see .env.example).");
  }
  return { listId: config.listId, x: createXClient(config.credentials) };
}

async function loadResearchers(): Promise<SyncResearcher[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, handle, x_user_id, on_x_list, x_list_seen
    FROM researchers
    ORDER BY lower(COALESCE(name, '')), name
  `) as any[];
  return rows.map((r) => ({
    id: r.id,
    name: r.name ?? "",
    handle: r.handle ?? "",
    x_user_id: r.x_user_id ?? null,
    on_x_list: Boolean(r.on_x_list),
    x_list_seen: r.x_list_seen ?? null,
  }));
}

export async function getXListStatus() {
  const config = xConfig();
  const sql = getSql();
  const rows = (await sql`
    SELECT
      count(*) FILTER (WHERE on_x_list)::integer AS ticked,
      count(*) FILTER (WHERE x_list_seen IS NOT NULL)::integer AS seen
    FROM researchers
  `) as any[];
  return {
    connected: Boolean(config),
    listUrl: config ? X_LIST_URL(config.listId) : null,
    ticked: rows[0]?.ticked ?? 0,
    neverSynced: (rows[0]?.seen ?? 0) === 0,
  };
}

/** Read the X list and work out both sides' changes. Reads are billed per member. */
export async function planXListSync(): Promise<{ plan: SyncPlan; listSize: number }> {
  const { listId, x } = requireX();
  const researchers = await loadResearchers();
  const members = await x.listMembers(listId);
  const { matches } = matchMembers(researchers, members);
  const toLookUp = usernamesToLookUp(researchers, matches);
  const lookedUp = toLookUp.length ? await x.lookupUsernames(toLookUp) : [];
  return { plan: buildPlan(researchers, members, lookedUp), listSize: members.length };
}

/**
 * Apply a plan from planXListSync(). X first: a failed X write leaves
 * x_list_seen alone, so the next sync offers it again.
 * Returns one line per change made or failed.
 */
export async function applyXListSync(plan: SyncPlan): Promise<string[]> {
  const { listId, x } = requireX();
  const sql = getSql();
  const log: string[] = [];
  const xResults = new Map<number, boolean>();

  let stopped = false;
  for (const [op, people] of [
    ["add", plan.addToX],
    ["remove", plan.removeFromX],
  ] as const) {
    for (const p of people) {
      if (stopped) break;
      try {
        if (op === "add") await x.addMember(listId, p.userId);
        else await x.removeMember(listId, p.userId);
        xResults.set(p.researcherId, op === "add");
        log.push(`${op === "add" ? "Added to" : "Removed from"} X list: ${p.name}`);
      } catch (error) {
        log.push(`Couldn't ${op} ${p.name} on X. ${(error as Error).message}`);
        if (error instanceof XApiError && [401, 403, 429].includes(error.status)) {
          stopped = true;
          log.push("Stopped writing to X. Sync again later to finish.");
        }
      }
    }
  }

  for (const p of plan.markInApp) {
    await sql`UPDATE researchers SET on_x_list = true WHERE id = ${p.researcherId}`;
    log.push(`Ticked in the app: ${p.name}`);
  }
  for (const p of plan.unmarkInApp) {
    await sql`UPDATE researchers SET on_x_list = false WHERE id = ${p.researcherId}`;
    log.push(`Unticked in the app: ${p.name}`);
  }
  for (const p of plan.link) {
    const updated = (await sql`
      UPDATE researchers
      SET handle = ${p.handle}, x_user_id = ${p.userId}, on_x_list = true, x_list_seen = true
      WHERE id = ${p.researcherId} AND handle = ''
      RETURNING id
    `) as unknown[];
    log.push(
      updated.length
        ? `Gave ${p.name} the handle ${p.handle}`
        : `Skipped ${p.name}: they got a handle in the meantime`
    );
  }
  for (const p of plan.create) {
    try {
      await sql`
        INSERT INTO researchers (name, handle, virtues, x_user_id, on_x_list, x_list_seen)
        VALUES (${p.name}, ${p.handle}, '{}'::jsonb, ${p.userId}, true, true)
      `;
      log.push(`Created ${p.name} (${p.handle})`);
    } catch (error) {
      log.push(`Couldn't create ${p.name} (${p.handle}). ${(error as Error).message}`);
    }
  }

  await recordState(plan, xResults, log);
  return log;
}

/** Save resolved X ids and set x_list_seen to what X looks like now. */
async function recordState(plan: SyncPlan, xResults: Map<number, boolean>, log: string[]) {
  const sql = getSql();
  for (const { researcherId, userId } of plan.xUserIds) {
    try {
      await sql`UPDATE researchers SET x_user_id = ${userId} WHERE id = ${researcherId}`;
    } catch (error) {
      log.push(`Couldn't save the X id for researcher ${researcherId}. ${(error as Error).message}`);
    }
  }
  const ids: number[] = [];
  const seen: boolean[] = [];
  for (const [id, onX] of Object.entries(plan.onXNow)) {
    const researcherId = Number(id);
    ids.push(researcherId);
    seen.push(xResults.has(researcherId) ? xResults.get(researcherId)! : onX);
  }
  await sql`
    UPDATE researchers r SET x_list_seen = v.seen
    FROM unnest(${ids}::integer[], ${seen}::boolean[]) AS v(id, seen)
    WHERE r.id = v.id AND r.x_list_seen IS DISTINCT FROM v.seen
  `;
}

/**
 * The People tab checkbox. When X is connected the change goes to X straight
 * away and is saved only if X accepts it; otherwise it's recorded and the
 * next sync carries it over.
 */
export async function setOnXList(researcherId: number, onXList: boolean) {
  const sql = getSql();
  const config = xConfig();
  if (!config) {
    await sql`UPDATE researchers SET on_x_list = ${onXList} WHERE id = ${researcherId}`;
    return;
  }
  const { listId, x } = requireX();
  const rows = (await sql`
    SELECT handle, x_user_id FROM researchers WHERE id = ${researcherId}
  `) as any[];
  if (!rows.length) throw new Error("Researcher not found.");
  let userId: string | null = rows[0].x_user_id ?? null;
  const handle = bareHandle(rows[0].handle);

  if (!userId && handle) {
    const [user] = await x.lookupUsernames([handle]);
    if (!user && onXList) throw new Error(`@${handle} wasn't found on X.`);
    userId = user?.id ?? null;
  }
  if (onXList) {
    if (!userId) throw new Error("Add an X handle first.");
    await x.addMember(listId, userId);
  } else if (userId) {
    await x.removeMember(listId, userId);
  }
  await sql`
    UPDATE researchers
    SET on_x_list = ${onXList}, x_list_seen = ${userId ? onXList : null}, x_user_id = ${userId}
    WHERE id = ${researcherId}
  `;
}
