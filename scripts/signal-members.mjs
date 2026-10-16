// Read-only: lists the members of a Signal group from Signal Desktop's local
// database on this Mac, next to the matching researchers and whether they're
// ticked as Signal members. Changes nothing in Signal or the database.
//
//   node scripts/signal-members.mjs                    list groups
//   node scripts/signal-members.mjs "AGI Institutions" list that group's members
//   node scripts/signal-members.mjs "AGI Institutions" --json
//       the same members as JSON, with each one's Signal service id (ACI),
//       for filling researchers.signal_name / signal_aci
//
// macOS only. Needs the `sqlcipher` command (brew install sqlcipher) and asks
// the Keychain once for "Signal Safe Storage", the key Signal Desktop uses to
// encrypt its database. POSTGRES_URL is optional; without it there's no
// comparison with the researchers table.
import "dotenv/config";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SIGNAL_DIR = path.join(os.homedir(), "Library/Application Support/Signal");
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const groupQuery = args.find((a) => !a.startsWith("--"));

function databaseKey() {
  const config = JSON.parse(fs.readFileSync(path.join(SIGNAL_DIR, "config.json"), "utf8"));
  if (config.key) return config.key; // older Signal Desktop: plain key
  if (!config.encryptedKey) throw new Error("No database key in Signal's config.json.");
  // Electron safeStorage on macOS: a Keychain password, PBKDF2 to an AES key,
  // then AES-128-CBC with a fixed IV over the "v10"-prefixed ciphertext.
  const password = execFileSync(
    "security",
    ["find-generic-password", "-w", "-s", "Signal Safe Storage"],
    { encoding: "utf8" }
  ).trim();
  const aesKey = crypto.pbkdf2Sync(password, "saltysalt", 1003, 16, "sha1");
  const encrypted = Buffer.from(config.encryptedKey, "hex");
  if (encrypted.subarray(0, 3).toString() !== "v10") {
    throw new Error("Unexpected format for Signal's encrypted key.");
  }
  const decipher = crypto.createDecipheriv("aes-128-cbc", aesKey, Buffer.alloc(16, " "));
  return Buffer.concat([decipher.update(encrypted.subarray(3)), decipher.final()]).toString("utf8");
}

/** Run a query against a private copy of Signal's database, so Signal can keep running. */
function query(key, sql) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "signal-read-"));
  try {
    for (const suffix of ["", "-wal", "-shm"]) {
      const file = path.join(SIGNAL_DIR, "sql", "db.sqlite" + suffix);
      if (fs.existsSync(file)) fs.copyFileSync(file, path.join(tmp, "db.sqlite" + suffix));
    }
    const out = execFileSync("sqlcipher", [path.join(tmp, "db.sqlite")], {
      input: `PRAGMA key = "x'${key}'";\n.mode json\n${sql};\n`,
      encoding: "utf8",
      maxBuffer: 256 * 1024 * 1024,
    });
    // The PRAGMA prints "ok" on its own line before the JSON.
    const json = out.slice(out.indexOf("["));
    return json.trim() ? JSON.parse(json) : [];
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const normal = (s) =>
  (s ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function loadResearchers() {
  if (!process.env.POSTGRES_URL) return null;
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.POSTGRES_URL);
  return sql`
    SELECT r.id, r.name, r.handle, r.commitment,
      EXISTS (
        SELECT 1 FROM researcher_involvements ri
        JOIN involvements i ON i.id = ri.involvement_id
        WHERE ri.researcher_id = r.id AND i.kind = 'signal'
      ) AS on_signal
    FROM researchers r ORDER BY lower(r.name)
  `;
}

/** Researchers whose name shares the first and last word, or all words, with a Signal name. */
function candidates(names, researchers) {
  const found = new Map();
  for (const n of names.map(normal).filter(Boolean)) {
    const words = n.split(" ");
    for (const r of researchers) {
      const rn = normal(r.name);
      const rw = rn.split(" ");
      const same =
        rn === n ||
        (words.length > 1 && rw[0] === words[0] && rw.at(-1) === words.at(-1)) ||
        (words.length === 1 && rw.includes(words[0]) && words[0].length > 3);
      if (same) found.set(r.id, r);
    }
  }
  return [...found.values()];
}

const key = databaseKey();
const groups = query(
  key,
  "SELECT id, name, json FROM conversations WHERE type = 'group' ORDER BY active_at DESC"
).map((g) => ({ ...g, json: JSON.parse(g.json) }));

if (!groupQuery) {
  console.log("Signal groups (pass one's name to list its members):");
  for (const g of groups) {
    const count = (g.json.membersV2 ?? g.json.members ?? []).length;
    console.log(`  ${g.name ?? g.json.name ?? "(unnamed)"} (${count} members)`);
  }
  process.exit(0);
}

const matching = groups.filter((g) => (g.name ?? g.json.name ?? "").toLowerCase() === groupQuery.toLowerCase());
if (matching.length !== 1) {
  console.error(
    matching.length ? `More than one group is called "${groupQuery}".` : `No group called "${groupQuery}".`
  );
  process.exit(1);
}
const group = matching[0];
const memberIds = new Set(
  (group.json.membersV2 ?? []).map((m) => m.aci ?? m.serviceId ?? m.uuid).filter(Boolean)
);
const privates = query(key, "SELECT json FROM conversations WHERE type = 'private'").map((c) =>
  JSON.parse(c.json)
);
const members = privates
  .filter((c) => memberIds.has(c.serviceId) || memberIds.has(c.uuid) || memberIds.has(c.aci))
  .map((c) => ({
    aci: c.serviceId ?? c.uuid ?? c.aci ?? null,
    contactName: c.name ?? "",
    profileName: [c.profileName, c.profileFamilyName].filter(Boolean).join(" "),
    username: c.username ?? "",
    isMe: c.id === group.json.ourConversationId,
  }));
const missing = memberIds.size - members.length;
if (asJson) {
  console.log(
    JSON.stringify(
      members.map(({ aci, contactName, profileName, username }) => ({ aci, contactName, profileName, username })),
      null,
      2
    )
  );
  process.exit(0);
}

const researchers = await loadResearchers();
console.log(`# ${group.name ?? group.json.name}: ${memberIds.size} members\n`);
if (missing > 0) console.log(`(${missing} members have no contact record and are left out.)\n`);
console.log("| Signal contact name | Signal profile name | Signal username | Possible researchers |");
console.log("|---|---|---|---|");
const matchedIds = new Set();
for (const m of members.sort((a, b) =>
  (a.contactName || a.profileName).localeCompare(b.contactName || b.profileName)
)) {
  let matches = "";
  if (researchers) {
    const found = candidates([m.contactName, m.profileName], researchers);
    found.forEach((r) => matchedIds.add(r.id));
    matches = found
      .map((r) => `${r.name} (#${r.id}${r.on_signal ? ", ticked" : ", not ticked"})`)
      .join("; ") || "none";
  }
  console.log(`| ${m.contactName} | ${m.profileName} | ${m.username} | ${matches} |`);
}
if (researchers) {
  const tickedUnmatched = researchers.filter((r) => r.on_signal && !matchedIds.has(r.id));
  console.log(`\n## Ticked as Signal in the app, no name match in the group (${tickedUnmatched.length})\n`);
  for (const r of tickedUnmatched) console.log(`- ${r.name} (#${r.id}) ${r.handle}`);
}
