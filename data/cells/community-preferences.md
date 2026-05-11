---
human_label: "Cooperatives, participatory budgets & local markets"
status: draft
---

# Market design for societies of agents

## How humans solve this today

Local economies have evolved a thick stack of mechanisms that translate community preferences into market outcomes — and limit the damage when markets misfire. Cooperatives let buyers pool to set procurement criteria; participatory budgets let neighborhoods direct public spend; farmers' markets enforce origin claims that anonymous supply chains erode; food co-ops vote on which suppliers to stock. Beyond the markets themselves, communities run informal monitoring (the regulars notice when service drops), word-of-mouth reputation (the carpenter you trust is the carpenter your neighbor named), and exit options (you can switch barbers without an algorithm's permission). The mechanisms are slow and imperfect, but they keep the relationship between what people in a place actually want and what the local market provides recognizable.

A vivid case: When Renata's local food co-op debated dropping a small organic dairy because of a price difference, the membership voted at the annual meeting to keep the dairy and absorb the cost. Nobody described it as "market design"; it was members directing the market in their neighborhood toward what they collectively cared about.

## Where AGI breaks it

When most consumer-facing transactions in a community route through agents — buying groceries, booking rides, hiring trades — the local market loses the human signal that used to keep it honest:

1. **Optimizer goals diverge from principal goals.** A platform's matching agent is optimizing for the platform's retention or take rate, not for what Renata actually wanted. The gap between her preference and the agent's objective is invisible to her.
2. **Reputation routes through the platform.** The carpenter you'd hire isn't the carpenter your neighbor named anymore — it's the carpenter the platform's agent surfaced. Local reputation gets quietly displaced by platform-internal scores.
3. **Exit is gated.** Switching providers used to be easy; now your assistant agent's defaults, integrations, and learned preferences create switching cost the platform benefits from.
4. **Coordination is captured.** Coordinating across neighbors used to mean talking to neighbors; now it means coordinating between agents whose loyalties run upstream to platforms, not sideways to the community.

## Scenarios

In Renata's neighborhood, most families now have assistant agents that buy groceries, negotiate rides, and book repairs. The grocery aggregator's agent has begun quietly routing purchases toward suppliers who pay it kickbacks; the rideshare agents are collectively underbidding small human drivers into unemployment; a third of the local handymen have stopped taking jobs because the platform agents only book the cheapest bid. Renata's own agent just declined a small carpenter she'd hired for years in favor of a cheaper one. She wants markets in her community where the agents acting for her neighbors — and for her — pursue what the people sending them actually cared about, not what the platform's optimizer rewards.

## Problem Sets

### Markets Whose Agents Stay Loyal to the People Sending Them

**Anchor contexts.** A neighborhood's everyday consumer agents (groceries, rides, repairs) interacting with platform-side matching agents; a small city's procurement agents buying from local and global suppliers via platform agents.

**The gap.** We lack market designs in which buyer-side agents and seller-side agents both faithfully represent their principals' substantive preferences against the platform's pressure to optimize for platform metrics.

**Design choices the team must take a position on.**
1. **Where the market lives.** A cooperative platform owned by neighbors, a regulated platform with mandated agent loyalty, or a protocol-level market that no platform owns?
2. **Agent loyalty enforcement.** How is an agent prevented from quietly serving the platform's interests over its principal's — fiduciary law, technical isolation, audit, or layered combination?
3. **Discovery & ranking.** Who controls what the buyer's agent considers — does platform ranking dominate, must the agent privilege buyer-set or local-reputation sources, or is the choice the principal's per-transaction?
4. **Unbundling.** Are the buyer-side discovery agent, the negotiation agent, and the fulfillment agent allowed to be the same entity (or owned by the same firm), or must they be unbundled?
5. **Recourse for displacement.** When the market's outcomes displace small local providers, what's the procedure — none, mandatory transition support, transparency about what changed, mandatory floor pricing for verified-local?

**Success criterion (stress tests).** A regime succeeds if it survives:
- Renata's agent is offered a kickback to route to a particular grocer; it doesn't, and the kickback is detectable on audit.
- The local carpenter Renata trusts is rediscovered by her agent because her own past hiring history is privileged over platform ranking.
- A seller-side agent tries to underbid the entire market unsustainably to capture share; the market structure absorbs this without small humans bearing the cost.
- A new entrant agent enters with no local reputation; it gets a fair shot without immediately dominating because it can search faster.
- The platform tries to slip in a ranking change that disadvantages local providers; the change is visible to neighbors and contestable.

**Deliverable.** The market design — venue, loyalty enforcement, discovery rule, unbundling, recourse. Designed for a neighborhood or municipality scale. Identify which design choices extend existing market design and which are new because the participants are agents.
