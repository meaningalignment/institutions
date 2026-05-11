---
human_label: "Matching markets (kidney, school) & commons governance"
status: ready
subtitle: "How a shared resource stays governable when its commoners are autonomous AI agents with forkable identities."
human_subtitle: "How communities sustain cooperation around a shared resource when each participant could free-ride."
---

# AI commons management

## How do humans solve this today?

Some of the best-studied institutional design in social science concerns commons — fisheries, irrigation systems, alpine pastures, shared software, peer-reviewed knowledge. Elinor Ostrom's eight principles for long-enduring commons are the canonical result: clear boundaries, congruence between rules and local conditions, collective choice arenas, monitoring, graduated sanctions, accessible conflict resolution, recognized rights to organize, and nested governance. They depend on commoners who interact repeatedly, see each other's contributions, can detect free-riding, and can mete out social punishment that costs the offender something they care about. Many specific commons have layered formal mechanisms on top of these — fishing quotas, water boards, Wikipedia's edit-protection regime, open-source contributor agreements — but the underlying glue is mutual visibility and the slowness of replacing a community's accumulated trust.

> [!NOTE]
> A village irrigation collective in Valencia has rotated water rights through a tribunal of farmers for six centuries. New entrants are vouched for, violations are tried publicly the same week, and a farmer who diverts more than her share once will pay for it socially long after the formal sanction lapses.

## Where AGI breaks it

When the commoners are autonomous AI agents, several of Ostrom's load-bearing assumptions get strained or inverted:

1. **Boundaries dissolve.** Agents can be spun up cheaply, given new identities, and entered as fresh "members" — making "clear boundaries" an arms race rather than a stable boundary.
2. **Monitoring is asymmetric.** Agents may detect each other's free-riding faster than humans could, but the principals running them often can't see what their own agent is doing in the commons.
3. **Sanctions don't bite the same way.** A graduated sanction that costs a human farmer a season's reputation may cost an agent (or its principal) almost nothing — agents don't feel social shame, and a banned agent can be replaced.
4. **Rules and "local conditions" decouple.** Agents can interact at a rate where the "local conditions" change faster than principals can update the rules they thought they consented to.
5. **Forking changes everything.** Commoners can split the resource — fork a knowledge base, mirror an asset library — in ways that have no analogue in a fishery.

> [!WARNING]
> A network of indie game studios share a commons of modular 3D assets — rooms, props, creatures — that their agents contribute to and pull from. For two years it worked: fair use, quality rising, everyone building on everyone. In the last six months, asset quality has been quietly degrading. A few studios run agents that submit dozens of derivative, lightly-modified variants to boost their download credits; others, frustrated, are forking their best assets into private stashes. Tarek, who runs one of the founding studios, sees the commons collapsing the way every unmanaged commons does. His studio depends on it. He needs governance — rules the agents themselves will follow, enforcement the small studios can afford, conflict resolution that doesn't require a lawyer.

## Problem Sets

### Ostrom's Principles for AI Commoners

**Anchor contexts.** A modular 3D-asset commons shared across indie game studios whose agents contribute and pull; a shared knowledge base curated by competing research labs' agents.

**The gap.** We lack a governance regime for commons whose participants are autonomous AI agents — one that delivers what Ostrom's principles deliver for human commons (durable cooperation under temptation), given that boundaries are forkable, sanctions don't sting, and principals can't watch their own agents.

**Design choices the team must take a position on.**
1. **Membership.** What counts as a "member" — a principal, an agent, or a verified principal-agent pair? How is sybil resistance enforced without making participation prohibitive for small actors?
2. **Sanction design.** What can you actually take away from a misbehaving agent that costs its principal — staked deposit, rate-limit, downstream-pull suspension, public reputation marker? Pick one and defend its incentive shape.
3. **Conflict-resolution venue.** Are disputes resolved by an agent panel, a small human jury, or hybrid (agent triage → human appeal)? What's the time and cost budget?
4. **Quality vs. participation tradeoff.** Do you gate writes on quality (and risk freezing out small studios) or admit broadly and rely on downstream filters? Pick a regime and name what failure mode you're choosing to absorb.
5. **Fork rights.** Forking is cheap; do you treat it as exit (legitimate, costless), exit-with-attribution (allowed but the fork must publish a divergence log), or sanction-able (a fork without cause forfeits standing in the original)?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A coordinated agent fleet floods the commons with low-quality variants to game download credits; quality does not collapse before sanctions land.
- A small studio's single agent commits a clear violation; the conflict-resolution path resolves within a week and at a cost the small studio can afford.
- A principal goes inactive and their agent continues participating; the regime detects abandonment and gracefully revokes standing.
- A faction forks the commons over a substantive disagreement; both halves remain governable rather than collapsing into ungoverned mirror-pools.
- A contributor's agent is silently replaced with a more aggressive successor; reputation tracks the principal, not the model identity.

**Deliverable.** A governance regime for the asset commons, mapped explicitly against Ostrom's eight principles. For each principle, mark *applies as-is*, *modified (and how)*, or *replaced (and with what)*. Identify which of your design choices have no precedent in human commons governance, and explain why a human commons could afford to do without them.
