import { data } from "react-router";
import type { Route } from "./+types/project-updates";
import { subscribeToProjectUpdates } from "../lib/updates.server";

export async function loader() {
  throw data("Method not allowed", { status: 405 });
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  if (String(form.get("website") ?? "")) return { ok: true };

  try {
    await subscribeToProjectUpdates(
      String(form.get("email") ?? ""),
      String(form.get("source") ?? "")
    );
    return { ok: true };
  } catch (error) {
    console.error("Could not save project update signup.", error);
    return {
      ok: false,
      error:
        error instanceof Error && error.message === "Enter a valid email address."
          ? error.message
          : "We couldn’t save that address. Please try again shortly.",
    };
  }
}

export default function ProjectUpdates() {
  return null;
}
