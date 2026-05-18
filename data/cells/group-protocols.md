---
agents_label: "Coordination protocols across the human-agent cadence gap"
human_label: "Team protocols & workflows"
status: not_started
owner: none
---

# Coordination protocols across the human-agent cadence gap

## At a glance

### Coordination challenge

How a small team coordinates handoffs, shared formats, and status when some members work at machine cadence and others at human cadence.

### Examples

- Daily stand-ups & sprint rituals
- Pull-request workflows (templates, two-reviewer rule)
- Shift handoff protocols (medical SBAR, aviation briefings)
- RFCs/ADRs & commit-message conventions
- Postmortems & incident reviews

### How AGI breaks them

- Cadence rituals assume bounded work hours.
- Handoff formats are calibrated to human reading time.
- Shared-format conventions flood faster than the team can read.
- Postmortems can't reach the instance that ran the incident.

## How humans solve this today

A small team doesn't coordinate by talking through every handoff; it coordinates by converging on shared formats, predictable cadences, and standard signals that compress most of the talking away. The conventions are partly about decisions and partly about distributing legibility — every member knows what was done, on what basis, and what comes next, because the protocols broadcast that information cheaply. Four layered mechanisms do most of the work in software, clinical, aviation, and architecture teams.

1. **Cadence rituals.** Stand-ups (15 minutes, three questions, one-day window), sprint planning, weekly demos, Friday retros. Each ritual is a periodic synchronization point: at a known moment, the team pauses, surfaces what's been done and what's blocked, and resyncs. Engineering teams converge on agile or shape-up cadences; medical teams have rounds; aviation crews have briefings before each flight phase.

2. **Handoff protocols.** Standards for transferring work between people. SBAR in nursing (Situation, Background, Assessment, Recommendation) at shift change. Aviation handoff briefings on long-haul flights. PR descriptions in software (what changed, why, how reviewed, how tested). Design handoff documents from architects to engineers. Each is a fixed-format compression of context, calibrated to the receiver's reading time and prior knowledge.

3. **Shared format conventions.** RFCs and ADRs (architecture decision records), commit-message styles, ticket templates, OKR formats, status-update structures. Standards the team converges on so each work product is legible without explanation. A well-written commit message, a properly-templated PR, a one-page ADR — these reduce coordination cost to near zero because the format is the protocol.

