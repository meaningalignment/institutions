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

// Matches an author string to a roster name despite middle initials, accents
// and hyphenation: "Joel Z. Leibo" and "Joel Leibo" both key to "joel leibo",
// "Tan Zhi-Xuan" and "Tan Zhi Xuan" to "tan xuan".
export function researcherKey(name: string): string {
  const parts = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((part) => part.length > 1);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts.join("");
}

// Where a researcher's name links off-site: their X profile, or nowhere.
export function researcherXUrl(handle: string | null): string | null {
  const bare = (handle ?? "").replace(/^@/, "").trim();
  return bare ? `https://x.com/${bare}` : null;
}
