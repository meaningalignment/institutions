# Plan: Bringing cells into compliance with the standards

Goal: bring all 35 cells in `data/cells/` to the bar set in [STANDARDS.md](../STANDARDS.md), starting from the four we worked through (dyadic-incentives, group-norms, group-thick-commitments, community-rights).

The plan is in phases. Each phase has a clear exit criterion. Don't start a later phase before the earlier one is settled — they depend on each other.

## Phase 0: Setup decisions

Before applying the standard at scale, decide on the things left open. Without these, the work in Phase 2 will drift.

- [ ] **Decide the status taxonomy.** Pick what `status:` means now that we have a checklist. Candidates: binary (meets / not yet), three-tier tied to checklist completeness, or tag-set (anchor-OK, breaks-it-OK, problem-sets-OK).
- [ ] **Decide on the glossary of agent properties.** Either:
  - (a) Create `data/agent-properties.md` (or similar) as a reference page that each cell can link to, and standardize property names (e.g. "tireless and high-throughput," "no personal stake," "re-instanceable").
  - (b) Skip — let each cell name its relevant properties without a shared registry.
- [ ] **Document the one-mechanism cell variant.** Add a paragraph to CLAUDE.md / STANDARDS.md saying that cells with a single human institutional answer (e.g. dyadic-incentives) keep single-paragraph anchors and may have one problem set.
- [ ] **Decide where the human failure scene lives.** For layered cells with rebuild-sketches Scenarios, options for placing the vivid AGI failure scene: at end of breaks-it, as a new "## Failure scene" subsection, fold into the anchor, or cut. Pick one and update the schema docs.

Exit criterion: STANDARDS.md updated with the resolved questions; the registry decision is acted on (created or not).

## Phase 1: Retrofit the cells we've already worked on

These cells are mostly to standard, but each has a known gap.

- [ ] **group-norms** — Apply the differences-preamble pattern to "Where AGI breaks it." Currently uses the older structural-assumption-per-bullet form. ~30 minutes.
- [ ] **dyadic-incentives** — Run the full checklist. Decide whether the single-problem-set form is correct (per the one-mechanism variant) or whether a second problem set on reputation/identity should be added. ~30 minutes.
- [ ] **dyadic-norms** — Was at status "ready" before this session and not touched in our four. Run the checklist; this cell likely needs a full revision pass under the new standard.

Exit criterion: all four worked cells pass the checklist; plus dyadic-norms diagnosed and (if needed) revised.

## Phase 2: Apply the standard to the remaining cells

31 cells to go. The standard execution sequence per cell:

1. **Read the cell.** 5–10 min.
2. **Diagnose against the checklist.** 5 min. Identify what's missing.
3. **Decide: redraft, revise, or pass.**
   - *Redraft* — anchor isn't layered, breaks-it is anthropomorphic, problem sets are omnibus. Use the four worked cells as templates.
   - *Revise* — bones are right, specific sections need updating.
   - *Pass* — meets the bar.
4. **Apply.** Targeted edits or a full rewrite.
5. **Re-run checklist.** Confirm.

### Cell-by-cell status

The 31 cells to bring up to standard, grouped by row. Mark status as you go: `[ ]` not started, `[~]` in progress, `[D]` diagnosed only, `[X]` done.

**Dyadic (5 cells)**
- [ ] dyadic-protocols
- [ ] dyadic-preferences (was status `ready` pre-session — likely needs revision pass)
- [ ] dyadic-rights
- [ ] dyadic-expertise
- [ ] dyadic-thick-commitments

**Group (5 cells)**
- [ ] group-protocols
- [ ] group-preferences
- [ ] group-rights
- [ ] group-incentives
- [ ] group-expertise

**Community (6 cells)**
- [ ] community-protocols
- [ ] community-preferences
- [ ] community-incentives (was status `ready` pre-session)
- [ ] community-expertise
- [ ] community-norms
- [ ] community-thick-commitments

**National (7 cells)**
- [ ] national-protocols
- [ ] national-preferences
- [ ] national-rights (was status `ready` pre-session)
- [ ] national-incentives
- [ ] national-expertise
- [ ] national-norms
- [ ] national-thick-commitments

**Global (7 cells)**
- [ ] global-protocols
- [ ] global-preferences
- [ ] global-rights
- [ ] global-incentives
- [ ] global-expertise
- [ ] global-norms (was status `ready` pre-session)
- [ ] global-thick-commitments

### Execution-ordering options

Pick one before starting Phase 2:

- **A. By column** (norms across rows, then rights across rows, etc.). Benefit: column-level mechanism vocabulary transfers; the 5 layers of finance norms might generalize to community/national/global norms with adjustment.
- **B. By row** (finish group, then community, etc.). Benefit: row-level coherence; reader can scan an entire scale.
- **C. By interest / freshness** (pick whichever cell has the liveliest design problem next). Benefit: highest-quality output; lowest fatigue.

Recommended default: **C**, with the checklist as the fast diagnostic.

Exit criterion: all 31 cells have status `[X]` (done).

## Phase 3: Cross-cell coherence

Once cells are individually to standard, look at the grid as a whole.

- [ ] **Apply status taxonomy** (Phase 0 decision) to every cell.
- [ ] **Add `related:` cross-references** where one cell's problem set substantially depends on another's rebuild. (Example: group-norms's "regulator-anticipation rebuild" connects to community-rights's "external appeal authority.")
- [ ] **Audit mechanism vocabulary across cells.** Where the same agent property shows up under different names ("tireless and high-throughput" vs. "high-volume" vs. "fast"), normalize.
- [ ] **Audit anchor-industry choices.** Some cells benefit from being explicitly industry-anchored (finance for group-norms). For the rest, decide which industry — or whether the cell is better as cross-industry by design.
- [ ] **Surface cross-cell connections in the UI** (if the `related:` work merits it).

Exit criterion: the grid reads as a single coherent design map, not 35 independent essays.

## Phase 4: Evolve the standard

After ~10 cells under the standard, take a reflective pass:

- [ ] What patterns appeared that the checklist didn't capture?
- [ ] What in the checklist turned out to be wrong or too rigid?
- [ ] Are 2–3 problem sets the right number, or do some cells need more / fewer?
- [ ] Are there cells the standard fits badly that suggest a second permissible structure?
- [ ] Update STANDARDS.md based on what we've learned.

Exit criterion: STANDARDS.md updated; the project's authors agree it reflects the current bar.

## Working notes

- The four worked cells are the templates. Refer to them when drafting a new one.
- Don't drift the schema mid-pass. If a cell suggests a schema change, note it in Phase 4 rather than acting on it immediately.
- A cell that fails the checklist in only 1–2 places often takes 30 min to fix. A cell that needs a full redraft is 1–2 hours of substantive work — usually best done with the user in the room rather than batch.
