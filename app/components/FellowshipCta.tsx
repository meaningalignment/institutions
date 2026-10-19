export const FELLOWSHIP_URL = "https://www.meaningalignment.org/fellowship";

// Invitation to the Meaning Alignment Institute research fellowship, shown
// wherever the site poses design problems.
export function FellowshipCta() {
  return (
    <aside className="fellowship-cta">
      <span className="fellowship-cta-title">Want to work on these problems?</span>{" "}
      <a href={FELLOWSHIP_URL}>Apply to our research fellowship →</a>
    </aside>
  );
}
