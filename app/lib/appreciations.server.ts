import { getSql } from "./db.server";
import { monthKey, slugify } from "./gems";

export interface Gem {
  id: number;
  slug: string;
  name: string;
  description: string;
  status: "approved" | "pending";
  createdBy: number | null;
  timesGiven: number;
}

export interface GemRef {
  id: number;
  slug: string;
  name: string;
  description: string;
  status: "approved" | "pending";
}

export interface PersonRef {
  id: number;
  name: string;
  handle: string;
}

/** Public view of an appreciation: who, when, which approved gems. No note, no sender. */
export interface PublicAppreciation {
  id: number;
  createdAt: string;
  recipient: PersonRef;
  gems: GemRef[];
}

export interface Appreciation {
  id: number;
  createdAt: string;
  note: string;
  sender: PersonRef | null;
  recipient: PersonRef;
  gems: GemRef[];
  pickedMonth: string | null;
  flowersSentAt: string | null;
}

function toGemRef(row: any): GemRef {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    status: row.status,
  };
}

/** Approved gems, plus pending ones created by `viewerId` (so they can reuse their own). */
export async function getGems(viewerId?: number | null): Promise<Gem[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT g.id, g.slug, g.name, g.description, g.status, g.created_by,
      (
        SELECT count(*)::integer FROM institutions_appreciation_gems ag
        WHERE ag.gem_id = g.id
      ) AS times_given
    FROM institutions_gems g
    WHERE g.status = 'approved'
      OR (${viewerId ?? null}::integer IS NOT NULL AND g.created_by = ${viewerId ?? null})
    ORDER BY g.status = 'pending', g.created_at, g.id
  `) as any[];
  return rows.map((row) => ({
    ...toGemRef(row),
    createdBy: row.created_by,
    timesGiven: row.times_given,
  }));
}

export async function getPendingGems(): Promise<(GemRef & { createdByName: string | null })[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT g.id, g.slug, g.name, g.description, g.status, r.name AS created_by_name
    FROM institutions_gems g
    LEFT JOIN researchers r ON r.id = g.created_by
    WHERE g.status = 'pending'
    ORDER BY g.created_at, g.id
  `) as any[];
  return rows.map((row) => ({ ...toGemRef(row), createdByName: row.created_by_name }));
}

export async function createAppreciation({
  senderId,
  recipientId,
  note,
  gemIds,
  newGems,
}: {
  senderId: number;
  recipientId: number;
  note: string;
  gemIds: number[];
  newGems: { name: string; description: string }[];
}) {
  const sql = getSql();
  const trimmedNote = note.trim();
  if (!trimmedNote) throw new Error("Write a note.");
  if (recipientId === senderId) throw new Error("Choose someone other than yourself.");
  const recipient = (await sql`SELECT id FROM researchers WHERE id = ${recipientId}`) as any[];
  if (!recipient.length) throw new Error("Choose a researcher.");

  // Existing gems must be approved, or pending ones the sender crafted earlier.
  const allowed = gemIds.length
    ? ((await sql`
        SELECT id FROM institutions_gems
        WHERE id = ANY(${gemIds}::integer[])
          AND (status = 'approved' OR created_by = ${senderId})
      `) as { id: number }[])
    : [];
  const ids = new Set(allowed.map((row) => row.id));

  for (const gem of newGems) {
    const name = gem.name.trim();
    const slug = slugify(name);
    if (!name || !slug) continue;
    // Reuse an existing gem with the same slug rather than duplicating it.
    const rows = (await sql`
      INSERT INTO institutions_gems (slug, name, description, status, created_by)
      VALUES (${slug}, ${name}, ${gem.description.trim()}, 'pending', ${senderId})
      ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id
    `) as { id: number }[];
    ids.add(rows[0].id);
  }

  const inserted = (await sql`
    INSERT INTO institutions_appreciations (sender_id, recipient_id, note)
    VALUES (${senderId}, ${recipientId}, ${trimmedNote})
    RETURNING id
  `) as { id: number }[];
  const appreciationId = inserted[0].id;
  if (ids.size) {
    await sql`
      INSERT INTO institutions_appreciation_gems (appreciation_id, gem_id)
      SELECT ${appreciationId}, unnest(${[...ids]}::integer[])
      ON CONFLICT DO NOTHING
    `;
  }
  return appreciationId;
}

async function gemsByAppreciation(ids: number[], approvedOnly: boolean) {
  const map = new Map<number, GemRef[]>();
  if (!ids.length) return map;
  const sql = getSql();
  const rows = (await sql`
    SELECT ag.appreciation_id, g.id, g.slug, g.name, g.description, g.status
    FROM institutions_appreciation_gems ag
    JOIN institutions_gems g ON g.id = ag.gem_id
    WHERE ag.appreciation_id = ANY(${ids}::integer[])
      AND (${!approvedOnly} OR g.status = 'approved')
    ORDER BY g.status = 'pending', g.created_at, g.id
  `) as any[];
  for (const row of rows) {
    const list = map.get(row.appreciation_id) ?? [];
    list.push(toGemRef(row));
    map.set(row.appreciation_id, list);
  }
  return map;
}

