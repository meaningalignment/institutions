---
name: institution-cell-dialogue
description: Collaborative workflow for making one Institutions grid cell excellent. Use when Codex is revising a page in data/cells/ or data/fidelity/ with a user, especially when the work should proceed through At a glance, How humans solve / Where AGI breaks, then scenario-grounded Problem Sets, and when lessons from the revision should be codified back into STANDARDS.md or this skill.
---

# Institution Cell Dialogue

## Overview

Use this skill to collaborate with a user on one Institutions cell until the page is substantively strong, then codify any reusable lessons. The skill is conversational on purpose: diagnose, propose concrete alternatives, edit, and check the user's taste before generalizing.

## Start by grounding the page

1. Read the target cell, `STANDARDS.md`, and the relevant schema notes in `AGENTS.md` or `CLAUDE.md`.
2. If the mechanism or row/column context is unclear, read nearby cells in the same row or column.
3. Identify whether the cell is **layered** or **single-mechanism**:
   - Layered cells enumerate several human mechanisms and usually select two or three rebuilds for problem sets.
   - Single-mechanism cells can use a tighter human explanation and one scenario-grounded problem set.
4. Tell the user the current diagnosis in a few sentences: what works, what feels weak, and the next stage to improve.

Prefer editing the page as the dialogue clarifies the shape. Do not hold all changes until the end unless the user asks to brainstorm only.

## Stage 1: At a glance

Goal: make the summary box teach the cell by itself.

Work with the user through three questions:

1. **Coordination challenge.** What is the institutional problem in one "How [parties] [verb] [object] [under friction]" sentence?
2. **Examples.** Which 3-5 named human institutions or practices best reveal the mechanism?
3. **How AGI breaks them.** Which 3-6 agent-era properties or institutional changes break those examples at the mechanism level?

Good dialogue moves:

- Offer two or three candidate phrasings when the frame is fuzzy.
- Ask whether an industry anchor would sharpen the examples.
- Split any AGI-breaks bullet that hides multiple failures behind "and" or "or."
- Keep AGI-breaks bullets at the mechanism level; avoid turning them into proposed fixes too early.
- Preserve warranted uncertainty when a bullet depends on future agent capabilities or adoption patterns.
- Watch for system-level failures, not only failures inside a single agent.
- Keep the bullets short enough to survive in the grid.

Do not move on until the summary names the right institution-family. A weak summary usually means the body will sprawl.

## Stage 2: How humans solve / Where AGI breaks

Goal: make the analytical core concrete and derivational.

For **How humans solve this today**:

1. Name actual institutions, practices, cases, and roles.
2. Layer the mechanisms only when the human answer is genuinely plural.
3. Keep mechanism names stable and numbered when layered.
4. Close with a named vivid case introduced by "A vivid case:".

For **Where AGI breaks it**:

1. Do not write an intro paragraph.
2. Treat the At a Glance `How AGI breaks them` bullets as the outline.
3. Expand each bullet into a paragraph or numbered item in the same order.
4. Name the relevant structural agent properties inside those expansions.
5. Keep the same mechanism labels and order from the human section.
6. Say when a mechanism transposes rather than simply fails.
7. Remove anthropomorphic claims and replace them with institutional properties.

Good dialogue moves:

- Show the user the proposed mechanism list before drafting deeply.
- Check that the AGI-breaks body is not inventing a different taxonomy from the summary bullets.
- Re-check the problem sets after the AGI-breaks bullets change; old problem sets often solve yesterday's framing.
- Ask "is this the right human anchor?" before investing in a full rewrite.
- Treat the vivid case as a test object: if it does not exercise the mechanisms, revise it.
- Keep scenario prose out of the AGI-breaks section; put concrete scenes inside the problem sets that use them.

## Stage 3: Scenarios and Problem Sets

Goal: turn the analysis into design work.

Do not create a detached `## Scenarios` section. Put scenarios inside the problem sets, where they can serve as high-stakes test objects for the design work.

For each selected problem set:

1. Pick one rebuild, not the whole cell.
2. Add `**Scenario.**` with a plain-language, domain-grounded, high-stakes example of the coordination mechanism or institution working, failing, or needing to be rebuilt. Fold context into the scenario.
3. Add `**Challenge:**` with the design task, success criterion, and deliverable.
4. Write design choices as forks with visible options.

Good dialogue moves:

- Ask the user which rebuilds feel most underspecified or most important.
- Offer several candidate problem-set trios when the framing has changed, then let the user pick or recombine.
- Test each candidate problem set against the final AGI-breaks bullets: what failure does it serve?
- Move any standalone scenario material into the relevant problem set.
- Make sure the scenario names the institution the team is supposed to design, keeps jargon low, and makes the stakes clear.
- Convert vague topics into design challenges.
- Make success criteria adversarial but plausible.
- Fold success criteria and deliverables into `Challenge:` rather than leaving them as separate sections.
- Prefer one crisp problem set over three broad ones.

## Codify after the page works

Only generalize after the target page is good enough to serve as evidence.

When the user asks to codify what happened:

1. Update `STANDARDS.md` if the lesson changes the quality bar for many cells.
2. Update this skill if the lesson changes how Codex should collaborate with the user.
3. Keep page-specific insights in the page; do not inflate the standard with one-off details.
4. Keep standards and skill guidance generic across rows, columns, domains, and mechanisms.

## Voice and collaboration

Be rigorous without becoming ceremonial. The user is a thinking partner, not a ticket submitter. Make clear editorial judgments, but present uncertain choices as choices. Good prompts are concrete and small:

- "I see two possible anchors. I prefer the more specific one because it makes the mechanisms visible."
- "This AGI-breaks bullet is doing two jobs. I would split the two failure modes."
- "The problem set is still a topic. The missing procedure seems to be more specific than the heading."

Avoid long abstract lectures, generic praise, and dramatic prose. The work should feel like two people sharpening an institutional design brief at the table.
