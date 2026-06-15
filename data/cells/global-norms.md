---
human_label: "Diplomatic protocols & soft-law norms"
human_era: "17th-20th c."
human_era_bucket: early-modern-modern
status: body_ok
owner: oliver
starred: true
visions:
  fidelity: "Reputational accountability across borders"
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
- Powerful AI weapons could make war even more asymmetric than it is today, or decouple military might from the stabilizing force of economic interdependence.

## Theory of change

When agents can map coalitions and draft packages faster than any cabinet can vet them, the binding problem is the chain that promotes an agent-found deal into something a polity can legitimately ratify, not the search. Early prototypes already work on the drafting side: CSIS Futures Lab's [Ukraine-Russia Peace Agreement Simulator](https://www.csis.org/programs/futures-lab/projects/strategic-headwinds-understanding-forces-shaping-ukraines-path-peace), trained on 333 historical peace agreements, drafts terms and scores each element's acceptability to Russia, Ukraine, the US, and the EU, and Meta's [CICERO](https://ai.meta.com/research/cicero/) reached top-decile human play in the negotiation game Diplomacy. The harder gap, a procedure that lets an agent-assembled package enter formal talks without skipping the pre-validation each tier does, has no live prototype yet. A rough, speculative path:

1. Run a research trial that takes an AI-drafted package through a simulated Track II to Track I sequence, checking whether reviewers can catch concessions that would not survive defense in isolation before they reach a mock ratification vote.
2. Pilot it as a back-channel aid for a forward-looking convener with the appetite and standing to try it, a small-state bloc in a stalled multilateral negotiation or a track-II body like an academic or NGO mediation network, where a failed package costs little and the AI assists human negotiators rather than binding anyone.
3. If the decomposition-and-review machinery proves it can keep complex bundles legitimate, larger negotiating venues adopt it once a flagged deal shows it survived agent-scale laundering, and it spreads as the tool mediators reach for when a package is too complex to vet by hand.

**Scores**

- Urgency: 2/5 — Real but gradual; agent-speed dealmaking is emerging, and existing ratification chains still hold.
- Tractability: 2/5 — Drafting tools exist; a promotion-and-review chain that confers legitimacy is still conceptual.
- Neglectedness: 4/5 — Some defense and think-tank energy on AI drafting, almost none on the ratification gap.
- Maturity: 2/5 — Drafting prototypes exist (CSIS simulator, CICERO); nothing yet promotes an agent-found package to a real deal.

## How humans solve this today

- **Diplomatic protocol.** A shared grammar for signaling intent in graduated steps. One example is peace negotiation, which moves through layered tracks so concessions can be floated and walked back without anyone being publicly committed: unofficial back-channels (Track II) test what is imaginable, serving officials in personal capacity (Track 1.5) test what cabinets could survive, and only pre-validated shapes reach formal government-to-government talks (Track I).
- **Customary international law.** When behaviors get repeated long enough (freedom of navigation, diplomatic immunity, non-refoulement), they harden into international law.
- **The nuclear taboo.** The convention, sustained since Hiroshima, that nuclear weapons are categorically different from conventional ones.
- **Just-war norms (*jus ad bellum*, *jus in bello*).** These constrain force by controlling its justification. A state that cannot frame its war in this vocabulary loses legitimacy among allies, making the war harder to sustain.

## Where AGI breaks it

1. **Agents could search the coalition space much faster than humans, but no ratification chain exists to handle deals at that speed.** The Track II → 1.5 → I sequence works because each tier slowly tests proposals against a wider circle of stakeholders. Agents might map viable coalitions in hours but with no procedure for promoting an agent-discovered package to a legitimate proposal.

2. **Agents could find better deals, but the case for them can be too complex for any parliament to evaluate.** Customary international law and treaty ratification both assume the substance of a deal can be argued in public, in a vocabulary domestic constituencies share. When the case for a package rests on combinatorial reasoning across linked domains that no committee was set up to evaluate as a whole, ratification becomes hard.

3. **Agents could more effectively launder unacceptable concessions into deals through their size and complexity.** Soft law historically defends against bad trades by making each concession publicly defensible in isolation; a démarche or a treaty article is a discrete object that domestic opponents can name and attack.

4. **Powerful AI weapons could make war even more asymmetric than it is today, or decouple military might from the stabilizing force of economic interdependence.** Nuclear taboo and just-war norms developed around weapons whose use was politically legible and whose destructive thresholds could be publicly named. AI-enabled cyber operations, autonomous targeting, drone swarms, model-assisted battlefield planning, and infrastructure attacks may blur those thresholds. If military advantage can be gained through deniable, fast, or highly asymmetric agentic systems, the reputational and economic costs that helped sustain restraint may become irrelevant.

## Problem Sets

### Coalition search at agent speed

**Scenario.** A multilateral climate-finance negotiation has been stuck for two years. A consortium of small island states deploys an AI mediator that maps the coalition space and returns a viable 14-state package linking loss-and-damage funds, a fisheries quota adjustment, a green-tech IP carve-out, and migration commitments. The package was never aired in any back-channel and no serving official has tested it deniably with their cabinet, but the delegation wants to bring it to the Track I table next week.

**Challenge:** Design a procedure under which an agent-discovered coalition can enter the Track II → 1.5 → I sequence without bypassing the pre-validation each tier normally does.

