import { Form, Link, useFetcher, useLoaderData } from "react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  ResearcherPicker,
} from "../components/admin/AdminControls";
import { GemChip } from "../components/Gem";
import { slugify } from "../lib/gems";

export function meta(_: Route.MetaArgs) {
  return [{ title: `Appreciations — ${SITE_NAME}` }, { name: "robots", content: "noindex" }];
}

/** The public list stays hidden until there are enough entries that it can't single anyone out. */
const MIN_PUBLIC_APPRECIATIONS = 5;

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSignedInResearcher(request);
  const [gems, allPublic, researchers] = await Promise.all([
    getGems(session?.researcherId),
    getPublicAppreciations(),
    getResearchersList(),
  ]);
  // Below the threshold, send nothing to the client rather than just hiding it.
  const wall = allPublic.length >= MIN_PUBLIC_APPRECIATIONS ? allPublic : [];
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

/** Native <dialog> shown modally; Escape, a backdrop click, or onClose dismisses it. */
function Modal({ onClose, children }: { onClose: () => void; children: ReactNode }) {
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
      <div className="p-6">{children}</div>
    </dialog>
  );
}

/** Explains a gem before it's attached. */
function GemModal({
  gem,
  onAttach,
  onClose,
}: {
  gem: PickerGem;
  onAttach: () => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <h3 className="mb-3 text-xl font-semibold text-[color:var(--ink)]">{gem.name}</h3>
      <p className="mb-2 whitespace-pre-line leading-relaxed">
        {gem.description || "No description yet."}
      </p>
      {gem.status === "pending" && (
        <p className="mb-2 text-xs text-[color:var(--muted)]">
          You suggested this one; it’s awaiting review by the MAI team.
        </p>
      )}
      <div className="mt-5 flex gap-2">
        <button type="button" className={btn} onClick={onAttach} autoFocus>
          Add
        </button>
        <button type="button" className={btnGhost} onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}

/** Name and describe a new gem; it's attached to this note and awaits team review. */
function CraftGemModal({
  onAdd,
  onClose,
}: {
  onAdd: (name: string, description: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const add = () => {
    if (name.trim()) onAdd(name.trim(), description.trim());
  };
  return (
    <Modal onClose={onClose}>
      <h3 className="mb-2 text-xl font-semibold text-[color:var(--ink)]">Something else</h3>
      <p className="mb-4 text-sm leading-relaxed text-[color:var(--muted)]">
        Name a kind of excellence that isn’t here yet. It’s attached to this note now and joins the
        shared collection once the MAI team has reviewed it.
      </p>
      <div className="space-y-3">
        <input
          className={input + " w-full"}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            // Enter adds the gem rather than submitting the surrounding note form.
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder="Name, e.g. Generous with Credit"
          aria-label="What you appreciate them as"
          autoFocus
        />
        <textarea
          className={input + " w-full"}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What does this kind of excellence look like? What is it the opposite of?"
          aria-label="What it looks like"
        />
      </div>
      <div className="mt-5 flex gap-2">
        <button type="button" className={btn} onClick={add} disabled={!name.trim()}>
          Add
        </button>
        <button type="button" className={btnGhost} onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
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

  function addDraft(name: string, description: string) {
    const existing = gems.find((gem) => gem.slug === slugify(name));
    if (existing) {
      setSelected((current) => new Set(current).add(existing.id));
    } else if (!drafts.some((draft) => slugify(draft.name) === slugify(name))) {
      setDrafts((current) => [...current, { key: Date.now(), name, description }]);
    }
    setCrafting(false);
  }

  const submitting = fetcher.state !== "idle";
  const senderId = self?.researcherId ?? sender?.id ?? null;
  const canSend = !!senderId && !!recipient && note.trim().length > 0 && !submitting;

  return (
    <fetcher.Form method="post" className="space-y-8">
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

      <div className="grid gap-x-10 gap-y-3 sm:grid-cols-[auto_1fr]">
        {self ? (
          <div className="text-sm">
            <span className="mb-1.5 block font-medium text-[color:var(--ink)]">From</span>
            <span className="text-[color:var(--text)]">{self.name}</span>
          </div>
        ) : (
          <label className="block sm:w-72">
            <span className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
              Who are you?
            </span>
            <ResearcherPicker
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

        {/* Top padding lines the checkbox up with the sender's name, not the "From" label. */}
        <div className="space-y-1 sm:pt-[26px]">
          <label className="admin-section flex items-center gap-2 text-sm text-[color:var(--text)]">
            <input
              type="checkbox"
              checked={signed}
              onChange={(event) => setSigned(event.target.checked)}
            />
            Sign it, so {recipient?.name ?? "they"} can see it’s from you
          </label>
          <p className="text-xs text-[color:var(--muted)]">
            Otherwise it’s anonymous to them. (MAI always sees who sent it.)
          </p>
        </div>
      </div>


      <div>
        <span className="mb-1 block text-sm font-medium text-[color:var(--ink)]">
          I appreciate {recipient?.name ?? "them"} as…
        </span>
        <p className="mb-2.5 text-xs text-[color:var(--muted)]">
          Click one to see what it means. These will show on the public wall of appreciations.
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
          <button
            type="button"
            className={btnGhost}
            onClick={() => setCrafting(true)}
          >
            + Something else…
          </button>
        </div>

        {crafting && <CraftGemModal onAdd={addDraft} onClose={() => setCrafting(false)} />}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[color:var(--ink)]">Personal note</span>
        <span className="mb-2.5 block text-xs text-[color:var(--muted)]">
          Only visible to the recipient.
        </span>
        <textarea
          name="note"
          rows={6}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className={input + " w-full max-w-2xl leading-relaxed"}
          placeholder="Anything you want to say to them about their work, or how it affected you."
        />
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
        <p className="text-sm text-[color:var(--muted)]">
          As{" "}
          <span className="text-[color:var(--ink)]">
            {appreciation.gems.map((gem) => gem.name).join(" · ")}
          </span>
        </p>
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

        <h1 className="mb-3 text-3xl font-semibold text-[color:var(--ink)]">Appreciate a researcher</h1>
        <p className="mb-10 max-w-2xl leading-relaxed text-[color:var(--text)]">
          Each month MAI will send flowers to one appreciated researcher.
        </p>

        <SendForm
          researchers={researchers}
          gems={gems}
          self={session ? { researcherId: session.researcherId, name: session.name } : null}
        />

        {session && received.length > 0 && (
          <section>
            <h2 className={heading + " mb-1"}>Appreciations you’ve received</h2>
            <ul>
              {received.map((appreciation) => (
                <AppreciationCard key={appreciation.id} appreciation={appreciation} show="sender" />
              ))}
            </ul>
          </section>
        )}

        <div className="mb-8 mt-10 h-px bg-[color:var(--line)]" />

        <section>
          <h1 className={heading + " mb-1"}>Recent appreciations</h1>
          {wall.length ? (
            <ul>
              {wall.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-[color:var(--line)] py-3 text-sm last:border-b-0"
                >
                  <PersonLink person={item.recipient} />
                  <span className="text-[color:var(--muted)]">
                    , appreciated{item.gems.length ? " as " : ""}
                  </span>
                  {item.gems.length > 0 && (
                    <span className="text-[color:var(--ink)]">
                      {item.gems.map((gem) => gem.name).join(" · ")}
                    </span>
                  )}
                  <span className="text-xs text-[color:var(--faint)]">
                    {" "}· {formatMonth(item.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[color:var(--muted)]">
              Recent appreciations will show here once there are at least{" "}
              {MIN_PUBLIC_APPRECIATIONS}.
            </p>
          )}
        </section>

        {session && sent.length > 0 && (
          <section>
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
