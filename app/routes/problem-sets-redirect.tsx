import { redirect } from "react-router";
import type { Route } from "./+types/problem-sets-redirect";

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  throw redirect(`/design-challenges${url.search}${url.hash}`, 301);
}

export default function ProblemSetsRedirect() {
  return null;
}
