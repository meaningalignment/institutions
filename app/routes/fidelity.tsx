import { redirect } from "react-router";
import type { Route } from "./+types/fidelity";

// Fidelity is now a vision overlaid on the AGI grid, not a tab. Keep the old
// /fidelity deep link working by redirecting to the grid with the vision on.
export function loader(_: Route.LoaderArgs) {
  return redirect("/?visions=fidelity");
}

export default function Fidelity() {
  return null;
}
