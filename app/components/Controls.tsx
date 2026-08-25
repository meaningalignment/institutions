import { VISIONS, type TabId } from "../lib/constants";

// Top controls row: tab bar (Human / AGI), vision menu (AGI only), about link.
// The vision checkboxes are wired by the global change listener in root.tsx.
export function Controls({ tabId }: { tabId: TabId }) {
  if (tabId === "human") return null;
  return (
    <div className="controls wiki-grid-tools">
      <span className="wiki-grid-tools-label">Overlays</span>
      <VisionMenu />
    </div>
  );
}

// The "Visions" dropdown of checkboxes. Wired by the global change listener in
// root.tsx. Shared by the grid controls (as a small pill pinned to the top
// right via `corner`) and the problem-sets page (inline).
export function VisionMenu({ corner = false }: { corner?: boolean }) {
  if (!VISIONS.length) return null;
  return (
    <details className={`vision-menu${corner ? " vision-menu-corner" : ""}`}>
      <summary>Visions</summary>
      <div className="vision-menu-list">
        {VISIONS.map((v) => (
          <label key={v.id} className="vision-menu-item">
            <input type="checkbox" data-vision={v.id} />
            <span className="vision-swatch" style={{ background: v.color }} />
            <span>{v.label}</span>
          </label>
        ))}
      </div>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      Assembled by the{" "}
      <a href="https://meaningalignment.org" target="_blank" rel="noopener">
        Meaning Alignment Institute
      </a>
    </footer>
  );
}