function iso(value: unknown) {
  if (value == null) return null;
  return value instanceof Date ? value.toISOString() : String(value);
}

function person(id: number | null, name: string | null, handle: string | null): PersonRef | null {
  return id == null ? null : { id, name: name ?? "", handle: handle ?? "" };
}

export async function getPublicAppreciations(limit = 100): Promise<PublicAppreciation[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT a.id, a.created_at, r.id AS recipient_id, r.name AS recipient_name,
      r.handle AS recipient_handle
    FROM institutions_appreciations a
    JOIN researchers r ON r.id = a.recipient_id
    ORDER BY a.created_at DESC, a.id DESC
    LIMIT ${limit}
  `) as any[];
  const gems = await gemsByAppreciation(rows.map((row) => row.id), true);
  return rows.map((row) => ({
    id: row.id,
    createdAt: iso(row.created_at)!,
    recipient: person(row.recipient_id, row.recipient_name, row.recipient_handle)!,
    gems: gems.get(row.id) ?? [],
  }));
}

async function getAppreciations(
  filter: { recipientId?: number; senderId?: number } = {}
): Promise<Appreciation[]> {
  const sql = getSql();
  const recipientId = filter.recipientId ?? null;
  const senderId = filter.senderId ?? null;
  const rows = (await sql`
    SELECT a.id, a.created_at, a.note, a.picked_month::text AS picked_month, a.flowers_sent_at,
      s.id AS sender_id, s.name AS sender_name, s.handle AS sender_handle,
      r.id AS recipient_id, r.name AS recipient_name, r.handle AS recipient_handle
    FROM institutions_appreciations a
    JOIN researchers r ON r.id = a.recipient_id
    LEFT JOIN researchers s ON s.id = a.sender_id
    WHERE (${recipientId}::integer IS NULL OR a.recipient_id = ${recipientId})
      AND (${senderId}::integer IS NULL OR a.sender_id = ${senderId})
    ORDER BY a.created_at DESC, a.id DESC
  `) as any[];
  const gems = await gemsByAppreciation(rows.map((row) => row.id), false);
  return rows.map((row) => ({
    id: row.id,
    createdAt: iso(row.created_at)!,
    note: row.note,
    sender: person(row.sender_id, row.sender_name, row.sender_handle),
    recipient: person(row.recipient_id, row.recipient_name, row.recipient_handle)!,
    gems: gems.get(row.id) ?? [],
    pickedMonth: row.picked_month,
    flowersSentAt: iso(row.flowers_sent_at),
  }));
}

export const getReceived = (researcherId: number) =>
  getAppreciations({ recipientId: researcherId });
export const getSent = (researcherId: number) => getAppreciations({ senderId: researcherId });
export const getAllAppreciations = () => getAppreciations();

/** Mark an appreciation as the pick for its month, replacing any earlier pick. */
export async function setPick(appreciationId: number, picked: boolean) {
  const sql = getSql();
  if (!picked) {
    await sql`UPDATE institutions_appreciations SET picked_month = NULL WHERE id = ${appreciationId}`;
    return;
  }
  const rows = (await sql`
    SELECT created_at FROM institutions_appreciations WHERE id = ${appreciationId}
  `) as any[];
  if (!rows.length) throw new Error("Appreciation not found.");
  const month = monthKey(iso(rows[0].created_at)!);
  await sql`
    UPDATE institutions_appreciations SET picked_month = NULL
    WHERE picked_month = ${month}::date AND id <> ${appreciationId}
  `;
  await sql`
    UPDATE institutions_appreciations SET picked_month = ${month}::date
    WHERE id = ${appreciationId}
  `;
}

export async function setFlowersSent(appreciationId: number, sent: boolean) {
  const sql = getSql();
  await sql`
    UPDATE institutions_appreciations
    SET flowers_sent_at = CASE WHEN ${sent} THEN COALESCE(flowers_sent_at, now()) ELSE NULL END
    WHERE id = ${appreciationId}
  `;
}

export async function updateGem(id: number, name: string, description: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("A gem needs a name.");
  const sql = getSql();
  await sql`
    UPDATE institutions_gems SET name = ${trimmed}, description = ${description.trim()}
    WHERE id = ${id}
  `;
}

export async function approveGem(id: number) {
  const sql = getSql();
  await sql`UPDATE institutions_gems SET status = 'approved' WHERE id = ${id}`;
}

/** Delete a pending gem; it is also removed from any appreciation it was attached to. */
export async function rejectGem(id: number) {
  const sql = getSql();
  await sql`DELETE FROM institutions_gems WHERE id = ${id} AND status = 'pending'`;
}
