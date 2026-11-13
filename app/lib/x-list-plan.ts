// Pure planning logic for the X list sync: given the researchers table and the
// X list, work out what to change on each side. No I/O, so it can be tested
// on its own.
//
// Each researcher has `on_x_list` (what the app wants) and `x_list_seen`
// (what X said when we last looked or wrote). Comparing both sides against
// `x_list_seen` says which side changed:
//   app same, X changed      → take X's value
//   app changed, X same      → write the app's value to X
//   both changed (app = X)   → nothing to do
// When `x_list_seen` is NULL (never synced), neither side is assumed to have
// removed anyone: whoever is on either side ends up on both.

export interface XMember {
  id: string;
  username: string;
  name: string;
}

export interface SyncResearcher {
  id: number;
  name: string;
  handle: string;
  x_user_id: string | null;
  on_x_list: boolean;
  x_list_seen: boolean | null;
}

export interface PlanPerson {
  researcherId: number;
  name: string;
  handle: string;
}

export interface SyncPlan {
  addToX: (PlanPerson & { userId: string })[];
  removeFromX: (PlanPerson & { userId: string })[];
  markInApp: PlanPerson[];
  unmarkInApp: PlanPerson[];
  cannotAdd: (PlanPerson & { reason: string })[];
  create: { name: string; handle: string; userId: string }[];
  link: (PlanPerson & { userId: string })[];
  handleChanges: (PlanPerson & { to: string })[];
  conflicts: (PlanPerson & { member: XMember })[];
  /** Researchers whose stored X id is missing or stale. */
  xUserIds: { researcherId: number; userId: string }[];
  /** Whether each researcher is on the X list right now, before any writes. */
  onXNow: Record<number, boolean>;
}

export function bareHandle(handle: string | null | undefined) {
  return (handle ?? "").trim().replace(/^@/, "").toLowerCase();
}

function normalName(name: string | null | undefined) {
  return (name ?? "").normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

/** Match X list members to researchers: by X id first, then by handle. */
export function matchMembers(researchers: SyncResearcher[], members: XMember[]) {
  const byXId = new Map<string, SyncResearcher>();
  const byHandle = new Map<string, SyncResearcher>();
  for (const r of researchers) {
    if (r.x_user_id) byXId.set(r.x_user_id, r);
    const h = bareHandle(r.handle);
    if (h) byHandle.set(h, r);
  }
  const matches = new Map<number, XMember>();
  const unmatched: XMember[] = [];
  const conflicts: SyncPlan["conflicts"] = [];
  for (const m of members) {
    let r = byXId.get(m.id);
    if (!r) {
      const candidate = byHandle.get(m.username.toLowerCase());
      if (candidate && candidate.x_user_id && candidate.x_user_id !== m.id) {
        // The handle now belongs to a different X account than the one we
        // recorded. Don't guess; report it.
        conflicts.push({
          researcherId: candidate.id,
          name: candidate.name,
          handle: candidate.handle,
          member: m,
        });
        continue;
      }
      r = candidate;
    }
    if (r) matches.set(r.id, m);
    else unmatched.push(m);
  }
  return { matches, unmatched, conflicts };
}

/** Usernames (no @) of researchers the app wants on the list whose X id we don't know yet. */
export function usernamesToLookUp(researchers: SyncResearcher[], matches: Map<number, XMember>) {
  return researchers
    .filter((r) => r.on_x_list && !matches.has(r.id) && !r.x_user_id && bareHandle(r.handle))
    .map((r) => bareHandle(r.handle));
}

/**
 * @param lookedUp users resolved from usernamesToLookUp()
 */
export function buildPlan(
  researchers: SyncResearcher[],
  members: XMember[],
  lookedUp: XMember[] = []
): SyncPlan {
  const { matches, unmatched, conflicts } = matchMembers(researchers, members);
  const lookedUpByHandle = new Map(lookedUp.map((u) => [u.username.toLowerCase(), u]));

  const plan: SyncPlan = {
    addToX: [],
    removeFromX: [],
    markInApp: [],
    unmarkInApp: [],
    cannotAdd: [],
    create: [],
    link: [],
    handleChanges: [],
    conflicts,
    xUserIds: [],
    onXNow: {},
  };

  for (const r of researchers) {
    const member = matches.get(r.id);
    const onX = Boolean(member);
    plan.onXNow[r.id] = onX;
    const person = { researcherId: r.id, name: r.name, handle: r.handle };

    const userId =
      member?.id ?? r.x_user_id ?? lookedUpByHandle.get(bareHandle(r.handle))?.id ?? null;
    if (userId && userId !== r.x_user_id) plan.xUserIds.push({ researcherId: r.id, userId });

    if (member && bareHandle(r.handle) !== member.username.toLowerCase()) {
      plan.handleChanges.push({ ...person, to: "@" + member.username });
    }

    const app = Boolean(r.on_x_list);
    if (app === onX) continue;

    const writeToX =
      r.x_list_seen === null
        ? app // never synced: union, so only ever add
        : app !== r.x_list_seen; // the app side changed since we last looked

    if (writeToX) {
      if (app) {
        if (userId) plan.addToX.push({ ...person, userId });
        else
          plan.cannotAdd.push({
            ...person,
            reason: bareHandle(r.handle) ? "handle not found on X" : "no handle",
          });
      } else if (userId) {
        plan.removeFromX.push({ ...person, userId });
      }
    } else if (onX) {
      plan.markInApp.push(person);
    } else {
      plan.unmarkInApp.push(person);
    }
  }

  // X members with no researcher: link to a handle-less person with the same
  // name if there's exactly one, otherwise create a new person.
  const handleless = new Map<string, SyncResearcher | null>();
  for (const r of researchers) {
    if (bareHandle(r.handle)) continue;
    const key = normalName(r.name);
    handleless.set(key, handleless.has(key) ? null : r);
  }
  const linked = new Set<number>();
  for (const m of unmatched) {
    const r = handleless.get(normalName(m.name));
    if (r && !linked.has(r.id)) {
      linked.add(r.id);
      plan.onXNow[r.id] = true;
      plan.link.push({ researcherId: r.id, name: r.name, handle: "@" + m.username, userId: m.id });
    } else {
      plan.create.push({ name: m.name.trim() || m.username, handle: "@" + m.username, userId: m.id });
    }
  }
  plan.cannotAdd = plan.cannotAdd.filter((p) => !linked.has(p.researcherId));
  plan.markInApp = plan.markInApp.filter((p) => !linked.has(p.researcherId));

  return plan;
}

export function planChangeCount(plan: SyncPlan) {
  return (
    plan.addToX.length +
    plan.removeFromX.length +
    plan.markInApp.length +
    plan.unmarkInApp.length +
    plan.create.length +
    plan.link.length
  );
}
