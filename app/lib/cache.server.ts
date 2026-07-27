// Build-bundled editorial content is immutable for a deployment. A short
// browser freshness window lets native React Router prefetches be reused, while
// the shared-cache directives let Vercel absorb repeat route-data requests.
export function staticContentHeaders() {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=60",
  };
}
