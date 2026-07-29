import { Form, redirect, useActionData, useNavigation, useSearchParams } from "react-router";
import type { Route } from "./+types/login";
import {
  createAdminSessionCookie,
  getAuthorizedAdminSession,
  requestLoginCode,
  verifyLoginCode,
} from "../lib/auth.server";
import { safeAdminRedirect } from "../lib/auth";
import { SITE_NAME } from "../lib/constants";

type LoginActionData = {
  step: "email" | "code";
  email?: string;
  error?: string;
};

export function meta() {
  return [
    { title: `Sign in — ${SITE_NAME}` },
    { name: "robots", content: "noindex" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  if (await getAuthorizedAdminSession(request)) {
    throw redirect(safeAdminRedirect(url.searchParams.get("redirectTo")));
  }
  return null;
}

export async function action({ request }: Route.ActionArgs): Promise<LoginActionData | Response> {
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "request-code");
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const redirectTo = safeAdminRedirect(form.get("redirectTo"));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { step: "email", error: "Enter a valid email address." };
  }

  if (intent === "request-code") {
    try {
      await requestLoginCode(email);
      return { step: "code", email };
    } catch (error) {
      console.error("Could not send admin sign-in code.", error);
      return {
        step: "email",
        error: "The sign-in email could not be sent. Try again shortly.",
      };
    }
  }

  if (intent === "verify-code") {
    const code = String(form.get("code") ?? "").replace(/\s/g, "");
    if (!/^\d{6}$/.test(code)) {
      return { step: "code", email, error: "Enter the six-digit code." };
    }
    const researcher = await verifyLoginCode(email, code);
    if (!researcher) {
      return {
        step: "code",
        email,
        error: "That code is invalid or has expired.",
      };
    }
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": createAdminSessionCookie(researcher, request),
      },
    });
  }

  return { step: "email", error: "Unknown sign-in action." };
}

const fieldClass =
  "w-full rounded-lg border border-[color:var(--line-strong)] bg-white px-3 py-2.5 text-base text-[color:var(--ink)] outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-blue-100";

export default function Login() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const redirectTo = safeAdminRedirect(searchParams.get("redirectTo"));
  const step = data && "step" in data ? data.step : "email";
  const email = data && "email" in data ? data.email : "";
  const submitting = navigation.state === "submitting";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--wash)] px-5 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-[color:var(--line)] bg-white p-7 shadow-sm">
        <h1
          className="mb-1 text-[color:var(--ink)]"
          style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28 }}
        >
          Admin sign in
        </h1>
        {step === "code" ? (
          <>
            <p className="mb-5 text-sm leading-6 text-[color:var(--muted)]">
              If <strong className="font-medium text-[color:var(--text)]">{email}</strong>{" "}
              belongs to a researcher, a six-digit code is on its way.
            </p>
            <Form method="post" className="space-y-3">
              <input type="hidden" name="intent" value="verify-code" />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
                  Sign-in code
                </span>
                <input
                  className={fieldClass + " text-center font-mono tracking-[0.3em]"}
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoFocus
                  required
                />
              </label>
              {data && "error" in data && data.error && (
                <p className="text-sm text-red-700">{data.error}</p>
              )}
              <button
                className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-dark)] disabled:opacity-50"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Checking…" : "Sign in"}
              </button>
            </Form>
            <div className="mt-4 flex items-center justify-between text-xs">
              <Form method="post">
                <input type="hidden" name="intent" value="request-code" />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <button
                  type="submit"
                  className="text-[color:var(--accent)] hover:underline"
                  disabled={submitting}
                >
                  Send another code
                </button>
              </Form>
              <a className="text-[color:var(--muted)] hover:underline" href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}>
                Use another email
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="mb-5 text-sm leading-6 text-[color:var(--muted)]">
              Enter the email attached to your researcher profile. We’ll send a
              short-lived sign-in code.
            </p>
            <Form method="post" className="space-y-3">
              <input type="hidden" name="intent" value="request-code" />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[color:var(--ink)]">
                  Email
                </span>
                <input
                  className={fieldClass}
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </label>
              {data && "error" in data && data.error && (
                <p className="text-sm text-red-700">{data.error}</p>
              )}
              <button
                className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-dark)] disabled:opacity-50"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Email me a code"}
              </button>
            </Form>
          </>
        )}
      </div>
    </main>
  );
}
