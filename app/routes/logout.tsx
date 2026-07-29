import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { clearSessionCookie } from "../lib/auth.server";

export async function action({ request }: Route.ActionArgs) {
  return redirect("/login", {
    headers: { "Set-Cookie": clearSessionCookie(request) },
  });
}

export async function loader() {
  throw redirect("/admin");
}
