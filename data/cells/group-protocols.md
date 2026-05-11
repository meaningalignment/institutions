---
human_label: "Team protocols & workflows"
status: draft
---

# Team protocols & workflows

## What problems do these institutions solve today?

Small teams converge on workflows the way long-married couples converge on division of labor: through repeated practice, occasional argument, and selective formalization. Engineering teams have stand-ups, design reviews, RFCs; medical teams have rounds and morbidity-and-mortality conferences; architecture studios have design crits and red-line reviews. The shared pattern is: at certain known moments, the team pauses, surfaces what's been decided and on what basis, lets disagreement be aired, and resolves it in front of the people whose work it affects. The protocols are partly about decisions; equally, they're about distributing legibility — every team member knows what was concluded and why, and could roughly defend it to an outsider.

> [!NOTE]
> At Nasir's architecture studio, every Wednesday the team puts current projects on the wall and walks through structural decisions, code-compliance issues, and any place two engineers had disagreed during the week. The disagreements are usually settled in twenty minutes, and the rest of the team learns the reasoning along the way.

## Where AGI breaks it

When AI agents become full participants in the team's work — drafting structural calculations, reviewing each other's outputs, arguing for and against approaches — the existing protocols miss some load:

1. **Agent disagreements happen continuously, not at meeting cadence.** Two agents may have reached opposing conclusions hours before the human review window. By the time the team sees them, both are deep in supporting documentation that nobody can read in a day.
2. **The cost of human attention to a disagreement is now the bottleneck.** Agents can produce more reasoned dispute than the humans can adjudicate; the protocol needs an early-flagging mechanism so that humans only spend attention on disputes that warrant it.
3. **What the agent "relied on" is hard to expose.** A human reviewer can ask another human "why did you decide that?" and get a usable answer; an agent's reasoning trace may not compress to anything the human can evaluate.
4. **Stand-up doesn't include agents in any meaningful sense.** Humans pause to share context; agents share none unless explicitly asked, and the protocol provides no asking.

> [!WARNING]
> Nasir runs a five-person architecture studio. Three of them now work alongside AI agents that draft structural calculations, pull precedents, run code-compliance checks, and argue against each other's conclusions. This week two of the agents reached contradictory recommendations on a seismic retrofit, and neither Nasir nor his junior engineer could tell which was better reasoned — the traces were too long, the citations too dense. He needs a shared protocol his team and their agents all follow for flagging disagreement early, surfacing what each side actually relied on, and bringing humans in at the right moment. Without one, the studio keeps shipping work it can't quite stand behind.

## Problem Sets

### Surfacing Agent-vs-Agent Disagreement at Human-Adjudicable Moments

**Anchor contexts.** A small architecture studio with multiple specialist agents reviewing each other's structural calculations and precedents; a small editorial team with research and fact-checking agents that flag disagreements with the writing agent's draft.

**The gap.** We lack a team protocol for human-agent mixed teams that surfaces agent-vs-agent disagreement at the moment a human can usefully adjudicate, without burying the team in adjudication work it doesn't have time for.

**Design choices the team must take a position on.**
1. **Disagreement-detection trigger.** Continuous monitoring for divergence, periodic comparison checkpoints, or agent-initiated escalation only?
2. **Filter for human attention.** Some agent disagreements aren't worth a human's time. What's the rule for which surface — confidence delta, domain criticality, cost of the wrong call, all weighted by something?
3. **Compression of agent reasoning.** What does each agent have to produce so the human can adjudicate in minutes, not hours — bullet rationales, citation diffs, structured "what would change my mind"?
4. **Meeting-cadence integration.** Does this fit into existing weekly review, create a new lightweight checkpoint, or replace standup? Pick one and defend the integration cost.
5. **Resolution authority.** When the agents disagree and humans must choose, is the resolution by team vote, designated senior human, randomized human, or hybrid (agents propose a third path, human ratifies)?

**Success criterion (stress tests).** A regime succeeds if it survives:
- Two agents reach opposite conclusions on a structural calc; within 30 minutes a human knows there's a disagreement, what each side relied on, and what's needed to choose.
- A junior engineer is the human in the loop; the protocol gives them what they need to actually adjudicate, not just rubber-stamp.
- The agents disagree on something low-stakes (a layout choice); the filter prevents a meeting.
- The agents agree on something they're both wrong about; the protocol has at least one mechanism that surfaces shared blind spots.
- A new agent joins the team; the protocol absorbs it without re-baselining everything.

**Deliverable.** The team protocol — detection trigger, attention filter, reasoning compression, meeting integration, resolution authority. Designed for a 5-person mixed team. Specify which existing meeting cadence it integrates with and what it costs the team in attention per week.
