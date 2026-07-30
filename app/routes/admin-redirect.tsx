import { redirect } from "react-router";
import type { Route } from "./+types/admin-redirect";

export function loader({ params }: Route.LoaderArgs) {
  const suffix = params["*"] ? `/${params["*"]}` : "";
  throw redirect(`/researchers/admin${suffix}`);
}
