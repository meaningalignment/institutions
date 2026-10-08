import { isRouteErrorResponse, Link, useNavigate, useSearchParams } from "react-router";
import type { Route } from "./+types/resources";
import { allWorks, getCellFieldMap, loadResources } from "../lib/resources.server";
import { researcherKey, type ResearchWork, type ResourceSection } from "../lib/resources";
import { loadGridCells } from "../lib/content.server";
import { RESEARCH_FIELDS } from "../lib/research-fields";
import { staticContentHeaders } from "../lib/cache.server";
import { COLS, OG_IMAGE_META, ROWS, SITE_NAME, SITE_ORIGIN } from "../lib/constants";

export const headers = staticContentHeaders;

// The institutions on the AGI grid that draw on a field (same map the grid
// highlights with, so the count matches what /?field= shows). Cells where the
// field ranks highest come first, then in grid order.
function gridCellsFor(fieldId: string): { href: string; title: string }[] {
  const grid = loadGridCells();
  const gridOrder = ROWS.flatMap((r) => COLS.map((c) => `${r.id}-${c.id}`));
  const cells: { key: string; rank: number }[] = [];
  for (const [key, fieldIds] of Object.entries(getCellFieldMap())) {
    const cell = grid[key];
    const rank = fieldIds.indexOf(fieldId);
    if (!cell || cell.hiddenOnAgi || !cell.summary || rank < 0) continue;
    cells.push({ key, rank });
  }
  cells.sort((a, b) => a.rank - b.rank || gridOrder.indexOf(a.key) - gridOrder.indexOf(b.key));
  return cells.map(({ key }) => {
    const [row, ...col] = key.split("-");
    return { href: `/cell/${row}/${col.join("-")}?field=${fieldId}`, title: grid[key].summary };
  });
}

// Everything comes from data/resources/ (see app/lib/resources.ts). Field copy
// and list sizes go to every view; works only for the list on screen.
export function loader({ request }: Route.LoaderArgs) {
  const param = new URL(request.url).searchParams.get("field") ?? "";
  const field = RESEARCH_FIELDS.find((f) => f.id === param);
  const { fields: lists, elsewhere, people } = loadResources();
  const all = allWorks();
  const fields = Object.fromEntries(
    RESEARCH_FIELDS.map((f) => {
      const { works, ...info } = lists[f.id];
      return [f.id, { ...info, count: works.length }];
    })
  );
  return {
    fields,
    works: field ? lists[field.id].works : param === ALL ? all : [],
    total: all.length,
    gridCells: field ? gridCellsFor(field.id) : [],
    // Author and curator names link to their X profile in people.md.
    links: people,
    elsewhere,
  };
}

export function meta({ location, loaderData }: Route.MetaArgs) {
  const param = new URLSearchParams(location.search).get("field");
  const field = RESEARCH_FIELDS.find((f) => f.id === param);
  const page = field ? `${field.label} · Resources` : param === "all" ? "All works · Resources" : "Resources";
  const title = `${page} — ${SITE_NAME}`;
  const desc = field
    ? `${loaderData?.fields[field.id]?.blurb ?? ""} A reading list for AGI institutions, curated by a researcher in the field.`.trim()
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
  const all = work.authors.filter((name) => name !== "et al.");
  const etAl = all.length > AUTHOR_LIMIT || all.length < work.authors.length;
  return (
    <>
      <Names names={all.slice(0, AUTHOR_LIMIT)} links={links} />
      {etAl ? " et al." : ""}
    </>
  );
}

function Entry({ work, withNote, links }: { work: ResearchWork; withNote: boolean; links: Links }) {
  // Venue and type trail the year: "2022 · PNAS · Peer-reviewed". Conference
  // venues carry their own year ("ICLR 2026"); drop it so only one year shows.
  // For background work the venue alone says enough; peer review is a modern label.
  const venue = work.venue?.replace(/\s+(19|20)\d{2}$/, "") ?? null;
  const type = work.type && !(work.section === "background" && venue) ? work.type : null;
  const meta = [work.year, venue, type].filter(Boolean).join(" · ");
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
const SECTIONS: { id: ResourceSection; title: string; intro: string }[] = [
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
// Works arrive in page order: a field's in its file's order, "All works"
// newest first.
function Lists({ works, links }: { works: ResearchWork[]; links: Links }) {
  return (
    <>
      {SECTIONS.map((s) => {
        const items = works.filter((w) => w.section === s.id);
        return (
          <Section key={s.id} title={s.title} intro={s.intro} count={items.length}>
            {items.map((w) => <Entry key={w.url} work={w} withNote={s.id === "selected"} links={links} />)}
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
            const n = info.count;
            return (
              <li key={f.id}>
                <Link to={fieldHref(f.id)} className="bib-directory-link">
                  <span className="bib-directory-name">{f.label}</span>
                  <span className="bib-directory-blurb">{info?.blurb}</span>
                </Link>
                <div className="bib-directory-meta">
                  Curated by TBD ·{" "}
                  {n} {n === 1 ? "work" : "works"}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="bib-directory-all">
          Or see <Link to={fieldHref(ALL)}>all {d.total} works</Link> in one list.
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
          {RESEARCH_FIELDS.filter((f) => d.fields[f.id].email).map((f) => (
            <div key={f.id}>
              <dt><Link to={fieldHref(f.id)}>{f.label}</Link></dt>
              <dd><a href={`mailto:${d.fields[f.id].email}`}>{d.fields[f.id].email}</a></dd>
            </div>
          ))}
        </dl>
      </section>

      <Section
        title="Elsewhere"
        intro={d.elsewhere.intro}
        count={d.elsewhere.items.length}
        showCount={false}
      >
        {d.elsewhere.items.map((e) => (
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
  const cells = field ? d.gridCells : [];
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
                  {/* Curators are hidden until they are confirmed; names stay in the field files. */}
                  <dt><Link to="/resources#bib-curator">Curated by</Link></dt>
                  <dd>TBD</dd>
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
                  {info.email ? (
                    <>
                      <dt><Link to="/resources#bib-write">Write to</Link></dt>
                      <dd>
                        <a href={`mailto:${info.email}`}>{info.email}</a>
                        <span className="bib-facts-note">
                          An operator routes it to the right experts.
                        </span>
                      </dd>
                    </>
                  ) : null}
                </dl>
              ) : null}
            </header>
            <Lists works={d.works} links={d.links} />
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
