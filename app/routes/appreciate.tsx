import { Form, Link, useFetcher, useLoaderData } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/appreciate";
import { SITE_NAME } from "../lib/constants";
import { getSignedInResearcher } from "../lib/auth.server";
import { getResearchersList, type AdminResearcher } from "../lib/admin.server";
import {
  type Appreciation,
  createAppreciation,
  getGems,
  getPublicAppreciations,
  getReceived,
  getSent,
} from "../lib/appreciations.server";
import {
  type ActionResult,
  btn,
  btnGhost,
  heading,
  input,
  panel,
  ResearcherPicker,
} from "../components/admin/AdminControls";
import { GemChip, GemGlyph } from "../components/Gem";
import { slugify } from "../lib/gems";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Appreciations — ${SITE_NAME}` }, { name: "robots", content: "noindex" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSignedInResearcher(request);
  const [gems, wall, researchers] = await Promise.all([
    getGems(session?.researcherId),
    getPublicAppreciations(),
    getResearchersList(),
  ]);
  if (!session) {
    return { session: null, gems, wall, researchers, received: [], sent: [] };
  }
  const [received, sent] = await Promise.all([
    getReceived(session.researcherId),
    getSent(session.researcherId),
  ]);
  return {
    session: { researcherId: session.researcherId, name: session.name, handle: session.handle },
    gems,
    wall,
    researchers,
    received,
    sent,
  };
}

function positiveInteger(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  const session = await getSignedInResearcher(request);
  const fd = await request.formData();
  if (fd.get("intent") !== "send") return { ok: false, error: "Unknown action." };
  // Honeypot: bots fill every field; people never see this one.
  if (String(fd.get("website") ?? "")) return { ok: true };

  // Signed-in senders are identified by their session; signed-out senders pick their name.
  const senderId = session?.researcherId ?? positiveInteger(fd.get("senderId"));
  if (!senderId) return { ok: false, error: "Choose who you are." };
  const recipientId = positiveInteger(fd.get("recipientId"));
  if (!recipientId) return { ok: false, error: "Choose who you're appreciating." };
  const gemIds = fd
    .getAll("gemId")
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);
  const names = fd.getAll("newGemName").map(String);
  const descriptions = fd.getAll("newGemDescription").map(String);
  const newGems = names.map((name, i) => ({ name, description: descriptions[i] ?? "" }));

  try {
    await createAppreciation({
      senderId,
      senderVerification: !session ? "none" : session.emailConfirmed ? "email" : "tentative",
      signed: fd.get("signed") === "true",
      recipientId,
      note: String(fd.get("note") ?? ""),
      gemIds,
      newGems,
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "The appreciation could not be sent.",
    };
  }
}

function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function PersonLink({ person }: { person: { name: string; handle: string } }) {
  const handle = person.handle.replace(/^@/, "");
  return handle ? (
    <Link to={`/researchers/${handle}`} className="font-medium text-[color:var(--ink)] hover:underline">
      {person.name}
    </Link>
  ) : (
    <span className="font-medium text-[color:var(--ink)]">{person.name}</span>
  );
}

type DraftGem = { key: number; name: string; description: string };

type PickerGem = { id: number; slug: string; name: string; description: string; status: string };

/** Explains a gem before it's attached; Escape or Cancel closes without attaching. */
function GemModal({
  gem,
  onAttach,
  onClose,
}: {
  gem: PickerGem;
  onAttach: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto w-[min(480px,calc(100vw-2rem))] rounded-none border border-[color:var(--line-strong)] bg-[var(--card)] p-0 text-[color:var(--text)] shadow-2xl backdrop:bg-black/40"
    >
      <div className="p-6">
        <div className="mb-3 flex items-center gap-3">
          <GemGlyph slug={gem.slug} size={32} />
          <h3 className="text-xl font-semibold text-[color:var(--ink)]">{gem.name}</h3>
        </div>
        <p className="mb-2 whitespace-pre-line leading-relaxed">
          {gem.description || "No description yet."}
        </p>
        {gem.status === "pending" && (
          <p className="mb-2 text-xs text-[color:var(--muted)]">
            You crafted this gem; it’s awaiting review by the MAI team.
          </p>
        )}
        <div className="mt-5 flex gap-2">
          <button type="button" className={btn} onClick={onAttach} autoFocus>
            Attach to note
          </button>
          <button type="button" className={btnGhost} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}

function SendForm({
  researchers,
  gems,
  self,
}: {
  researchers: AdminResearcher[];
  gems: PickerGem[];
  /** The signed-in researcher; when null the sender picks their own name. */
  self: { researcherId: number; name: string } | null;
}) {
  const fetcher = useFetcher<ActionResult>();
  const [sender, setSender] = useState<AdminResearcher | null>(null);
  const [recipient, setRecipient] = useState<AdminResearcher | null>(null);
  const [signed, setSigned] = useState(false);
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [drafts, setDrafts] = useState<DraftGem[]>([]);
  const [crafting, setCrafting] = useState(false);
  const [craftName, setCraftName] = useState("");
  const [craftDescription, setCraftDescription] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<PickerGem | null>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      setSentTo(recipient?.name ?? null);
      setRecipient(null);
      setSigned(false);
      setNote("");
      setSelected(new Set());
      setDrafts([]);
      setCrafting(false);
      setResetKey((key) => key + 1);
    }
    // Reset once per successful submission.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data, fetcher.state]);

  function attach(id: number) {
    setSelected((current) => new Set(current).add(id));
  }

  function detach(id: number) {
    setSelected((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }

  function addDraft() {
    const name = craftName.trim();
    if (!name) return;
    const existing = gems.find((gem) => gem.slug === slugify(name));
    if (existing) {
      setSelected((current) => new Set(current).add(existing.id));
    } else if (!drafts.some((draft) => slugify(draft.name) === slugify(name))) {
      setDrafts((current) => [
        ...current,
        { key: Date.now(), name, description: craftDescription.trim() },
      ]);
    }
    setCraftName("");
    setCraftDescription("");
    setCrafting(false);
  }

  const submitting = fetcher.state !== "idle";
  const senderId = self?.researcherId ?? sender?.id ?? null;
  const canSend = !!senderId && !!recipient && note.trim().length > 0 && !submitting;

  return (
    <fetcher.Form method="post" className="space-y-5">
      <input type="hidden" name="intent" value="send" />
      <input type="hidden" name="recipientId" value={recipient?.id ?? ""} />
      {!self && <input type="hidden" name="senderId" value={sender?.id ?? ""} />}
      <input type="hidden" name="signed" value={signed ? "true" : "false"} />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="gemId" value={id} />
      ))}
      {drafts.map((draft) => (
        <span key={draft.key}>
          <input type="hidden" name="newGemName" value={draft.name} />
          <input type="hidden" name="newGemDescription" value={draft.description} />
        </span>
      ))}

      {self ? (
        <div className="text-sm">
          <span className="mb-1.5 block font-medium text-[color:var(--ink)]">From</span>
          <span className="text-[color:var(--text)]">{self.name}</span>
        </div>
      ) : (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
            Who are you?
          </span>
          <ResearcherPicker
            className="max-w-md"
            options={researchers}
            excludeId={recipient?.id}
            onChange={setSender}
            placeholder="Search for your name"
          />
          <span className="mt-1.5 block text-xs text-[color:var(--muted)]">
            Or{" "}
            <Link
              to={`/login?redirectTo=${encodeURIComponent("/appreciate")}`}
              className="text-[color:var(--accent)] hover:underline"
            >
              sign in
            </Link>{" "}
            to see appreciations you’ve received.
          </span>
        </label>
      )}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">To</span>
        <ResearcherPicker
          className="max-w-md"
          options={researchers}
          excludeId={senderId ?? undefined}
          onChange={(next) => {
            setRecipient(next);
            setSentTo(null);
          }}
          placeholder="Search researchers by name"
          resetKey={resetKey}
        />
      </label>


      <div>
        <span className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Gems</span>
        <p className="mb-2.5 text-xs text-[color:var(--muted)]">
          Attach the kinds of excellence you see in them. Click a gem to see what it means.
        </p>
        <div className="flex flex-wrap gap-2">
          {gems.map((gem) => (
            <GemChip
              key={gem.id}
              slug={gem.slug}
              name={gem.name}
              pending={gem.status === "pending"}
              selected={selected.has(gem.id)}
              onClick={() => (selected.has(gem.id) ? detach(gem.id) : setPreviewing(gem))}
            />
          ))}
          {drafts.map((draft) => (
            <GemChip
              key={draft.key}
              slug={slugify(draft.name)}
              name={draft.name}
              description={draft.description}
              pending
              selected
              onClick={() =>
                setDrafts((current) => current.filter((item) => item.key !== draft.key))
              }
            />
          ))}
          {!crafting && (
            <button
              type="button"
              className={btnGhost + " rounded-full"}
              onClick={() => setCrafting(true)}
            >
              + Craft a new gem
            </button>
          )}
        </div>

        {crafting && (
          <div className="mt-3 max-w-xl space-y-2 border border-dashed border-[color:var(--line-strong)] p-3">
            <p className="text-xs text-[color:var(--muted)]">
              Name a virtue that isn’t here yet. It’s attached to this note now and joins the shared
              gem collection once the MAI team has reviewed it.
            </p>
            <input
              className={input + " w-full"}
              value={craftName}
              onChange={(event) => setCraftName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addDraft();
                }
              }}
              placeholder="Name, e.g. Generous with Credit"
              autoFocus
            />
            <textarea
              className={input + " w-full"}
              rows={3}
              value={craftDescription}
              onChange={(event) => setCraftDescription(event.target.value)}
              placeholder="What does this kind of excellence look like? What is it the opposite of?"
            />
            <div className="flex gap-2">
              <button type="button" className={btn} onClick={addDraft} disabled={!craftName.trim()}>
                Add gem
              </button>
              <button type="button" className={btnGhost} onClick={() => setCrafting(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">Personal Note</span>
        <textarea
          name="note"
          rows={6}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={input + " w-full max-w-2xl leading-relaxed"}
          placeholder="Anything you want to say to them about their work, or how it affected you. This note is private and will only be seen by the recipient and the MAI team, and will be anonymous unless you sign it."
        />
        <div className="max-w-2xl space-y-2 text-sm">
          <label className="admin-section flex items-center gap-2 text-[color:var(--text)]">
            <input
              type="checkbox"
              checked={signed}
              onChange={(event) => setSigned(event.target.checked)}
            />
            Let {recipient?.name ?? "them"} know it’s from me
          </label>
        </div>
      </label>

      {previewing && (
        <GemModal
          gem={previewing}
          onAttach={() => {
            attach(previewing.id);
            setPreviewing(null);
          }}
          onClose={() => setPreviewing(null)}
        />
      )}

      <div className="flex items-center gap-3">
        <button className={btn} type="submit" disabled={!canSend}>
          {submitting ? "Sending…" : "Send appreciation"}
        </button>
        {fetcher.data && !fetcher.data.ok && (
          <span className="admin-error text-sm">{fetcher.data.error}</span>
        )}
        {sentTo && fetcher.data?.ok && (
          <span className="text-sm text-[color:var(--muted)]">
            Sent to {sentTo}. Thank you.
          </span>
        )}
      </div>
    </fetcher.Form>
  );
}

function AppreciationCard({
  appreciation,
  show,
}: {
  appreciation: Appreciation;
  show: "sender" | "recipient";
}) {
  const other = show === "sender" ? appreciation.sender : appreciation.recipient;
  return (
    <li className="border-b border-[color:var(--line)] py-4 last:border-b-0">
      <div className="mb-1.5 text-xs text-[color:var(--muted)]">
        {show === "sender" ? (
          other ? (
            <>
              From <PersonLink person={other} />
            </>
          ) : (
            "Anonymous"
          )
        ) : (
          <>
            To {other ? <PersonLink person={other} /> : "a former member"}
            {appreciation.signed ? " · signed" : " · anonymous"}
          </>
        )}{" "}
        ·{" "}
        {formatDate(appreciation.createdAt)}
      </div>
      <p className="mb-2.5 whitespace-pre-line text-[15px] leading-relaxed text-[color:var(--text)]">
        {appreciation.note}
      </p>
      {appreciation.gems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {appreciation.gems.map((gem) => (
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
    </li>
  );
}

export default function Appreciate() {
  const { session, gems, wall, researchers, received, sent } = useLoaderData<typeof loader>();

  return (
    <main className="admin-page">
      <div className="admin-shell max-w-[860px]">
        {session && (
          <div className="mb-8 flex items-center gap-2 text-xs text-[color:var(--muted)]">
            <span>Signed in as {session.name}</span>
            <Form action="/logout" method="post">
              <button type="submit" className="text-[color:var(--accent)] hover:underline">
                Sign out
              </button>
            </Form>
          </div>
        )}

        <h1 className="mb-3 text-3xl font-semibold text-[color:var(--ink)]">Appreciations</h1>
        <p className="mb-10 max-w-2xl leading-relaxed text-[color:var(--text)]">
          Send a researcher a note about work of theirs you valued. Each month the MAI team will pick one appreciated researcher and send flowers. Gems are public, but the personal notes you add will only be seen by the person you appreciate and the MAI team, and will be anonymous unless you sign them.
        </p>

        <section className={panel}>
          <h2 className={heading + " mb-4"}>Send an appreciation</h2>
          <SendForm
            researchers={researchers}
            gems={gems}
            self={session ? { researcherId: session.researcherId, name: session.name } : null}
          />
        </section>

        {session && received.length > 0 && (
          <section className={panel}>
            <h2 className={heading + " mb-1"}>Appreciations you’ve received</h2>
            <ul>
              {received.map((appreciation) => (
                <AppreciationCard key={appreciation.id} appreciation={appreciation} show="sender" />
              ))}
            </ul>
          </section>
        )}

        <section className={panel}>
          <h2 className={heading + " mb-1"}>Recent appreciations</h2>
          {wall.length ? (
            <ul>
              {wall.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-x-2 gap-y-1.5 border-b border-[color:var(--line)] py-3 text-sm last:border-b-0"
                >
                  <PersonLink person={item.recipient} />
                  <span className="text-[color:var(--muted)]">
                    {item.gems.length ? "was appreciated for" : "was appreciated"}
                  </span>
                  {item.gems.map((gem) => (
                    <GemChip key={gem.id} slug={gem.slug} name={gem.name} description={gem.description} />
                  ))}
                  <span className="text-xs text-[color:var(--faint)]">
                    · {formatMonth(item.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[color:var(--muted)]">None yet. Be the first.</p>
          )}
        </section>

        {session && sent.length > 0 && (
          <section className={panel}>
            <h2 className={heading + " mb-1"}>Appreciations you’ve sent</h2>
            <ul>
              {sent.map((appreciation) => (
                <AppreciationCard key={appreciation.id} appreciation={appreciation} show="recipient" />
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
