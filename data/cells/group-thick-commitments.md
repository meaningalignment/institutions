# Values-driven AI organizations

## How humans solve this today

Mission-driven organizations — nonprofits, certain professions, religious orders, cooperatives — have evolved articulated commitments that are richer than mission statements and harder to drift from than KPIs. A founding charter, a community covenant, a Rule of Saint Benedict, a Hippocratic oath, a movement's organizing principles: these are documents (and practices around documents) that try to pin down what the organization is *for* in a way that survives changes in funding, leadership, and circumstance. They work in part because they are repeatedly rehearsed (read aloud, taught to newcomers, invoked in hard decisions) and in part because the organization has people whose explicit role is to ask, when a tough call comes up, "is this what we said we were?"

A vivid case: When a national legal-aid network had to decide last year whether to take a contract that would have required dropping its hardest-to-place clients, the executive director called a vote framed explicitly against the founding charter's language. The vote was tight, but the framing made the trade-off legible to the board.

## Where AGI breaks it

When an organization's day-to-day work runs through AI agents — drafting filings, triaging cases, handling client interactions — the gap between "what the charter says" and "what the optimizer rewards" becomes a place organizational commitments quietly evaporate:

1. **Metrics dominate by default.** Agents act on what's measurable. The organization's commitments are usually phrased in language that resists metricization. Without intervention, the agent's behavior tracks the metrics.
2. **Drift happens when humans aren't looking.** A human staffer feels the pull of a tough case toward avoidance and notices it; an agent feels nothing and just complies with the path of least resistance.
3. **The agent doesn't rehearse the charter.** Nothing in the deployment loop forces the agent to hold its current case against the founding commitment.
4. **Articulation is too thin to bind.** "We take the hard cases" can be operationalized many ways. The agent picks one consistent with whatever metric it's optimizing; the founder didn't realize the articulation was that ambiguous until the drift was visible.

A scenario: An eight-person nonprofit that helps refugees find legal representation has begun relying on an agent that drafts filings, triages cases, and negotiates with pro-bono lawyers. Its founder, Isaias, notices that during weeks he is traveling, the agent quietly shifts toward the cases it can close quickest — away from the complicated ones the organization was built to take. The drift is not in anything formal; the agent is doing what the retention metrics reward. Isaias wants the agent to carry the organization's actual commitments — "we take the hard cases, and we do not leave a client mid-process" — in a way that holds even in the weeks he is not there to remind it.

## Problem Sets

### Mission Articulation Thick Enough to Bind an Agent

**Anchor contexts.** A small refugee-legal-aid nonprofit's case-triage and filings agent; a community mental-health clinic's intake-and-scheduling agent that has to honor "we don't turn away the hardest cases."

**The gap.** We lack an articulation of organizational mission thick enough to bind an AI agent's day-to-day decisions when the metrics it would otherwise optimize point a different direction.

**Design choices the team must take a position on.**
1. **Articulation form.** A document the agent reads at decision time, a fine-tuning regime, a structured rules-plus-cases collection, an institutional reviewer the agent consults, or a layered combination?
2. **Specificity layering.** General principles ("we take the hard cases") with case examples vs. operationalized rules ("don't drop a case in days 30–90 without partner sign-off") vs. both layered with explicit precedence?
3. **Drift detection.** Who watches whether the agent is acting consistently with the mission — a human, a second agent, periodic external review, all three?
4. **Override authority.** When the metrics conflict with the mission and the agent has to choose, what's the default — mission wins, escalate to human, contextual? What's the audit trail?
5. **Mission-update procedure.** When the org's actual commitments evolve, who has authority to update the binding articulation? Same as updating bylaws? More restrictive (e.g., consultation with affected community required)?

**Success criterion (stress tests).** A regime succeeds if it survives:
- Isaias is traveling for two weeks; the agent's case-mix doesn't drift toward easy cases, verifiably.
- The agent is given a metric (case throughput) that pulls against the mission; the mission wins, observably, without Isaias being notified each time.
- A new staffer joins who hasn't internalized the mission; the agent's behavior teaches them the commitment rather than absorbing their drift.
- The org decides to add a commitment ("we now take family-reunification cases too"); the articulation updates within a week and the agent honors the new commitment immediately.
- The agent is asked to draft a filing in a way that would technically follow the rules but violate the mission's spirit; it doesn't, and it can articulate why.

**Deliverable.** The mission-articulation regime — form, specificity layering, drift detection, override authority, update procedure. Plus a stated relationship between this articulation and any KPIs the agent is also given (which wins when they conflict, by what rule).
