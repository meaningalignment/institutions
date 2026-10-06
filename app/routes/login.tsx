import { Form, Link, redirect, useActionData, useNavigation, useSearchParams } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/login";
import {
  createSessionCookie,
  getLoginOptions,
  getSignedInResearcher,
  LoginError,
  requestLoginCode,
  verifyLoginCode,
} from "../lib/auth.server";
import { safeAdminRedirect } from "../lib/auth";
import { SITE_NAME } from "../lib/constants";
import { ResearcherPicker } from "../components/admin/AdminControls";

type LoginActionData = {
  step: "who" | "code";
  researcherId?: number;
  /** Echoes the email the user typed for a record without one, for "Send another code". */
  typedEmail?: string;
  maskedEmail?: string;
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
  if (await getSignedInResearcher(request)) {
    throw redirect(safeAdminRedirect(url.searchParams.get("redirectTo")));
  }
  return { options: await getLoginOptions() };
}

function positiveInteger(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function action({ request }: Route.ActionArgs): Promise<LoginActionData | Response> {
  const form = await request.formData();
  const intent = String(form.get("intent") ?? "request-code");
  const redirectTo = safeAdminRedirect(form.get("redirectTo"));
  const researcherId = positiveInteger(form.get("researcherId"));
  const typedEmail = String(form.get("email") ?? "").trim() || undefined;
  if (!researcherId) return { step: "who", error: "Choose who you are." };

  if (intent === "request-code") {
    try {
      const maskedEmail = await requestLoginCode(researcherId, typedEmail);
      return { step: "code", researcherId, typedEmail, maskedEmail };
    } catch (error) {
      if (error instanceof LoginError) {
        return { step: "who", researcherId, typedEmail, error: error.message };
      }
      console.error("Could not send sign-in code.", error);
      return {
        step: "who",
        researcherId,
        typedEmail,
        error: "The sign-in email could not be sent. Try again shortly.",
      };
    }
  }

  if (intent === "verify-code") {
    const maskedEmail = String(form.get("maskedEmail") ?? "");
    const code = String(form.get("code") ?? "").replace(/\s/g, "");
    if (!/^\d{6}$/.test(code)) {
      return { step: "code", researcherId, typedEmail, maskedEmail, error: "Enter the six-digit code." };
    }
    const researcher = await verifyLoginCode(researcherId, code);
    if (!researcher) {
      return {
        step: "code",
        researcherId,
        typedEmail,
        maskedEmail,
        error: "That code is invalid or has expired.",
      };
    }
    return redirect(redirectTo, {
      headers: { "Set-Cookie": createSessionCookie(researcher, request) },
    });
  }

  return { step: "who", error: "Unknown sign-in action." };
}

export default function Login({ loaderData }: Route.ComponentProps) {
  const { options } = loaderData;
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const redirectTo = safeAdminRedirect(searchParams.get("redirectTo"));
  const step = data && "step" in data ? data.step : "who";
  const submitting = navigation.state === "submitting";
  const previous = data?.researcherId
    ? options.find((option) => option.id === data.researcherId) ?? null
    : null;
  const [chosenId, setChosenId] = useState<number | null>(previous?.id ?? null);
  const chosen = options.find((option) => option.id === chosenId) ?? null;
  const error = data && "error" in data ? data.error : undefined;

  return (
    <main className="login-page">
      <div className="login-main">
        <Link className="login-back" to="/">← AGI institutions</Link>
        <h1>{redirectTo.startsWith("/appreciate") ? "Sign in" : "Admin sign in"}</h1>
        {step === "code" && data?.researcherId ? (
          <>
            <p className="login-intro">
              A six-digit code is on its way to <strong>{data.maskedEmail}</strong>.
            </p>
            <Form method="post" className="login-form">
              <input type="hidden" name="intent" value="verify-code" />
              <input type="hidden" name="researcherId" value={data.researcherId} />
              <input type="hidden" name="email" value={data.typedEmail ?? ""} />
              <input type="hidden" name="maskedEmail" value={data.maskedEmail ?? ""} />
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
              {error && <p className="login-error">{error}</p>}
              <button className="login-submit" type="submit" disabled={submitting}>
                {submitting ? "Checking…" : "Sign in"}
              </button>
            </Form>
            <div className="login-secondary">
              <Form method="post">
                <input type="hidden" name="intent" value="request-code" />
                <input type="hidden" name="researcherId" value={data.researcherId} />
                <input type="hidden" name="email" value={data.typedEmail ?? ""} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <button type="submit" disabled={submitting}>
                  Send another code
                </button>
              </Form>
              <a href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}>Start over</a>
            </div>
          </>
        ) : (
          <>
            <p className="login-intro">
              Choose your name and we’ll email you a short-lived sign-in code.
            </p>
            <Form method="post" className="login-form">
              <input type="hidden" name="intent" value="request-code" />
              <input type="hidden" name="researcherId" value={chosen?.id ?? ""} />
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <label>
                <span>Who are you?</span>
                <ResearcherPicker
                  options={options}
                  initial={previous}
                  onChange={(researcher) => setChosenId(researcher?.id ?? null)}
                  placeholder="Search by name"
                  inputClassName="login-input w-full"
                  autoFocus
                />
              </label>
              {chosen?.maskedEmail && (
                <p className="login-intro" style={{ marginBottom: 0 }}>
                  We’ll send the code to <strong>{chosen.maskedEmail}</strong>, the email on your
                  profile.
                </p>
              )}
              {chosen && !chosen.maskedEmail && (
                <>
                  <p className="login-intro" style={{ marginBottom: 0 }}>
                    We don’t have an email for {chosen.name} yet. Enter yours and we’ll send the
                    code there. It’s saved to your profile as unconfirmed until the team checks it.
                  </p>
                  <label>
                    <span>Email</span>
                    <input
                      className="login-input"
                      name="email"
                      type="email"
                      autoComplete="email"
                      defaultValue={data?.typedEmail ?? ""}
                      required
                    />
                  </label>
                </>
              )}
              {error && <p className="login-error">{error}</p>}
              <button className="login-submit" type="submit" disabled={submitting || !chosen}>
                {submitting ? "Sending…" : "Email me a code"}
              </button>
            </Form>
          </>
        )}
      </div>
    </main>
  );
}
