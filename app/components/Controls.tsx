import { Link } from "react-router";
import { TABS, VISIONS, type TabId } from "../lib/constants";

// Top controls row: tab bar (Human / AGI), vision menu (AGI only), about link.
// The vision checkboxes are wired by the global change listener in root.tsx.
export function Controls({ tabId }: { tabId: TabId }) {
  return (
    <div className="controls">
      <nav className="tab-bar">
        <Link to="/human" className={`tab-link${tabId === "human" ? " active" : ""}`}>
          <span className="tab-full">{TABS.human.nav}</span>
          <span className="tab-short">{TABS.human.short}</span>
        </Link>
        <Link to="/" className={`tab-link${tabId === "agi" ? " active" : ""}`}>
          <span className="tab-full">{TABS.agi.nav}</span>
          <span className="tab-short">{TABS.agi.short}</span>
        </Link>
      </nav>
      {tabId === "agi" && <VisionMenu />}
      <Link className="about-button" to="/theory-of-change">
        What is this?
      </Link>
    </div>
  );
}

// The "Visions" dropdown of checkboxes. Wired by the global change listener in
// root.tsx. Shared by the grid controls and the problem-sets page.
export function VisionMenu() {
  if (!VISIONS.length) return null;
  return (
    <details className="vision-menu">
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
