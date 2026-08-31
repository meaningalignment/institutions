import { useFetcher } from "react-router";

type SignupResult = { ok: boolean; error?: string };

export function ComingSoon({
  section,
  source,
}: {
  section: string;
  source: "curriculum" | "researchers";
}) {
  const fetcher = useFetcher<SignupResult>();
  const submitting = fetcher.state !== "idle";

  return (
    <div className="coming-soon-page">
      <h1>{section}</h1>
      <p className="coming-soon-intro">Coming soon.</p>

      {fetcher.data?.ok ? (
        <p className="coming-soon-success" role="status">
          Thanks. We’ll keep you posted.
        </p>
      ) : (
        <fetcher.Form method="post" action="/project-updates" className="coming-soon-form">
          <input type="hidden" name="source" value={source} />
          <label className="coming-soon-field-label" htmlFor={`${source}-updates-email`}>
            Email address
          </label>
          <div className="coming-soon-form-row">
            <input
              id={`${source}-updates-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Joining…" : "Notify me"}
            </button>
          </div>
          <label className="coming-soon-honeypot" aria-hidden="true">
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
          {fetcher.data?.error && <p className="coming-soon-error">{fetcher.data.error}</p>}
        </fetcher.Form>
      )}

    </div>
  );
}
