---
human_label: "Diplomatic protocols & soft-law norms"
status: body_ok
owner: oliver
starred: true
---

# Geopolitical supernegotiation

## At a glance

### Coordination challenge

How states settle on expectations of conduct toward each other without a global enforcer.

### Examples

- Diplomatic protocol
- Customary international law
- Nuclear taboo
- Just-war norms

### How AGI breaks them

- Agents could search the coalition space much faster than humans, but no ratification chain exists to handle deals at that speed.
- Agents could find better deals, but the case for them can be too complex for any parliament to evaluate.
- Agents could more effectively launder unacceptable concessions into deals through their size and complexity.

## How humans solve this today

There is no global enforcer, so states behave themselves by accumulating a track record: every public action becomes a precedent that other states cite back at them later, and breaking expectations costs credibility on every other negotiation a state is in. Some examples of how norms get enforced this way:

- **Diplomatic protocol.** A shared grammar for signaling intent in graduated steps, so escalation walks down a staircase whose every rung has a recognized meaning. One example is peace negotiation, which moves through layered tracks so concessions can be floated and walked back without anyone being publicly committed: unofficial back-channels (Track II) test what is imaginable, serving officials in personal capacity (Track 1.5) test what cabinets could survive, and only pre-validated shapes reach formal government-to-government talks (Track I).
- **Customary international law.** When behaviors get repeated long enough (freedom of navigation, diplomatic immunity, non-refoulement), they harden into international law.
- **The nuclear taboo.** The convention, sustained since Hiroshima, that nuclear weapons are categorically different from conventional ones — a threshold no leader can cross without becoming a pariah.
- **Just-war norms (*jus ad bellum*, *jus in bello*).** These constrain force by controlling its justification. A state that cannot frame its war in this vocabulary loses legitimacy at home and abroad, which makes the war harder to sustain.

A vivid case: in 1990, Iraq's invasion of Kuwait violated the postwar norm against territorial conquest. The U.S. and U.K. went to the UN Security Council, securing Resolution 678 as explicit *jus ad bellum* authorization. The coalition then stopped once Kuwait was liberated rather than pushing on to Baghdad, honoring the *ad bellum* limit.

## Where AGI breaks it

1. **Agents could search the coalition space much faster than humans, but no ratification chain exists to handle deals at that speed.** The Track II → 1.5 → I sequence works because each tier slowly tests proposals against a wider circle of stakeholders. The slowness is the filter: by the time something reaches the formal table, both sides' publics have had time to absorb what is being agreed to. Agents that map viable coalitions in hours present finished-looking deals to a ratification chain whose every checkpoint assumed months of pre-validation, and there is no procedure for promoting an agent-discovered package to a legitimate proposal without skipping those checkpoints.

2. **Agents could find better deals, but the case for them can be too complex for any parliament to evaluate.** Customary international law and treaty ratification both assume the substance of a deal can be argued in public, in a vocabulary domestic constituencies share. When the case for a package rests on combinatorial reasoning across linked domains that no committee was set up to evaluate as a whole, ratification becomes hard.

3. **Agents could more effectively launder unacceptable concessions into deals through their size and complexity.** Soft law historically defends against bad trades by making each concession publicly defensible in isolation; a démarche or a treaty article is a discrete object that domestic opponents can name and attack. An agent-assembled package whose components only make sense as a bundle can carry a politically toxic concession that nobody on either side would defend in pieces but everyone benefits from in aggregate, and the inspection norms have no purchase on objects that size.

## Problem Sets

### Coalition search at agent speed

**Scenario.** A multilateral climate-finance negotiation has been stuck for two years. A consortium of small island states deploys an AI mediator that maps the coalition space and returns a viable 14-state package linking loss-and-damage funds, a fisheries quota adjustment, a green-tech IP carve-out, and migration commitments. The package was never aired in any back-channel and no serving official has tested it deniably with their cabinet, but the delegation wants to bring it to the Track I table next week.

**Challenge:** Design a procedure under which an agent-discovered coalition can enter the Track II → 1.5 → I sequence without bypassing the pre-validation each tier normally does. A better proposal lets the package be seriously considered while ensuring each capital has had time to test it against the constituencies that would ratify it.

**Design choices the team must take a position on.**
1. **Entry point.** Does the package enter as Track II material regardless of how finished it looks, or as a new "Track 0" with its own promotion rules?
2. **Pre-validation requirements.** What does each tier have to do before promoting the package, and who certifies it was done?
3. **Capacity asymmetry.** Small states with a good AI can now move faster than larger states' diplomatic machineries. Does the protocol slow them down, speed others up, or accept the asymmetry?
4. **Walk-back rights.** At which tiers can a state quietly exit the coalition without the exit itself destroying the package?

### Laundering detection in agent-assembled bundles

**Scenario.** A joint AI mediator returns a 41-component package linking tariffs, port access, fisheries, export controls, and a quiet adjustment to a disputed maritime boundary. Both sides' analysts confirm it is Pareto-improving on the headline metrics. Buried inside is a clause effectively conceding the disputed strait — toxic in isolation, palatable inside the bundle. No negotiator put it there; it emerged from the mediator's optimization.

**Challenge:** Design a review procedure that catches embedded concessions which would not survive defense in isolation, before they reach ratification — without paralyzing legitimate complexity, since most useful packages have many linked components.

**Design choices the team must take a position on.**
1. **Decomposition rule.** How is a package broken into reviewable components — by domain, by affected constituency, or by the AI's own dependency graph?
2. **Standalone-defense test.** Who decides whether a component would survive public defense on its own — domestic opposition, civil-society reviewers, a cross-party committee, a neutral third state?
3. **Bundling tolerance.** Some real deals only work bundled. What threshold of "improvement only in aggregate" is acceptable before a component must be defended separately?
4. **Failure handling.** When a component fails the test, is it stripped, surfaced for public debate, or veto-killing the whole package?
5. **Auditing the AI.** What trace must the mediator expose — full reasoning, nearby alternatives, or only the final structure — so reviewers can tell emergent from seeded?
