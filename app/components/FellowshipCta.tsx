export const FELLOWSHIP_URL = "https://www.meaningalignment.org/fellowship";

// Invitation to the Meaning Alignment Institute research fellowship, shown
// wherever the site poses design problems.
export function FellowshipCta() {
  return (
    <p className="fellowship-cta">
      Want to work on these problems? <a href={FELLOWSHIP_URL}>Apply to our research fellowship</a>.
    </p>
  );
}
