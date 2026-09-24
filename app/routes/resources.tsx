import { isRouteErrorResponse, Link, useNavigate, useSearchParams } from "react-router";
import type { Route } from "./+types/resources";
import { getCellFieldMap, getResearcherLinks, getResearchWorks, type ResearchWork, type WorkKind } from "../lib/researchers.server";
import { researcherKey } from "../lib/researcher-links";
import { loadGridCells } from "../lib/content.server";
import { RESEARCH_FIELDS } from "../lib/research-fields";
import { OG_IMAGE_META, SITE_NAME, SITE_ORIGIN } from "../lib/constants";

// Per-field copy and contacts. `researcher` is the one corresponding researcher
// who curates the list (roster spelling, so the name links off-site); `email`
// is a forwarding alias to them. Fields without one show the alias only.
const FIELD_INFO: Record<string, { blurb: string; email: string; researcher: string | null }> = {
  "multi-agent-systems": {
    blurb: "How populations of learning agents cooperate, compete, and coordinate, and what shapes the outcomes they reach.",
    email: "multi-agent@agi-institutions.org",
    researcher: "Matija Franklin",
  },
  "aligning-ai-to-values": {
    blurb: "What models should be trained toward, who supplies that target, and how values are elicited from real people.",
    email: "values-alignment@agi-institutions.org",
    researcher: "Smitha Milli",
  },
  "ai-governance-policy": {
    blurb: "How states, labs, and international bodies oversee advanced AI, through regulation, standards, audits, and new institutions.",
    email: "governance@agi-institutions.org",
    researcher: "Séb Krier",
  },
  "moral-cognition-norms": {
    blurb: "How people and agents learn, represent, and enforce norms, and what it takes for an agent to take part in a normative community.",
    email: "norms@agi-institutions.org",
    researcher: "Tan Zhi Xuan",
  },
  "philosophy-of-ai": {
    blurb: "What values are, how agents reason with plural ones, and what mind, meaning, and agency amount to in artificial systems.",
    email: "philosophy@agi-institutions.org",
    researcher: "Pete Wolfendale",
  },
  "deliberative-democracy": {
    blurb: "How groups reach decisions they can stand behind, and how AI can support deliberation at scale without steering it.",
    email: "deliberation@agi-institutions.org",
    researcher: "Michiel Bakker",
  },
  "economics-of-ai": {
    blurb: "What becomes of markets, firms, labor, and bargaining power when agents transact at machine speed.",
    email: "economics@agi-institutions.org",
    researcher: "Zoë Hitzig",
  },
  "negotiation-cooperation": {
    blurb: "How parties with divergent interests reach and keep binding agreements, whether they are people, states, or agents.",
    email: "negotiation@agi-institutions.org",
    researcher: "Krzysztof Pelc",
  },
  "game-theory-mechanism-design": {
    blurb: "Strategic interaction, and the design of rules under which honest, cooperative behavior is the rational choice.",
    email: "mechanism-design@agi-institutions.org",
    researcher: "Andrew Koh",
  },
  "legal-theory": {
    blurb: "Law as a resource for AI design: legal reasoning, agency and liability, and the infrastructure needed to govern agents.",
    email: "law@agi-institutions.org",
    researcher: "Nick Caputo",
  },
};

const ELSEWHERE = [
  {
    title: "AGI Governance Bibliography",
    by: "MINT Lab",
    url: "https://bibliography.mintresearch.org/",
    note: "a large, tagged bibliography of AGI governance research",
  },
  {
    title: "MATS reading list",
    by: "Luke Drago",
    url: "https://lukedrago.com/mats-reading-list/",
    note: "a short, opinionated list on AI strategy, economics, and futures",
  },
];

export async function loader() {
  // Names link to X profiles only (plain text without a handle), never to /researchers
  // profiles: this page lists work, not people. Links are a nicety, so a
  // failed lookup just leaves names plain.
  const [works, cellFields, links] = await Promise.all([
    getResearchWorks(),
    getCellFieldMap(),
    getResearcherLinks().catch(() => ({}) as Record<string, string>),
  ]);
  // How many institutions on the AGI grid draw on each field (same map the
  // grid highlights with, so the count matches what /?field= shows).
  const grid = loadGridCells();
  const gridCellCounts: Record<string, number> = {};
  for (const [key, fieldIds] of Object.entries(cellFields)) {
    const cell = grid[key];
    if (!cell || cell.hiddenOnAgi || !cell.summary) continue;
    for (const id of fieldIds) gridCellCounts[id] = (gridCellCounts[id] ?? 0) + 1;
  }
  return { works, fields: FIELD_INFO, gridCellCounts, links };
}

