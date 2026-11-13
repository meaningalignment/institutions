import { redirect } from "react-router";
import type { Route } from "./+types/requests-redirect";

// The requests page moved to /tracker; keep old links working.
export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  return redirect(`/tracker${url.search}`, 301);
}

export default function RequestsRedirect() {
  return null;
}
