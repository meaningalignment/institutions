import { Form, Link } from "react-router";

type CommunitySession = {
  name: string;
  handle: string;
};

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

export function CommunityHeader({
  editing,
  session,
}: {
  editing: boolean;
  session?: CommunitySession | null;
}) {
  const profileHandle = session?.handle.replace(/^@/, "");

  return (
    <>
      {editing && session ? (
        <div className="community-utility-row">
          <div className="flex items-center gap-2 pt-1 text-xs text-[color:var(--muted)]">
            {profileHandle ? (
              <Link
                to={`/researchers/${profileHandle}`}
                className="text-[color:var(--accent)] hover:underline"
              >
                {session.name}
              </Link>
            ) : (
              <span>{session.name}</span>
            )}
            <Form action="/logout" method="post">
              <button type="submit" className="text-[color:var(--accent)] hover:underline">
                Sign out
              </button>
            </Form>
          </div>
        </div>
      ) : null}

      <div className="community-title-row">
        <h1>{editing ? "Community admin" : "Research Community"}</h1>
        {!editing && session ? (
          <Link
            to={editing ? "/researchers" : "/researchers/admin"}
            role="button"
            aria-label={editing ? "Stop editing community" : "Edit community"}
            aria-pressed={editing}
            title={editing ? "Stop editing community" : "Edit community"}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${
              editing
                ? "border-[color:var(--accent)] bg-[var(--accent)] text-[color:var(--paper)]"
                : "border-[color:var(--line-strong)] text-[color:var(--muted)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            }`}
          >
            <EditIcon />
          </Link>
        ) : null}
      </div>
      <p className={`community-page-intro${editing ? " is-editing" : ""}`}>
        {editing
          ? "Manage people, scouts, involvement, and selected work."
          : "The people building institutions for a world of autonomous AI agents."}
      </p>
    </>
  );
}