export function meta({ location }: Route.MetaArgs) {
  const field = RESEARCH_FIELDS.find((f) => f.id === new URLSearchParams(location.search).get("field"));
  const title = `${field ? `${field.label} · Resources` : "Resources"} — ${SITE_NAME}`;
  const desc =
    "Papers from the research network working on institutions for advanced AI, by field, with the researchers who curate each list.";
  return [
    { title },
    { name: "description", content: desc },
    { tagName: "link", rel: "canonical", href: `${SITE_ORIGIN}/resources/` },
    { property: "og:title", content: title },
    { property: "og:description", content: desc },
    ...OG_IMAGE_META,
  ];
}

const AUTHOR_LIMIT = 3;

type Links = Record<string, string>;

// A comma-separated list of names, each linked off-site when we know where.
function Names({ names, links }: { names: string[]; links: Links }) {
  return (
    <>
      {names.map((name, i) => {
        const href = links[researcherKey(name)];
        return (
          <span key={`${name}-${i}`}>
            {i > 0 ? ", " : ""}
            {href ? <a href={href} target="_blank" rel="noreferrer" className="bib-person">{name}</a> : name}
          </span>
        );
      })}
    </>
  );
}

function Authors({ work, links }: { work: ResearchWork; links: Links }) {
  // A work with no author list falls back to its linked roster members.
  const source = work.authors.length ? work.authors : work.researchers.map((r) => r.name);
  const all = source.filter((name) => name !== "et al.");
  const etAl = all.length > AUTHOR_LIMIT || all.length < source.length || !work.authors.length;
  return (
    <>
      <Names names={all.slice(0, AUTHOR_LIMIT)} links={links} />
      {etAl ? " et al." : ""}
    </>
  );
}

const KIND_LABELS: Record<WorkKind, string> = {
  peer_reviewed: "Peer-reviewed",
  preprint: "Preprint",
  workshop: "Workshop paper",
  essay: "Essay",
  report: "Report",
  book: "Book",
  chapter: "Book chapter",
  lecture: "Lecture",
};

function Entry({ work, withNote, links }: { work: ResearchWork; withNote: boolean; links: Links }) {
  // Venue and kind trail the year: "2022 · PNAS · Peer-reviewed". Conference
  // venues carry their own year ("ICLR 2026"); drop it so only one year shows.
  // For background work the venue alone says enough; peer review is a modern label.
  const venue = work.venue?.replace(/\s+(19|20)\d{2}$/, "") ?? null;
  const kind = work.kind && !(work.section === "background" && venue) ? KIND_LABELS[work.kind] : null;
  const meta = [work.year, venue, kind].filter(Boolean).join(" · ");
  return (
    <li className="bib-entry">
      <div className="bib-title">
        <a href={work.url} target="_blank" rel="noreferrer">{work.title}</a>
      </div>
      <div className="bib-byline">
        <Authors work={work} links={links} />
        {meta ? <span className="bib-year">{meta}</span> : null}
      </div>
      {withNote && work.summary ? <p className="bib-note">{work.summary}</p> : null}
    </li>
  );
}

// Collapsible, open by default. The summary carries the heading classes so
// the shared heading/intro spacing rules still apply to it.
function Section({ title, intro, count, showCount = true, children }: {
  title: string;
  intro?: string;
  count: number;
  showCount?: boolean;
  children: React.ReactNode;
}) {
  if (!count) return null;
  return (
    <details open className="research-paper-section bib-section">
      <summary className="community-section-heading bib-summary">
        <span className="bib-summary-title">
          <span className="bib-chevron" aria-hidden="true" />
          <h2>{title}</h2>
        </span>
        {showCount ? <span>{count}</span> : null}
      </summary>
      {intro ? <p className="community-section-intro">{intro}</p> : null}
      <ol className="bib-list">{children}</ol>
    </details>
  );
}

