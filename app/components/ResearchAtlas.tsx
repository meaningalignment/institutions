import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import type { Community, ResearchWork, Researcher } from "../lib/researchers.server";
import { isInResearchField, RESEARCH_FIELDS } from "../lib/research-fields";
import { researcherProfilePath } from "../lib/researcher-links";
import { ResearcherCard } from "./ResearcherCard";

type View = "people" | "papers";

function Section({
  id,
  title,
  blurb,
  people,
  paperCounts,
}: {
  id: string;
  title: string;
  blurb: string;
  people: Researcher[];
  paperCounts: Map<number, number>;
}) {
  if (!people.length) return null;
  return (
    <section id={id} className="community-section">
      <div className="community-section-heading">
        <h2>{title}</h2>
        <span aria-label={`${people.length} people`}>{people.length}</span>
      </div>
      <p className="community-section-intro">{blurb}</p>
      <div className="researcher-grid">
        {people.map((researcher) => <ResearcherCard key={researcher.id} researcher={researcher} paperCount={paperCounts.get(researcher.id) ?? 0} />)}
      </div>
    </section>
  );
}

function PeopleView({ community, works, selectedField }: { community: Community; works: ResearchWork[]; selectedField: string }) {
  const paperCounts = useMemo(() => {
    const workIdsByResearcher = new Map<number, Set<string>>();
    for (const work of works) {
      for (const researcher of work.researchers) {
        const ids = workIdsByResearcher.get(researcher.id) ?? new Set<string>();
        ids.add(work.id);
        workIdsByResearcher.set(researcher.id, ids);
      }
    }
    return new Map([...workIdsByResearcher].map(([id, workIds]) => [id, workIds.size]));
  }, [works]);
  const activeField = RESEARCH_FIELDS.find((field) => field.id === selectedField);
  const filterPeople = (people: Researcher[]) => people.filter((person) => {
    return !activeField || isInResearchField(person, activeField);
  });
  const groups = [
    { id: "scouts-advisors", title: "Scouts & Advisors", blurb: "Advisors who help us find and vet the right people and problems, with what they scout for.", people: filterPeople(community.advisors) },
    { id: "community-members", title: "Community members", blurb: "Researchers active in the group — on Signal or Slack, or at a Zoom meeting or workshop.", people: filterPeople(community.community) },
    // Friends hidden for now; restore this entry to bring the section back.
    // { id: "friends", title: "Friends", blurb: "Warm and committed people we're building with who aren't yet in the channels above.", people: filterPeople(community.friends) },
  ];
  const resultCount = groups.reduce((total, group) => total + group.people.length, 0);

  return (
    <div className="research-people-view">
      {groups.map((group) => <Section key={group.id} {...group} paperCounts={paperCounts} />)}
      {!resultCount ? <p className="community-unavailable">No researchers match those filters.</p> : null}
    </div>
  );
}

function ResearcherLink({ researcher }: { researcher: ResearchWork["researchers"][number] }) {
  return <Link to={researcherProfilePath(researcher)}>{researcher.name}</Link>;
}

// Long author lists would blow out the card, so cap them and roll the rest
// into a "+N" count. The cap is generous enough that big collaborations still
// show the roster members who are linked, since those links are the point.
const AUTHOR_LIMIT = 8;

// Mirror of nameKey in researchers.server.ts: author strings vary from the
// roster in case, accents and hyphenation.
function nameKey(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
}

function AuthorList({ work }: { work: ResearchWork }) {
  const linkedByName = new Map(work.researchers.map((researcher) => [nameKey(researcher.name), researcher]));
  // Keep the paper's own author order, but fall back to the linked researchers
  // for canonical works, which carry no separate author list. "et al." is a
  // placeholder in the source data, not a person.
  const ordered = (work.authors.length ? work.authors : work.researchers.map((r) => r.name))
    .filter((name) => name !== "et al.");
  const shown = ordered.slice(0, AUTHOR_LIMIT);
  const hidden = ordered.length - shown.length;

  return (
    <div className="research-work-authors">
      {shown.map((name, index) => {
        const researcher = linkedByName.get(nameKey(name));
        return (
          <span key={name}>
            {index > 0 ? ", " : ""}
            {researcher ? <ResearcherLink researcher={researcher} /> : name}
          </span>
        );
      })}
      {hidden > 0 ? <span className="research-work-authors-more">+{hidden} more</span> : null}
    </div>
  );
}

