type ResearcherLinkTarget = {
  name: string;
  handle: string;
};

export function researcherNameSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function researcherProfileSegment(researcher: ResearcherLinkTarget): string {
  const handle = researcher.handle.replace(/^@/, "").trim();
  return handle || researcherNameSlug(researcher.name);
}

export function researcherProfilePath(researcher: ResearcherLinkTarget): string {
  return `/researchers/${researcherProfileSegment(researcher)}`;
}