const fieldHref = (id: string) => (id ? `/resources?field=${id}` : "/resources");

export default function Resources({ loaderData: d }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const field = RESEARCH_FIELDS.find((f) => f.id === searchParams.get("field"));
  const info = field ? d.fields[field.id] : undefined;
  const visible = field ? d.works.filter((w) => w.fieldIds.includes(field.id)) : d.works;
  const inSection = (section: ResearchWork["section"]) => visible.filter((w) => w.section === section);
  const selected = inSection("selected");
  const inField = inSection("field");
  // Classics oldest first.
  const background = inSection("background").sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

  return (
    <div className="curr-layout bib-layout">
      <nav className="curr-sidebar bib-rail" aria-label="Fields">
        <div className="curr-sidebar-title">Fields</div>
        <ul className="curr-sidebar-list">
          {[{ id: "", label: "All fields" }, ...RESEARCH_FIELDS].map((f) => (
            <li key={f.id}>
              <Link
                to={fieldHref(f.id)}
                preventScrollReset
                className={`curr-sidebar-link${(field?.id ?? "") === f.id ? " is-active" : ""}`}
                aria-current={(field?.id ?? "") === f.id ? "page" : undefined}
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="curr-main bib-main">
        {/* Below the rail's breakpoint, fields collapse into a select. */}
        <label className="research-field-select bib-mobile-select">
          <span className="sr-only">Field</span>
          <select value={field?.id ?? ""} onChange={(e) => navigate(fieldHref(e.target.value), { replace: true })}>
            <option value="">All fields</option>
            {RESEARCH_FIELDS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </label>

        <header className="bib-head">
          <h1 className="curr-page-title">{field ? field.label : "Resources"}</h1>
          <p className="bib-lede">
            {info
              ? info.blurb
              : "Reading lists from our research network, by field. Each list is kept by a corresponding researcher. If you're starting on one of these problems, write to them first; much of what's known hasn't been published yet."}
          </p>
          {info ? (
            <dl className="bib-facts">
              {info.researcher ? (
                <>
                  <dt>Corresponding Researcher</dt>
                  <dd><Names names={[info.researcher]} links={d.links} /></dd>
                </>
              ) : null}
              {d.gridCellCounts[field!.id] ? (
                <>
                  <dt>Relevant for</dt>
                  <dd>
                    <Link to={`/?field=${field!.id}`}>
                      {d.gridCellCounts[field!.id]} {d.gridCellCounts[field!.id] === 1 ? "cell" : "cells"} in the AGI institutions grid
                    </Link>
                  </dd>
                </>
              ) : null}
              <dt>Contact</dt>
              <dd><a href={`mailto:${info.email}`}>{info.email}</a></dd>
            </dl>
          ) : null}
        </header>

        <Section title="Selected papers" count={selected.length}>
          {selected.map((w) => <Entry key={w.id} work={w} withNote links={d.links} />)}
        </Section>
        <Section title="Work in the field" count={inField.length}>
          {inField.map((w) => <Entry key={w.id} work={w} withNote={false} links={d.links} />)}
        </Section>
        <Section
          title="Background work"
          intro="Older work the field builds on, often from outside it."
          count={background.length}
        >
          {background.map((w) => <Entry key={w.id} work={w} withNote={false} links={d.links} />)}
        </Section>
        {!visible.length ? <p className="community-unavailable">Nothing listed in this field yet.</p> : null}

        {!field ? (
          <Section title="Elsewhere" count={ELSEWHERE.length} showCount={false}>
            {ELSEWHERE.map((e) => (
              <li key={e.url} className="bib-entry">
                <div className="bib-title">
                  <a href={e.url} target="_blank" rel="noreferrer">{e.title}</a>
                </div>
                <div className="bib-byline">{e.by}, {e.note}.</div>
              </li>
            ))}
          </Section>
        ) : null}
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? error.statusText || "Error"
    : "Resources are unavailable right now.";
  return (
    <div className="curr-layout bib-layout">
      <div className="curr-main bib-main">
        <h1 className="curr-page-title">Resources</h1>
        <p className="bib-lede">{message}</p>
      </div>
    </div>
  );
}
