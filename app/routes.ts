import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // AGI grid
  route("human", "routes/human.tsx"), // Human grid
  route("cell/:row/:col", "routes/cell.tsx"), // AGI cell detail
  route("human/:row/:col", "routes/human-cell.tsx"), // Human cell detail
  route("methods/:col", "routes/methods.tsx"), // Method column detail
  route("design-challenges", "routes/problem-sets.tsx"),
  route("problem-sets", "routes/problem-sets-redirect.tsx"), // Legacy URL
  route("curriculum", "routes/curriculum.tsx"),
  route("theory-of-change", "routes/theory-of-change.tsx"),
  route("researchers", "routes/researchers.tsx"), // Community page (DB)
  route("researchers/admin", "routes/admin.tsx", [
    index("routes/admin-scouts.tsx"),
    route("people", "routes/admin-people.tsx"),
    route("papers", "routes/admin-papers.tsx"),
  ]), // Internal community admin (email-code authenticated)
  route("researchers/:handle", "routes/researcher-profile.tsx"), // Researcher profile (DB)
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("admin/*", "routes/admin-redirect.tsx"), // Legacy admin URLs
  route("fidelity", "routes/fidelity.tsx"), // → /?visions=fidelity
] satisfies RouteConfig;
