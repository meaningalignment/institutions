// Gem/appreciation helpers shared by the server module and route components.

/**
 * Gem names carry their own leading "as" or "for" ("as Earnest", "for Taking It All On") so they
 * read on after "I appreciate them…". The slug ignores it, so "Earnest" and "as Earnest" are one gem.
 */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/^(as|for)\s+/, "")
    .replace(/[\s_-]+/g, "-")
    .slice(0, 60);
}

/** First day of the calendar month (UTC) containing an ISO timestamp, as YYYY-MM-DD. */
export function monthKey(isoDate: string) {
  return `${isoDate.slice(0, 7)}-01`;
}