function WorkCard({ work, compact = false }: { work: ResearchWork; compact?: boolean }) {
  return (
    <article className={`research-work-card${compact ? " is-compact" : ""}`}>
      <div className="research-work-meta">{work.year ?? "Selected work"}</div>
      <h3>
        {work.url ? <a href={work.url} target="_blank" rel="noreferrer">{work.title}</a> : work.title}
      </h3>
      {!compact && work.summary ? <p>{work.summary}</p> : null}
      <AuthorList work={work} />
    </article>
  );
}

function PapersView({ works, selectedField }: { works: ResearchWork[]; selectedField: string }) {
  const activeField = RESEARCH_FIELDS.find((field) => field.id === selectedField);
  // A paper has no fields of its own; it inherits them from the linked
  // researchers, so the one field selector works across both views.
  const visible = useMemo(() => (
    activeField ? works.filter((work) => work.fieldIds.includes(activeField.id)) : works
  ), [activeField, works]);
  const canonical = visible.filter((work) => work.tier === "canonical");
  const more = visible.filter((work) => work.tier === "more");

  return (
    <div className="research-papers-view">
      <section className="research-paper-section">
        <div className="community-section-heading"><h2>Selected papers</h2><span>{canonical.length}</span></div>
        <p className="community-section-intro">Critical for understanding the field, selected and maintained by the scouts.</p>
        <div className="research-work-grid">{canonical.map((work) => <WorkCard key={work.id} work={work} />)}</div>
      </section>
      <section className="research-paper-section">
        <div className="community-section-heading"><h2>More work in the field</h2><span>{more.length}</span></div>
        <div className="research-work-grid">{more.map((work) => <WorkCard key={work.id} work={work} />)}</div>
      </section>
      {!visible.length ? <p className="community-unavailable">No papers match those filters.</p> : null}
    </div>
  );
}

export function ResearchAtlas({ community, works }: { community: Community; works: ResearchWork[] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawView = searchParams.get("view");
  const view: View = rawView === "papers" ? rawView : "people";
  const rawField = searchParams.get("field") ?? "";
  const selectedField = RESEARCH_FIELDS.some((field) => field.id === rawField) ? rawField : "";
  function selectView(next: View) {
    const params = new URLSearchParams(searchParams);
    if (next === "people") params.delete("view"); else params.set("view", next);
    setSearchParams(params, { replace: true });
  }
  function selectField(next: string) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("field", next); else params.delete("field");
    setSearchParams(params, { replace: true });
  }
  const allPeople = useMemo(() => [
    ...community.advisors,
    ...community.community,
    ...community.friends,
  ], [community]);
  return (
    <>
      <div className="research-directory-toolbar">
        <nav className="research-view-switch" aria-label="Browse research community by">
          {([['people', 'People'], ['papers', 'Papers']] as const).map(([id, label]) => (
            <button key={id} type="button" className={view === id ? "active" : ""} onClick={() => selectView(id)} aria-pressed={view === id}>{label}</button>
          ))}
        </nav>
        <label className="research-field-select">
          <span className="sr-only">{view === "people" ? "Filter people by field" : "Filter papers by field"}</span>
          <select value={selectedField} onChange={(event) => selectField(event.target.value)}>
            <option value="">All fields</option>
            {RESEARCH_FIELDS.map((field) => <option key={field.id} value={field.id}>{field.label}</option>)}
          </select>
        </label>
      </div>
      {view === "people"
        ? <PeopleView community={community} works={works} selectedField={selectedField} />
        : <PapersView works={works} selectedField={selectedField} />}
    </>
  );
}
