import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // AGI grid
  route("human", "routes/human.tsx"), // Human grid
  route("cell/:row/:col", "routes/cell.tsx"), // AGI cell detail
  route("human/:row/:col", "routes/human-cell.tsx"), // Human cell detail
  route("methods/:col", "routes/methods.tsx"), // Method column detail
  route("problem-sets", "routes/problem-sets.tsx"),
  route("curriculum", "routes/curriculum.tsx"),
  route("theory-of-change", "routes/theory-of-change.tsx"),
  route("researchers", "routes/researchers.tsx"), // Community page (DB)
  route("researchers/:handle", "routes/researcher-profile.tsx"), // Researcher profile (DB)
  route("admin", "routes/admin.tsx", [
    index("routes/admin-scouts.tsx"),
    route("papers", "routes/admin-papers.tsx"),
    route("people", "routes/admin-people.tsx"),
  ]), // Internal admin (unlinked, unguarded — see note)
  route("fidelity", "routes/fidelity.tsx"), // → /?visions=fidelity
] satisfies RouteConfig;