4. **Postmortem and incident review.** Blameless postmortems (Google's SRE practice), morbidity-and-mortality conferences in medicine, NTSB accident reports in aviation, project retrospectives in software. The team pauses after a significant event, reconstructs what happened, identifies what could be different, and writes it down. The protocols presuppose that the participants remember the event and have access to whatever state the system was in.

The four layers reinforce each other. Cadence rituals create the moments at which handoffs and shared formats get reviewed; shared formats make handoffs cheap; postmortems update both the cadence and the formats. None of these depends on heavy machinery — they work because the team converges on conventions everyone can follow.

A vivid case: Petra's 6-person fintech startup has converged on agile stand-ups at 10am, a PR template requiring two human reviewers and passing CI, ADRs for any decision that touches more than one service, and a blameless postmortem within 48 hours of any production incident. Three engineers, one designer, one PM, one ops lead. Every member can summarize what every other member did this week without checking, because the protocols broadcast it.

## Where AGI breaks it

What team protocols actually do is keep a group acting as a coordinated unit: they sustain shared situational awareness, transfer decisions with their context, preserve a navigable canon of accumulated practice, and convert incidents into institutional learning. When these functions fail, the team doesn't just get clunkier; it stops being a team. People (and agents) keep producing work, but the work stops adding up to a coordinated whole.

Five differences between agent contributors and human ones load-bear. The first three are agent properties; the last two are properties of how agent work meets the team's existing infrastructure.

- **Tireless and continuous within scope.** Agents don't have a workday or bounded attention; rituals built around what-I-did-yesterday don't compress what an agent did in the last 24 hours into a recap.
- **Re-instanceable.** Handoff and postmortem protocols assume the party on the other end persists; an agent on the running side during an incident may not exist by the time the team investigates, and an agent on the receiving side may be a fresh instance.
- **Throughput far exceeds human reader bandwidth.** Formats calibrated to compress work for human consumption can no longer compress agent output; agents produce review-worthy work faster than the team can review.
- **Behavior shaped by developer instrumentation.** What the agent does, how it logs, what state it preserves depends on the developer's deployment choices, not on the team's tacit conventions; the protocol the team built doesn't transmit to the agent the way it transmits to a new hire.
- **No felt cost of attention.** Humans batch communication into rituals because attention is scarce; agents have no equivalent scarcity, so inline coordination signals (Slack channels, OOO statuses, lightweight pings) don't filter agent traffic.

The four mechanisms fail in specific load-bearing ways:

1. **Cadence rituals — shared situational awareness collapses.** A stand-up's load-bearing function is that, after fifteen minutes, every team member has roughly the same picture of where the team's work is. With agents working continuously between rituals, the team operates on a picture that's stale before the meeting ends and that nobody can refresh by asking the agent (its activity doesn't compress, and the summary it offers can't be cheaply verified). Two agents make incompatible changes between Monday's and Tuesday's stand-up; nobody catches it until something breaks. The ritual continues; the synchronization function is gone, and decisions get made on shared pictures that aren't shared. *Tireless* and *throughput* drive the failure.

2. **Handoff protocols — decisions transfer without their context.** A handoff's load-bearing function is that the receiver gets enough to continue without re-deriving — and that the audit trail later shows what was decided and on what basis. When an agent authors a handoff at machine throughput, the receiver (human or agent) either drowns in unfiltered context or trusts a summary nobody verified; the human-readable PR description signs off on substance no human actually reviewed. When something breaks downstream, the audit trail shows "approved" without showing what was approved. The handoff goes through; what it was supposed to transfer didn't. *Re-instanceability* and *throughput* drive the failure.

3. **Shared format conventions — the team's accumulated canon stops being navigable.** RFCs, ADRs, runbooks, and commit conventions worked because the body of decisions stayed small enough that any team member could read in and orient themselves — and any new member could absorb it on the way in. With agent throughput, the canon grows faster than anyone reads it; new decisions cite old decisions nobody verified; new humans and new agents arrive into a body the existing team only partially holds either. The format persists; legibility becomes a fiction maintained by ceremony, and the team's grip on its own accumulated practice loosens. *Throughput* and *developer instrumentation* drive the failure.

4. **Postmortems — the team loses the capacity to learn from its own failures.** A blameless postmortem's load-bearing function is that incidents convert into institutional learning — the team gets better over time at the failure modes it's bad at. When an agent was running during the incident, the instance is often gone, its operating context (prompt, tools, scratchpad, model version) wasn't retained, and the developer who deployed it is outside the team's authority to compel cooperation. The team holds the postmortem and produces a finding about what it can see; the layer where the actual failure originated stays opaque. Incidents recur with the same root causes, and patterns across deployments stay invisible because no individual team can see across them. *Re-instanceability* and *developer instrumentation* drive the failure.

## Scenarios

Sketches of how each mechanism could be rebuilt for mixed teams. Each is a starting point, not a worked design.

1. **Cadence rituals rebuilt as continuous status broadcasts with human-cadence digests.** Agents publish state at defined intervals (every meaningful action, every commit, every escalation), with a daily digest summarizing the last 24 hours of agent work in human-readable form. The stand-up no longer asks each agent "what did you do yesterday"; it reviews the digest, surfaces anomalies, and the team adjudicates only items the digest flagged. The digest is generated by an independent process, not by the agent that did the work — so the summary is auditable against the raw activity log.

2. **Handoff protocols rebuilt as receiver-shaped formats.** Handoffs split into two paths: human-receiving (tight summary, structured for quick read, optimized for the receiver's prior context) and agent-receiving (full context, machine-readable, including everything the sending party considered). A handoff includes a declared receiver type so the format matches. The PR template, the on-call runbook, the design handoff all get a paired machine-format counterpart, and the team's conventions specify which gets generated when.

3. **Shared format conventions rebuilt with throughput limits and provenance.** RFCs, ADRs, and commit messages gain a provenance field (human-authored, agent-authored, agent-drafted-human-approved) and a throttle on agent-generated submissions per cadence cycle. The team's review capacity becomes the explicit budget the format respects; agents that exceed it queue or escalate. Conventions stop being purely structural and acquire a flow-rate dimension.

4. **Postmortems rebuilt with developer participation and preserved state.** When an agent is on the team, deployment requires retention of operating state (prompt, tools, recent context, model version, deployment parameters) for a defined window past any incident. The postmortem protocol extends beyond the deployment instance to the development pipeline: the agent's developer (or its represented organization) participates in the review and surfaces what the agent had access to. The team's incident review now spans two organizations, with defined responsibilities at each layer.

## Problem Sets

### Continuous-Cadence Status Broadcasts That Replace Stand-Up

**Anchor contexts.** A 6-person software team with two coding agents that work continuously and three engineers who maintain a 10am stand-up; a small clinical team with AI triage and documentation agents operating across all shifts.

**The gap.** Cadence rituals like stand-ups worked because every team member's activity compressed into a recap-able window. Agents working continuously don't fit the format; teams that include them face a forced choice between losing visibility, padding the ritual with unverifiable text, or excluding agents from the coordination function entirely. We lack a status-broadcast protocol that surfaces agent activity in human-adjudicable form, that the team can verify against raw activity, and that integrates with the existing cadence without absorbing the meeting.

**Design choices the team must take a position on.**
1. **Broadcast trigger.** Per-action (every commit, every escalation), time-windowed (every hour, every 4 hours), event-typed (only meaningful work), or hybrid? What counts as meaningful?
2. **Digest production.** The agent itself writes its summary, an independent summarization process reads the activity log, the agent's developer publishes a standard summary format, or the team's own infrastructure synthesizes? Who can the team trust to summarize the work the agent did?
3. **Verification against raw log.** Does the team get a sampleable raw activity log to audit the digest, only the digest with no audit, or layered (digest by default, raw on demand)? What's the storage cost and who pays it?
4. **Integration with stand-up.** The stand-up reviews only the digest, omits agent work, runs in parallel (humans recap their own work, digest is async), or replaces the stand-up entirely? Pick a cadence-integration and defend the team-attention cost.
5. **Flag-and-escalate filter.** When the digest contains an anomaly (an unusual decision, an escalation, a deviation from policy), how does it surface — automatic flag at digest generation, agent-initiated flag, human review only, mandatory hold-for-review?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The team can answer "what did the agents do this week" in stand-up in five minutes without each person reading 200 pages of activity logs.
- The agent's digest claims a clean week; a spot-audit of the raw log finds an unflagged incident. The protocol catches the gap.
- The team adds a third agent; the digest format absorbs it without rebaselining.
- An agent escalates a decision that needed human input; the broadcast surfaces it in real time, not at the next morning's stand-up.
- The agent is updated to a new model version; the digest convention survives the update.

**Deliverable.** The status-broadcast specification — trigger, digest production, verification, stand-up integration, flag-and-escalate filter. Designed for a 6-person team with 2–3 agents. Specify the attention cost in minutes per week and the storage cost in GB per month.

### Receiver-Shaped Handoff Formats

**Anchor contexts.** A software team's PR template currently shared across human-to-human, human-to-agent, agent-to-human, and agent-to-agent reviews; an on-call runbook handoff at shift change when one shift is staffed by a human and the next by an agent (or vice versa).

**The gap.** Handoff protocols like SBAR, PR descriptions, and design handoffs converged on a specific receiver — a person with bounded reading time, prior context, and the ability to ask. When the receiver is an agent (which could ingest more) or the sender is an agent (which could write more), the format under-serves both ends. We lack a handoff protocol that adjusts format to declared receiver type, that prevents agent-authored output from drowning human review queues, and that doesn't force the team to maintain four parallel templates by hand.

**Design choices the team must take a position on.**
1. **Receiver declaration.** Is the receiver type declared at handoff time (sender specifies "for human review" or "for agent ingestion"), inferred from the next assignee, or implicit in the channel (this PR queue is for human review, that one for agent triage)? How does the receiver type interact with team workflow tools?
2. **Format coupling.** Are human and agent formats generated from a single source (one canonical write, two renderings), maintained as separate templates with verification that they match, or fully independent (with the trade-off accepted)?
3. **Throughput limits per channel.** Does the human-review channel have a per-cycle budget that agent-authored handoffs respect? Quotas, queueing rules, priority signals?
4. **Re-routing on receiver change.** When a handoff originally addressed to a human gets re-routed to an agent (or vice versa), does the format adapt automatically, require a re-write, or trigger a hold for re-handoff?
5. **Context-completeness check.** When a handoff is agent-receiving, does the format require all upstream context (full design history, full incident trace) or trust the agent to retrieve it? What's the verification that retrieval happened?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A human reviewer's queue stays at human-readable volume even as agent-authored PRs multiply; the throughput limit holds.
- An agent receives a handoff originally drafted for a human; it gets the additional context it needs without the sender having to rewrite.
- A handoff is mis-typed (declared agent-receiving, actually goes to a human); the format adaptation catches the mismatch.
- The team adopts a new agent vendor; the receiver-type declaration ports without rewriting templates.
- An agent's "I read it" attestation turns out to be false (it didn't process the full upstream context); the verification catches it.

**Deliverable.** The handoff-protocol specification — receiver declaration, format coupling, throughput limits, re-routing, context-completeness. Plus worked examples: a PR template adapted for each of the four sender×receiver pairs (human→human, human→agent, agent→human, agent→agent), with the rendering rules.

### Postmortem Authority When the Instance That Ran Is Gone

**Anchor contexts.** A small software team running an AI on-call agent that responds to pages and executes runbooks; a small clinical team with an AI triage agent that operated during a misdiagnosis incident.

**The gap.** Postmortems work because the participants remember the incident and have access to whatever state the system was in. When an agent was running during the incident, the instance may be gone, the operating context (prompt, tools, scratchpad, model version) may not be retained, and the developer who deployed it may not surface that state on request. We lack a postmortem protocol for mixed teams that preserves the operating state long enough to investigate, that pulls the developer into the review when their agent was involved, and that produces a finding the team can act on without re-litigating who-owns-what across organizational boundaries.

**Design choices the team must take a position on.**
1. **State retention requirement.** What does deploying an agent on the team commit the developer to preserve — full activity log, operating context (prompt, tools, scratchpad), model snapshot, deployment parameters? For how long past any incident, and who pays the storage cost?
2. **Postmortem standing.** When an agent was involved in an incident, who participates — the deploying team only, the agent's developer organization too, an external auditor when consequences cross a threshold? What's the developer's obligation to participate, and how is it enforced?
3. **Counterfactual reconstruction.** How does the postmortem reconstruct "what would have happened if a human had been on-call instead" or "what if the agent had been on a different model version"? Required structured comparison, narrative reasoning, both, neither?
4. **Finding ownership.** When the postmortem identifies a contributing factor that lives in the deployment (the agent's prompt was wrong, the tool access was over-broad), is the remediation owned by the deploying team, the developer organization, or jointly? What's the procedure when the parties disagree on the diagnosis?
5. **Cross-incident pattern.** When several incidents across deploying teams point to the same developer-side issue, what triggers a cross-deployment investigation — sampling threshold, regulator initiation, voluntary developer disclosure?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A production incident occurred while an agent was on-call; the team can reconstruct the agent's operating context two weeks later in a review that produces actionable findings.
- The agent's deployment instance has ended; the retained state is enough to answer the postmortem's load-bearing questions without re-running the incident.
- The developer organization is asked to participate; the participation obligation has teeth and the meeting happens within a defined window.
- Several incidents across deploying teams point to the same agent's tool-access being over-broad; the cross-incident pattern surfaces and triggers a remediation the developer has to address.
- The agent has been updated since the incident; the postmortem can investigate the version that ran without confusing it with the current version.

**Deliverable.** The postmortem-protocol specification — state retention, standing, counterfactual reconstruction, finding ownership, cross-incident pattern. Designed for a small team deploying an agent from a separate vendor. Identify which provisions have no analogue in pre-AI blameless postmortems (Google SRE, NTSB, M&M conferences) and why.
