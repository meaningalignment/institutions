// Gem/appreciation helpers shared by the server module and route components.

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .slice(0, 60);
}

/** First day of the calendar month (UTC) containing an ISO timestamp, as YYYY-MM-DD. */
export function monthKey(isoDate: string) {
  return `${isoDate.slice(0, 7)}-01`;
}
