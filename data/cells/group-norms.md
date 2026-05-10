# Agent norm intuition

## How humans solve this today

Small teams develop a tacit "what we, here, do" — a sense of what's in-character and what's off-key. New hires absorb it the slow way: by being corrected, by watching what gets praised and what gets quietly redone, by overhearing how senior people talk about their colleagues' choices. The norms cover everything from how blunt to be in a Slack message, to whether you push back on a reviewer who's being unreasonable, to what counts as a good-enough excuse for missing a deadline. They're not written down because writing them down both flattens them and prematurely codifies what is supposed to remain alive. Crucially, after a while you can *feel* a violation; you know your colleague is "off" without being able to fully articulate why.

A vivid case: When Yasmin joined her research team as a postdoc, she spent her first month quietly recalibrating her tone in lab meetings — the team teased each other more than her last group, but pulled punches in front of visitors more than she expected. By month three she could spot when a teammate was acting unlike themselves.

## Where AGI breaks it

When a team's coding or writing agent has been with them long enough to absorb the surface of their habits, the norm-intuition is brittle in ways human intuition isn't:

1. **Surface mimicry isn't intuition.** An agent can mimic a team's voice while missing what the voice was tracking — the unstated values, the things-we-don't-do, the cases where the team would have made an exception.
2. **Negative knowledge is hard to encode.** "What we don't do" is harder to learn from examples than "what we do"; humans pick it up from corrections and from witnessing other people's mistakes, neither of which agents readily encounter.
3. **The agent doesn't get socialized.** A junior team member learns norms partly by being mildly embarrassed; an agent has no such feedback loop, so the norms it absorbs are filtered through whatever the team explicitly bothered to tell it.
4. **Drift is invisible.** When an agent's sense of "in-character" drifts — because of an update, a context shift, or a new team member — nobody notices until something off-key gets shipped.

A scenario: A six-person research team runs a coding agent that's been with them for eight months. It's absorbed their internal habits — when to hedge, when to just ship, how they handle a reviewer who's being unreasonable, what they'll push back on a grant officer about. Yasmin just joined as a postdoc and has a clear sense of what people on the team would and wouldn't do; she can tell when the agent is off-key. She wishes the agent had the same sense — a real intuition for "what we, here, don't do" — so she didn't have to keep rewriting its replies to their program officer.

## Problem Sets

### Negative-Norm Intuition for a Team's Long-Lived Agent

**Anchor contexts.** A six-person research team's coding-and-correspondence agent that handles drafts to grant officers, journal editors, and reviewers; a small clinic's intake agent that drafts patient-facing communication and triages calls.

**The gap.** We lack a way to instill in a team's agent a felt sense of negative norms ("what we, here, don't do") that survives team-member turnover and doesn't require constant explicit correction by every member.

**Design choices the team must take a position on.**
1. **Source of negative knowledge.** Explicit "don't do" lists curated by the team, harvested from past corrections to the agent, inferred from teammate disagreement patterns, or all three layered?
2. **Calibration to whom.** Single team member's intuition (whose?), consensus across the team, or explicitly weighted (more senior people's "no" counts more)?
3. **Drift-detection check.** When the agent drifts off-key, who is positioned to notice — a designated "norm rotation," a periodic external audit by a former member, the new joiner whose fresh eyes catch it?
4. **Revisability.** When the team's norms shift (they decide to push back harder now), who has authority to update the agent's negative-norm model? Does it require consensus or single-person trigger?
5. **New-joiner onboarding.** When a new joiner detects off-key behavior, what's their channel — direct correction, raise at standup, formal "norm break" the team adjudicates?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A new postdoc joins; within two weeks she has a way to flag "the agent wouldn't do this if it were one of us" that the team takes seriously and acts on.
- A senior team member leaves; the negative-norm knowledge they were the source of doesn't leave with them.
- The team's norms shift (they decide they will push back harder on grant officers now); the agent updates within a week without a long retraining process.
- The agent is asked to do something off-key by an outsider; it pushes back the way a team member would.
- The agent is updated to a new model version; the negative-norm intuition transfers, verifiably.

**Deliverable.** The norm-elicitation and norm-update protocol for a small research team. 5–10 steps. Identify what part of the protocol has no analogue in how human teams socialize new members.