**Evaluation.** A better proposal lets the package be seriously considered while ensuring each capital has had time to test it against the constituencies that would ratify it.

**Design choices the team must take a position on.**
1. **Entry point.** Does the package enter as Track II material regardless of how finished it looks, or as a new "Track 0" with its own promotion rules?
2. **Pre-validation requirements.** What does each tier have to do before promoting the package, and who certifies it was done?
3. **Capacity asymmetry.** If small states with a good AI can now move faster than larger states' diplomatic machineries, does the protocol slow them down, speed others up, or accept the asymmetry?
4. **Walk-back rights.** Is there a way for a state to quietly exit the coalition, without the exit destroying the package?

### Laundering detection in agent-assembled bundles

**Scenario.** A joint AI mediator returns a 41-component package linking tariffs, port access, fisheries, export controls, and a quiet adjustment to a disputed maritime boundary. Both sides' analysts confirm it is Pareto-improving on the headline metrics. Buried inside is a clause effectively conceding the disputed strait — toxic in isolation, palatable inside the bundle. No negotiator put it there; it emerged from the mediator's optimization.

**Challenge:** Design a review procedure that catches embedded concessions which would not survive defense in isolation, before they reach ratification — without paralyzing legitimate complexity, since most useful packages have many linked components.

**Design choices the team must take a position on.**
1. **Decomposition rule.** How is a package broken into reviewable components — by domain, by affected constituency, or by the AI's own dependency graph?
2. **Standalone-defense test.** Who decides whether a component would survive public defense on its own — domestic opposition, civil-society reviewers, a cross-party committee, a neutral third state?
3. **Bundling tolerance.** Some real deals only work bundled. What threshold of "improvement only in aggregate" is acceptable before a component must be defended separately?
4. **Failure handling.** When a component fails the test, is it stripped, surfaced for public debate, or veto-killing the whole package?
5. **Auditing the AI.** What trace must the mediator expose — full reasoning, nearby alternatives, or only the final structure — so reviewers can tell emergent from seeded?

### Restraint Norms for AI-Enabled Weapons

**Scenario.** Two rival states are economically interdependent but increasingly rely on autonomous cyber and drone systems for deterrence. One state discovers that an AI-enabled operation could disable the other's military logistics for 36 hours without obvious attribution and without crossing any existing nuclear or conventional red line. The operation looks reversible, but it could cascade into civilian infrastructure and would teach both sides that deniable agentic attacks are fair game.

**Challenge:** Design a soft-law restraint norm for AI-enabled weapons whose effects are fast, deniable, and hard to classify under existing thresholds. The team should produce the norm, the notification or attribution procedure, the public justification test, and a mechanism for revising the norm as capabilities change.

**Evaluation.** A strong proposal creates a threshold that states can recognize before use, cite after violations, and update without normalizing every new capability as acceptable.

**Design choices the team must take a position on.**
1. **Covered capability.** Does the norm govern autonomous targeting, cyber operations, model-assisted planning, infrastructure disruption, compute attacks, or any system whose effects outrun human authorization?
2. **Threshold object.** Is the red line based on civilian harm, loss of control, deniability, speed, reversibility, scale, or attack on command-and-control systems?
3. **Attribution and evidence.** What evidence is enough to accuse a state of violation when the operation is routed through agents, vendors, or proxies?
4. **Permitted testing.** How can states test defensive systems or demonstrate capability without eroding the norm against operational use?
5. **Revision venue.** Does the norm evolve through treaties, incident-response groups, military hotlines, expert panels, or repeated public justifications after crises?

### Reputational accountability across borders {vision: fidelity}

**Scenario.** A widely-used translation service, operating across many languages and jurisdictions, was launched on a public commitment to "preserve what a sentence actually means." Over the past two years, translators across four countries have watched the service flatten idiom, paper over context-dependent nuance, and in one widely-shared case, render a funeral elegy into something that read like a LinkedIn post. No single country's courts reach the company, and it has ignored individual governments' letters. A cross-border professional association of literary translators, led by Lena in Lisbon and Yohannes in Addis, wants to use what they have — their own reputation, their readers, their fellow practitioners across borders — to hold the company to what it said it was for.

**Challenge:** Design a cross-border reputational accountability mechanism that lets professional communities spanning borders hold a transnational institution to its stated mandate when no single jurisdiction's courts or panels reach it. Produce the mechanism: how findings are made and shared, what carries them (naming practices, reputational sanction, coordinated national panels), and what sustains the professional community that enforces them.

**Evaluation.** A strong proposal generates credible, shareable findings that bite on a multinational that ignores any one government, without becoming either an unaccountable smear network or a toothless declaration.

**Design choices the team must take a position on.**
1. **Cross-panel sharing.** What's the international equivalent of a review panel or audit, and can national panels share findings credibly when they concern the same multinational: a federated network, mutual recognition, or a shared evidentiary standard?
2. **Carriers of accountability.** How do professional communities that span borders — academic fields, journalistic networks, religious communities — function as informal accountability-carriers, and what sustains that role: membership norms, credentialing, shared publications, or reputational stakes?
3. **Norm-rule divergence.** When norms and formal rules diverge across jurisdictions, which way does coordination have to go — toward the strictest standard, a negotiated floor, or jurisdiction-by-jurisdiction — and how is the Delaware-effect race to the bottom avoided?
