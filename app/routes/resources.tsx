import { isRouteErrorResponse, Link, useNavigate, useSearchParams } from "react-router";
import type { Route } from "./+types/resources";
import { getCellFieldMap, getResearcherLinks, getResearchWorks, type ResearchWork, type WorkKind } from "../lib/researchers.server";
import { researcherKey } from "../lib/researcher-links";
import { loadGridCells } from "../lib/content.server";
import { RESEARCH_FIELDS } from "../lib/research-fields";
import { COLS, OG_IMAGE_META, ROWS, SITE_NAME, SITE_ORIGIN } from "../lib/constants";

// Per-field copy and contacts. `blurb` says what the field studies (the
// overview's directory and the field page's lede). `researcher` is the one corresponding
// researcher who keeps the list (roster spelling, so the name links off-site),
// and `researcherBio` a one-line role condensed from their /researchers bio;
// `email` goes to the field's switchboard operators, who route questions on.
const FIELD_INFO: Record<
  string,
  { blurb: string; email: string; researcher: string | null; researcherBio?: string }
> = {
  "multi-agent-systems": {
    blurb: "How populations of learning agents cooperate, compete, and coordinate, and what shapes the outcomes they reach.",
    email: "agents@agi-institutions.org",
    researcher: "Matija Franklin",
    researcherBio: "Research scientist at Google DeepMind.",
  },
  "aligning-ai-to-values": {
    blurb: "What models should be trained toward, who supplies that target, and how values are elicited from real people.",
    email: "values@agi-institutions.org",
    researcher: "Smitha Milli",
    researcherBio: "Research scientist on Meta's FAIR AI & Society team.",
  },
  "ai-governance-policy": {
    blurb: "How states, labs, and international bodies oversee advanced AI, through regulation, standards, audits, and new institutions.",
    email: "governance@agi-institutions.org",
    researcher: "Séb Krier",
    researcherBio: "Policy lead at Google DeepMind.",
  },
  "moral-cognition-norms": {
    blurb: "How people and agents learn, represent, and enforce norms, and what it takes for an agent to take part in a normative community.",
    email: "norms@agi-institutions.org",
    researcher: "Tan Zhi Xuan",
    researcherBio: "Professor of computer science at NUS.",
  },
  "philosophy-of-ai": {
    blurb: "What values are, how agents reason with plural ones, and what mind, meaning, and agency amount to in artificial systems.",
    email: "philosophy@agi-institutions.org",
    researcher: "Pete Wolfendale",
    researcherBio: "Philosopher at the University of Johannesburg.",
  },
  "deliberative-democracy": {
    blurb: "How groups reach decisions they can stand behind, and how AI can support deliberation at scale without steering it.",
    email: "democracy@agi-institutions.org",
    researcher: "Michiel Bakker",
    researcherBio: "Assistant professor at MIT.",
  },
  "economics-of-ai": {
    blurb: "What becomes of markets, firms, labor, and bargaining power when agents transact at machine speed.",
    email: "econ@agi-institutions.org",
    researcher: "Zoë Hitzig",
    researcherBio: "Economist at the Anthropic Institute.",
  },
  "negotiation-cooperation": {
    blurb: "How parties with divergent interests reach and keep binding agreements, whether they are people, states, or agents.",
    email: "negotiation@agi-institutions.org",
    researcher: "Krzysztof Pelc",
    researcherBio: "Professor of international relations at Oxford.",
  },
  "game-theory-mechanism-design": {
    blurb: "Strategic interaction, and the design of rules under which honest, cooperative behavior is the rational choice.",
    email: "mechanisms@agi-institutions.org",
    researcher: "Andrew Koh",
    researcherBio: "Economist at Columbia and Google DeepMind.",
  },
  "legal-theory": {
    blurb: "Law as a resource for AI design: legal reasoning, agency and liability, and the infrastructure needed to govern agents.",
    email: "law@agi-institutions.org",
    researcher: "Nick Caputo",
    researcherBio: "Law & AI lead at the Oxford Martin AI Governance Initiative.",
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
  {
    title: "CS6101: Rational Approaches to Cooperative Intelligence",
    by: "Tan Zhi Xuan (NUS)",
    url: "https://cosilab.notion.site/cs6101-raci-fall-2025",
    note: "a seminar syllabus on cooperative AI, from theory of mind to norms, institutions, and negotiation",
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
  // The institutions on the AGI grid that draw on each field (same map the
  // grid highlights with, so the count matches what /?field= shows). Cells
  // where the field ranks highest come first, then in grid order.
  const grid = loadGridCells();
  const gridOrder = ROWS.flatMap((r) => COLS.map((c) => `${r.id}-${c.id}`));
  const gridCells: Record<string, { href: string; title: string }[]> = {};
  const byField: Record<string, { key: string; rank: number }[]> = {};
  for (const [key, fieldIds] of Object.entries(cellFields)) {
    const cell = grid[key];
    if (!cell || cell.hiddenOnAgi || !cell.summary) continue;
    fieldIds.forEach((id, rank) => (byField[id] ??= []).push({ key, rank }));
  }
  for (const [id, cells] of Object.entries(byField)) {
    cells.sort((a, b) => a.rank - b.rank || gridOrder.indexOf(a.key) - gridOrder.indexOf(b.key));
    gridCells[id] = cells.map(({ key }) => {
      const [row, ...col] = key.split("-");
      return { href: `/cell/${row}/${col.join("-")}?field=${id}`, title: grid[key].summary };
    });
  }
  return { works, fields: FIELD_INFO, gridCells, links };
}

export function meta({ location }: Route.MetaArgs) {
  const param = new URLSearchParams(location.search).get("field");
  const field = RESEARCH_FIELDS.find((f) => f.id === param);
  const page = field ? `${field.label} · Resources` : param === "all" ? "All works · Resources" : "Resources";
  const title = `${page} — ${SITE_NAME}`;
  const desc = field
    ? `${FIELD_INFO[field.id]?.blurb ?? ""} A reading list for AGI institutions, curated by a researcher in the field.`.trim()
    : "A directory of the most relevant work for designing institutions for powerful AI, organized by research field and curated by researchers in each.";
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

// The three parts of every list, in page order. The same copy introduces the
// sections on a field page and explains them on the overview.
const SECTIONS: { id: NonNullable<ResearchWork["section"]>; title: string; intro: string }[] = [
  {
    id: "selected",
    title: "Selected papers",
    intro: "Must-reads for understanding the field and why it matters for AGI institutions.",
  },
  {
    id: "field",
    title: "Work in the field",
    intro: "Recent work in the field worth knowing.",
  },
  {
    id: "background",
    title: "Foundations",
    intro: "Older work that gives background on the field.",
  },
]

// `?field=` values: "" is the overview, "all" every work in one list.
const ALL = "all";
const fieldHref = (id: string) => (id ? `/resources?field=${id}` : "/resources");

function Rail({ current }: { current: string }) {
  const item = (id: string, label: string, extra = "") => (
    <li key={id || "overview"}>
      <Link
        to={fieldHref(id)}
        preventScrollReset
        className={`curr-sidebar-link${extra}${current === id ? " is-active" : ""}`}
        aria-current={current === id ? "page" : undefined}
      >
        {label}
      </Link>
    </li>
  );
  return (
    <nav className="curr-sidebar bib-rail" aria-label="Fields">
      <ul className="curr-sidebar-list bib-rail-top">{item("", "Overview")}</ul>
      <div className="curr-sidebar-title">Fields</div>
      <ul className="curr-sidebar-list">
        {RESEARCH_FIELDS.map((f) => item(f.id, f.label))}
        {item(ALL, "All works", " bib-rail-all")}
      </ul>
    </nav>
  );
}

// The three sections of a list: a field's, or every field's under "All works".
// Works arrive newest first. On a field page, the curator's ranked works for
// that field go first, in rank order; "All works" keeps newest first.
function Lists({ works, links, field }: { works: ResearchWork[]; links: Links; field?: string }) {
  const rank = (w: ResearchWork) => (field ? w.fieldRanks[field] ?? Infinity : Infinity);
  return (
    <>
      {SECTIONS.map((s) => {
        // Array sort is stable, so unranked works keep their newest-first order.
        const items = works.filter((w) => w.section === s.id).sort((a, b) => rank(a) - rank(b));
        return (
          <Section key={s.id} title={s.title} intro={s.intro} count={items.length}>
            {items.map((w) => <Entry key={w.id} work={w} withNote={s.id === "selected"} links={links} />)}
          </Section>
        );
      })}
      {!works.length ? <p className="community-unavailable">Nothing listed in this field yet.</p> : null}
    </>
  );
}

type Data = Route.ComponentProps["loaderData"];

// "A and 6 others": the institution a field is most relevant for.
const NAMED_CELLS = 1;
function CellNames({ cells }: { cells: { href: string; title: string }[] }) {
  const named = cells.slice(0, NAMED_CELLS);
  const rest = cells.length - named.length;
  return (
    <>
      {named.map((c, i) => (
        <span key={c.href}>
          {i > 0 ? (i === named.length - 1 && !rest ? " and " : ", ") : null}
          <Link to={c.href}>{c.title}</Link>
        </span>
      ))}
      {rest ? <> <span className="bib-nowrap">and {rest} {rest === 1 ? "other" : "others"}</span></> : null}
    </>
  );
}

function Overview({ d }: { d: Data }) {
  const countFor = (id: string) => d.works.filter((w) => w.fieldIds.includes(id)).length;
  return (
    <>
      <header className="bib-head">
        <h1 className="curr-page-title">Resources</h1>
        <p className="bib-lede">
          This page is a directory of what we believe to be the most relevant work for the project of designing
          institutions for powerful AI. It is curated by a handful of researchers, each an expert in their field.
        </p>
        <p className="bib-lede">
          This is a sister project to{" "}
          <a href="https://paxmachina.ai/welcome-to-pax-machina" target="_blank" rel="noreferrer">Pax Machina</a>. We
          hope the directory is useful to researchers already working on these questions as well as funders and research
          managers, and that it inspires new high-quality submissions and design proposals.
        </p>
      </header>

      <section className="bib-prose" aria-labelledby="bib-fields">
        <h2 id="bib-fields">Fields</h2>
        <ul className="bib-directory">
          {RESEARCH_FIELDS.map((f) => {
            const info = d.fields[f.id];
            const n = countFor(f.id);
            return (
              <li key={f.id}>
                <Link to={fieldHref(f.id)} className="bib-directory-link">
                  <span className="bib-directory-name">{f.label}</span>
                  <span className="bib-directory-blurb">{info?.blurb}</span>
                </Link>
                <div className="bib-directory-meta">
                  {info?.researcher ? <>Curated by <Names names={[info.researcher]} links={d.links} /> · </> : null}
                  {n} {n === 1 ? "work" : "works"}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="bib-directory-all">
          Or see <Link to={fieldHref(ALL)}>all {d.works.length} works</Link> in one list.
        </p>
      </section>

      <section className="bib-prose" aria-labelledby="bib-how">
        <h2 id="bib-how">About the lists</h2>
        <p id="bib-curator">
          Each field has a <em>corresponding researcher</em>, someone who has published in the field and is widely
          regarded as influential in it. They curate its list and decide what goes on it.
        </p>
        <p>
          The lists aren't exhaustive or canonical. They're meant as a starting point for research relevant to AGI
          institutions, and will miss much good work.
        </p>
        <dl className="bib-parts">
          {SECTIONS.map((s) => (
            <div key={s.id}>
              <dt>{s.title}</dt>
              <dd>{s.intro}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bib-prose" aria-labelledby="bib-write">
        <h2 id="bib-write">Write to a field</h2>
        <p>
          We expect significant progress in many of these areas over the coming years, which means the reading lists
          above will inevitably lag behind unpublished results and insights circulating among researchers.
        </p>
        <p>
          Therefore, we are piloting an email service where you can <em>write to a field</em>. The goal is to make it
          as easy as possible for promising researchers to get feedback on their ideas from relevant experts, and for
          funders and operators to quickly understand where the current state of the art is.
        </p>
        <p>
          To make this possible, we are funding junior researchers to operate a switchboard service. They will read
          emails sent to the addresses below and, where appropriate, route them to a senior researcher with the right
          domain expertise.
        </p>
        <p>You can write to a field if you want to know things like:</p>
        <ul className="bib-asks">
          <li>Has this idea been tried before, or is there close precedent for it?</li>
          <li>What work should I read before pushing further in this direction?</li>
          <li>Who else is working on this problem, or would be especially useful to talk to?</li>
          <li>What are the main objections, failure modes, or open questions I should know about?</li>
          <li>Where does this problem fit into the broader research landscape?</li>
        </ul>
        <p>
          Depending on the capacity of our experts, we may not be able to route every email, but we'll prioritize
          questions where we think input from someone in the field could have a high impact. When several people
          write in about related questions, we may also invite them to a live Q&amp;A with experts in the field.
        </p>
        <dl className="bib-emails">
          {RESEARCH_FIELDS.filter((f) => d.fields[f.id]).map((f) => (
            <div key={f.id}>
              <dt><Link to={fieldHref(f.id)}>{f.label}</Link></dt>
              <dd><a href={`mailto:${d.fields[f.id].email}`}>{d.fields[f.id].email}</a></dd>
            </div>
          ))}
        </dl>
      </section>

      <Section
        title="Elsewhere"
        intro="Reading lists and bibliographies maintained by others."
        count={ELSEWHERE.length}
        showCount={false}
      >
        {ELSEWHERE.map((e) => (
          <li key={e.url} className="bib-entry">
            <div className="bib-title">
              <a href={e.url} target="_blank" rel="noreferrer">{e.title}</a>
            </div>
            <div className="bib-byline">{e.by}, {e.note}.</div>
          </li>
        ))}
      </Section>
    </>
  );
}

export default function Resources({ loaderData: d }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const param = searchParams.get("field") ?? "";
  const field = RESEARCH_FIELDS.find((f) => f.id === param);
  // Unknown ids fall back to the overview.
  const current = field ? field.id : param === ALL ? ALL : "";
  const info = field ? d.fields[field.id] : undefined;
  const cells = (field && d.gridCells[field.id]) || [];
  const cellCount = cells.length;

  return (
    <div className="curr-layout bib-layout">
      <Rail current={current} />

      <div className="curr-main bib-main">
        {/* Below the rail's breakpoint, fields collapse into a select. */}
        <label className="research-field-select bib-mobile-select">
          <span className="sr-only">Field</span>
          <select value={current} onChange={(e) => navigate(fieldHref(e.target.value), { replace: true })}>
            <option value="">Overview</option>
            {RESEARCH_FIELDS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            <option value={ALL}>All works</option>
          </select>
        </label>

        {current === "" ? <Overview d={d} /> : null}

        {current === ALL ? (
          <>
            <header className="bib-head">
              <h1 className="curr-page-title">All works</h1>
              <p className="bib-lede">
                Every work from all ten field lists. To know where to start, pick a field, or read{" "}
                <Link to="/resources#bib-how">about the lists</Link>.
              </p>
            </header>
            <Lists works={d.works} links={d.links} />
          </>
        ) : null}

        {field ? (
          <>
            <header className="bib-head">
              <h1 className="curr-page-title">{field.label}</h1>
              {info ? <p className="bib-lede">{info.blurb}</p> : null}
              {info ? (
                <dl className="bib-facts">
                  {info.researcher ? (
                    <>
                      <dt><Link to="/resources#bib-curator">Curated by</Link></dt>
                      <dd>
                        <Names names={[info.researcher]} links={d.links} />
                        {info.researcherBio ? <span className="bib-facts-note">{info.researcherBio}</span> : null}
                      </dd>
                    </>
                  ) : null}
                  {cellCount ? (
                    <>
                      <dt>Relevant for</dt>
                      <dd>
                        <Link to={`/?field=${field.id}`}>
                          {cellCount} grid {cellCount === 1 ? "cell" : "cells"}
                        </Link>
                        <span className="bib-facts-note"><CellNames cells={cells} /></span>
                      </dd>
                    </>
                  ) : null}
                  <dt><Link to="/resources#bib-write">Write to</Link></dt>
                  <dd>
                    <a href={`mailto:${info.email}`}>{info.email}</a>
                    <span className="bib-facts-note">
                      An operator routes it to the right experts.
                    </span>
                  </dd>
                </dl>
              ) : null}
            </header>
            <Lists works={d.works.filter((w) => w.fieldIds.includes(field.id))} links={d.links} field={field.id} />
            <p className="bib-footnote">
              This list isn't exhaustive. <Link to="/resources#bib-how">About the lists</Link>.
            </p>
          </>
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
