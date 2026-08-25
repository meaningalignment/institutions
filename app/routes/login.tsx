import { Form, Link, redirect, useActionData, useNavigation, useSearchParams } from "react-router";
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

export default function Login() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const redirectTo = safeAdminRedirect(searchParams.get("redirectTo"));
  const step = data && "step" in data ? data.step : "email";
  const email = data && "email" in data ? data.email : "";
  const submitting = navigation.state === "submitting";

  return (
    <main className="login-page">
      <div className="login-main">
        <Link className="login-back" to="/">← AGI institutions</Link>
        <h1>Admin sign in</h1>
        {step === "code" ? (
          <>
            <p className="login-intro">
              If <strong>{email}</strong>{" "}
              belongs to a researcher, a six-digit code is on its way.
            </p>
            <Form method="post" className="login-form">
              <input type="hidden" name="intent" value="verify-code" />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <label>
                <span>Sign-in code</span>
                <input
                  className="login-input login-code-input"
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
                <p className="login-error">{data.error}</p>
              )}
              <button
                className="login-submit"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Checking…" : "Sign in"}
              </button>
            </Form>
            <div className="login-secondary">
              <Form method="post">
                <input type="hidden" name="intent" value="request-code" />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <button
                  type="submit"
                  disabled={submitting}
                >
                  Send another code
                </button>
              </Form>
              <a href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}>
                Use another email
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="login-intro">
              Enter the email attached to your researcher profile. We’ll send a
              short-lived sign-in code.
            </p>
            <Form method="post" className="login-form">
              <input type="hidden" name="intent" value="request-code" />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <label>
                <span>Email</span>
                <input
                  className="login-input"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  required
                />
              </label>
              {data && "error" in data && data.error && (
                <p className="login-error">{data.error}</p>
              )}
              <button
                className="login-submit"
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
