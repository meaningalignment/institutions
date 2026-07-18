import { Form, useSearchParams } from "react-router";
import type { Route } from "./+types/admin";
import {
  getResearchersList,
  getInvolvements,
  getCanonicalWorks,
  getResearcherAdminDetail,
  setAdvisor,
  saveInvolvements,
  addPaper,
  removePaper,
  createPaper,
} from "../lib/admin.server";
import { SITE_NAME } from "../lib/constants";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Admin — ${SITE_NAME}` }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const rParam = url.searchParams.get("r");
  const researcherId = rParam ? Number(rParam) : null;

  const [researchers, involvements, works] = await Promise.all([
    getResearchersList(),
    getInvolvements(),
    getCanonicalWorks(),
  ]);
  const detail =
    researcherId != null && !Number.isNaN(researcherId)
      ? await getResearcherAdminDetail(researcherId)
      : null;

  return { researchers, involvements, works, researcherId, detail };
}

export async function action({ request }: Route.ActionArgs) {
  const fd = await request.formData();
  const intent = String(fd.get("intent") || "");
  const researcherId = Number(fd.get("researcherId"));
  if (!researcherId) return { ok: false, error: "missing researcher" };

  switch (intent) {
    case "set-advisor":
      await setAdvisor(researcherId, fd.get("isAdvisor") ? String(fd.get("advisesAbout") || "") : null);
      break;
    case "save-involvements":
      await saveInvolvements(researcherId, fd.getAll("involvementId").map((v) => Number(v)));
      break;
    case "add-paper":
      await addPaper(researcherId, Number(fd.get("canonicalWorkId")));
      break;
    case "remove-paper":
      await removePaper(researcherId, Number(fd.get("canonicalWorkId")));
      break;
    case "create-paper":
      await createPaper(researcherId, String(fd.get("title") || ""), String(fd.get("url") || ""));
      break;
    default:
      return { ok: false, error: "unknown intent" };
  }
  return { ok: true };
}

const panel = "rounded-xl border border-[color:var(--line)] bg-[var(--card)] p-5 mb-6";
const heading = "mb-3 text-lg font-semibold text-[color:var(--ink)]";
const input =
  "rounded-md border border-[color:var(--line-strong)] bg-white px-2.5 py-1.5 text-sm text-[color:var(--ink)]";
const btn =
  "rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--accent-dark)]";
const btnGhost =
  "rounded-md border border-[color:var(--line-strong)] px-2.5 py-1 text-xs text-[color:var(--muted)] hover:bg-[var(--wash)]";

export default function Admin({ loaderData: d }: Route.ComponentProps) {
  const [, setSearchParams] = useSearchParams();
  const selected = d.researchers.find((r) => r.id === d.researcherId);
  const paperSet = new Set(d.detail?.paperIds ?? []);
  const currentPapers = d.works.filter((w) => paperSet.has(w.id));
  const availablePapers = d.works.filter((w) => !paperSet.has(w.id));

  return (
    <div className="w-full max-w-[840px]">
      <h1
        className="mb-1 text-[color:var(--ink)]"
        style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30 }}
      >
        Admin
      </h1>
      <p className="mb-6 text-sm text-[color:var(--muted)]">
        Configure scouts, involvements, and papers for a researcher.
      </p>

      {/* Researcher picker */}
      <div className={panel}>
        <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">Researcher</label>
        <select
          className={input + " w-full"}
          value={d.researcherId ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            setSearchParams(v ? { r: v } : {});
          }}
        >
          <option value="">— select a researcher —</option>
          {d.researchers.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} {r.handle ? `(${r.handle})` : ""}
            </option>
          ))}
        </select>
      </div>

      {!selected && (
        <p className="text-sm text-[color:var(--muted)]">Select a researcher to edit their record.</p>
      )}

      {selected && d.detail && (
        <>
          {/* Scout / Advisor */}
          <div className={panel}>
            <div className={heading}>Scout / Advisor</div>
            <Form method="post" className="flex flex-wrap items-center gap-3">
              <input type="hidden" name="intent" value="set-advisor" />
              <input type="hidden" name="researcherId" value={selected.id} />
              <label className="flex items-center gap-2 text-sm text-[color:var(--text)]">
                <input type="checkbox" name="isAdvisor" defaultChecked={!!d.detail.advisesAbout} />
                Is a scout / advisor
              </label>
              <input
                className={input + " min-w-[280px] flex-1"}
                name="advisesAbout"
                defaultValue={d.detail.advisesAbout ?? ""}
                placeholder="what they scout for (e.g. modeling norms)"
              />
              <button className={btn} type="submit">
                Save
              </button>
            </Form>
          </div>

          {/* Involvements */}
          <div className={panel}>
            <div className={heading}>Involvements</div>
            <Form method="post">
              <input type="hidden" name="intent" value="save-involvements" />
              <input type="hidden" name="researcherId" value={selected.id} />
              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                {d.involvements.map((inv) => (
                  <label
                    key={inv.id}
                    className="flex items-start gap-2 text-sm text-[color:var(--text)]"
                  >
                    <input
                      type="checkbox"
                      name="involvementId"
                      value={inv.id}
                      defaultChecked={d.detail!.involvementIds.includes(inv.id)}
                      className="mt-0.5"
                    />
                    <span>
                      <span className="text-[color:var(--faint)]">{inv.kind}</span> {inv.name}
                    </span>
                  </label>
                ))}
              </div>
              <button className={btn} type="submit">
                Save involvements
              </button>
            </Form>
          </div>

          {/* Papers */}
          <div className={panel}>
            <div className={heading}>Papers</div>

            {currentPapers.length > 0 ? (
              <ul className="mb-4 flex flex-col gap-1.5">
                {currentPapers.map((w) => (
                  <li key={w.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[color:var(--text)]">
                      {w.url ? (
                        <a
                          href={w.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[color:var(--accent)] hover:underline"
                        >
                          {w.title}
                        </a>
                      ) : (
                        w.title
                      )}
                    </span>
                    <Form method="post">
                      <input type="hidden" name="intent" value="remove-paper" />
                      <input type="hidden" name="researcherId" value={selected.id} />
                      <input type="hidden" name="canonicalWorkId" value={w.id} />
                      <button className={btnGhost} type="submit">
                        Remove
                      </button>
                    </Form>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-[color:var(--muted)]">No papers associated yet.</p>
            )}

            <div className="mb-4 border-t border-[color:var(--line)] pt-4">
              <div className="mb-2 text-sm font-medium text-[color:var(--ink)]">Add existing paper</div>
              <Form method="post" className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="intent" value="add-paper" />
                <input type="hidden" name="researcherId" value={selected.id} />
                <select className={input + " min-w-[320px] flex-1"} name="canonicalWorkId" required>
                  <option value="">— select a paper —</option>
                  {availablePapers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title}
                    </option>
                  ))}
                </select>
                <button className={btn} type="submit">
                  Add
                </button>
              </Form>
            </div>

            <div className="border-t border-[color:var(--line)] pt-4">
              <div className="mb-2 text-sm font-medium text-[color:var(--ink)]">Create new paper</div>
              <Form method="post" className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="intent" value="create-paper" />
                <input type="hidden" name="researcherId" value={selected.id} />
                <input className={input + " min-w-[240px] flex-1"} name="title" placeholder="Title" required />
                <input className={input + " min-w-[240px] flex-1"} name="url" placeholder="URL (optional)" />
                <button className={btn} type="submit">
                  Create & associate
                </button>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
