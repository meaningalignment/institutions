---
human_label: "Professional codes of conduct"
status: draft
subtitle: How a team builds and transmits a felt sense of what's in-character vs. off-key.
---

# Agent norm intuition

## How do humans solve this today?

Norm intuition — the felt sense that an action is in-character or off-key — gets built in humans through several layered mechanisms, none of which fully replaces the others:

1. **Tacit absorption inside small teams.** New hires absorb a team's "what we, here, do" the slow way: by being corrected, by watching what gets praised and what gets quietly redone, by overhearing how senior people talk about colleagues' choices. The norms aren't written down because writing them down flattens them and prematurely codifies what's supposed to remain alive. After a while you can *feel* a violation without being able to fully articulate why.

2. **Professional codes of conduct.** Where a profession has formed, articulating what's in-character vs. off-key is done deliberately by associations — bar associations, medical boards, engineering societies, IEEE working groups. The association deliberates (often for years) about edge cases, publishes codes, runs continuing-ed, and disciplines members who clearly transgress. The codes don't dictate every decision but crystallize what the profession has decided is over the line.

3. **Regulator-anticipation.** In regulated fields, professionals develop a felt sense of "what the regulator would write up" that operates faster than the rulebook. A senior compliance officer doesn't always read the regs before flagging a deal; she's internalized what the SEC or FDA would care about. Juniors acquire this by working alongside seniors and watching what gets flagged.

4. **Contractualist reasoning.** When a case isn't covered by code or precedent, professionals reason about what would be acceptable to everyone affected — what could you defend in front of the customer, the colleague who gave you the lead, the family, the board, without embarrassment? The intuition here is less "what we do" and more "what could you say you did, to whom?"

5. **Case-based learning from canonical examples.** Lawyers read judicial opinions; doctors read M&M reports; ethicists internalize Tarasoff, Tuskegee, the Belmont Report. Reading enough consequential cases builds a feel for the contour of the relevant norm, even when the new case isn't quite like any of them.

> [!NOTE]
> When Yasmin joined her research team as a postdoc, she spent her first month quietly recalibrating her tone in lab meetings — the team teased each other more than her last group, but pulled punches in front of visitors more than she expected. By month three she could spot when a teammate was acting unlike themselves. The same Yasmin, in her work with human-subjects protocols, also drew on the discipline's case literature and on what she expected the IRB to flag. Different norm intuitions, layered on top of each other.

## Where AGI breaks it

When a team's coding or writing agent has been with them long enough to absorb the surface of their habits, the norm-intuition is brittle in ways human intuition isn't:

1. **Surface mimicry isn't intuition.** An agent can mimic a team's voice while missing what the voice was tracking — the unstated values, the things-we-don't-do, the cases where the team would have made an exception.
2. **Negative knowledge is hard to encode.** "What we don't do" is harder to learn from examples than "what we do"; humans pick it up from corrections and from witnessing other people's mistakes, neither of which agents readily encounter.
3. **The agent doesn't get socialized.** A junior team member learns norms partly by being mildly embarrassed; an agent has no such feedback loop, so the norms it absorbs are filtered through whatever the team explicitly bothered to tell it.
4. **The other layers don't compose by default.** A human professional's intuition draws on team-tacit absorption *plus* the field's code, *plus* a sense of what the regulator would flag, *plus* contractualist instinct, *plus* internalized canonical cases. An agent has each of these available in principle — codes are public, case law is searchable — but no default architecture for weighting them against the team's specific style. By default it picks one (usually the team's surface) and ignores the rest, or invokes whichever happens to surface in retrieval.
5. **Drift is invisible.** When an agent's sense of "in-character" drifts — because of an update, a context shift, or a new team member — nobody notices until something off-key gets shipped.

> [!WARNING]
> A six-person research team runs a coding agent that's been with them for eight months. It's absorbed their internal habits — when to hedge, when to just ship, how they handle a reviewer who's being unreasonable, what they'll push back on a grant officer about. Yasmin just joined as a postdoc and has a clear sense of what people on the team would and wouldn't do; she can tell when the agent is off-key. She wishes the agent had the same sense — a real intuition for "what we, here, don't do" — so she didn't have to keep rewriting its replies to their program officer.

## Problem Sets

### Negative-Norm Intuition for a Team's Long-Lived Agent

**Anchor contexts.** A six-person research team's coding-and-correspondence agent that handles drafts to grant officers, journal editors, and reviewers; a small clinic's intake agent that drafts patient-facing communication and triages calls.

**The gap.** We lack a way to instill in a team's agent a felt sense of negative norms ("what we, here, don't do") that survives team-member turnover and doesn't require constant explicit correction by every member.

**Design choices the team must take a position on.**
1. **Bootstrap layers.** Which human mechanisms does the agent's intuition draw on, and how are they weighted — team-tacit corrections, the field's professional code, a regulator-anticipation prior, contractualist reasoning over affected parties, canonical case-base from the discipline? Pick a stack and a precedence rule.
2. **Source of negative knowledge.** Explicit "don't do" lists curated by the team, harvested from past corrections to the agent, inferred from teammate disagreement patterns, or all three layered?
3. **Calibration to whom.** Single team member's intuition (whose?), consensus across the team, or explicitly weighted (more senior people's "no" counts more)?
4. **Drift-detection check.** When the agent drifts off-key, who is positioned to notice — a designated "norm rotation," a periodic external audit by a former member, the new joiner whose fresh eyes catch it?
5. **Revisability.** When the team's norms shift (they decide to push back harder now), who has authority to update the agent's negative-norm model? Does it require consensus or single-person trigger?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A new postdoc joins; within two weeks she has a way to flag "the agent wouldn't do this if it were one of us" that the team takes seriously and acts on.
- A senior team member leaves; the negative-norm knowledge they were the source of doesn't leave with them.
- The team's norms shift (they decide they will push back harder on grant officers now); the agent updates within a week without a long retraining process.
- The agent is asked to do something off-key by an outsider; it pushes back the way a team member would.
- The agent is updated to a new model version; the negative-norm intuition transfers, verifiably.

**Deliverable.** The norm-elicitation and norm-update protocol for a small research team. 5–10 steps. Identify what part of the protocol has no analogue in how human teams socialize new members.
