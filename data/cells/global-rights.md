---
human_label: "Int'l law, treaties & tribunals"
---

# Automated defense of human rights

## How humans solve this today

International human rights protection runs on a slow, paper-trail-heavy pipeline: NGOs and journalists document violations on the ground, lawyers translate the documentation into formats the relevant treaty bodies and tribunals can act on, special rapporteurs investigate, and (sometimes) state parties are called to account in venues like the UN Human Rights Council, the ICC, or regional courts. The mechanism is famously slow — often weeks to file, months to be heard, years to see a decision — and the slowness is partly a feature: the legitimacy of an international finding rests on the painstaking documentation that supports it. Lawyers at organizations like Human Rights Watch or Amnesty have spent decades building the credibility that lets their dossiers be taken seriously.

A vivid case: When Farida's NGO documented an internet shutdown four years ago, the team spent three weeks interviewing exiles, gathering open-source corroboration, and drafting a complaint that cited the relevant treaty articles. The complaint was filed; the rapporteur opened an inquiry six months later; a finding came down a year after that. Slow, but the chain of custody was unimpeachable.

## Where AGI breaks it

When monitoring, documentation, and dossier-drafting are partly delegated to AI agents, the human-rights system can move at unprecedented speed — but the conventional safeguards that gave its outputs legitimacy are not yet in place:

1. **Detection is fast; verification is the bottleneck.** Agents can detect a shutdown in hours, but the legitimacy of any subsequent action depends on verification standards that have not been adapted for AI-sourced evidence.
2. **Drafting at machine speed creates accountability questions.** If an AI drafts a dossier alleging serious violations, who is responsible if the dossier is wrong — the NGO that deployed the agent, the model provider, the lawyer who didn't catch the error?
3. **Adversaries adapt.** A government facing AI-driven monitoring can flood the channels with synthetic incidents, contest each finding, or deploy counter-monitoring AIs that contest the documentation in near real time.
4. **The human role shifts but doesn't disappear.** Lawyers stop being the people who gather facts and become the people who decide which AI-surfaced cases to put their name on. The training and accountability infrastructure for that role doesn't exist.

## Scenarios

A government has shut off an entire province's mobile network for the third time this year. In past outages, international human-rights groups took weeks to document the blackout, interview exiles, and file complaints with treaty bodies. This time, a coalition of NGOs has deployed a network of monitoring agents that detect the shutdown within hours, correlate it with arrests drawn from open sources, draft a preliminary dossier keyed to specific treaty articles, and route it to the relevant rapporteurs. Farida, a lawyer at one of the NGOs, watches the first report go out two hours after the lights went out. Her role has shifted: not to gather the facts, but to decide, with colleagues, which cases the agents should push hardest, and to stand behind what they send.

## Problem Sets

### Verification Standards for AI-Sourced Human-Rights Documentation

**Anchor contexts.** An NGO coalition's network of monitoring agents documenting internet shutdowns and arrests for filing with UN treaty bodies; an investigative-journalism consortium's agents corroborating war-crimes allegations from open-source data for ICC referrals.

**The gap.** We lack standards by which AI-sourced human-rights documentation is verified, attributed, and admitted into international rights forums — such that the speed advantage is real but the legitimacy of the human-rights system isn't degraded by unverifiable or weaponizable AI evidence.

**Design choices the team must take a position on.**
1. **Verification floor.** What does AI-sourced documentation have to include for a treaty body or tribunal to consider it — chain of custody, model attestation, named-human attestation, all three, or context-dependent?
2. **Adversarial robustness.** How is the regime hardened against governments deploying counter-monitoring AIs that contest each finding in near real time — provenance signing, adversarial-test corpus, redundant independent monitors?
3. **Attribution structure.** When an AI-drafted dossier is wrong, who is responsible — the deploying NGO, the lawyer who signed off, the model provider, all jointly?
4. **Lawyer-signoff structure.** Does every AI-surfaced case need a named human lawyer attesting? Full review, sample audit, or just sign-off on which cases to escalate?
5. **Equitable access.** Is the AI documentation infrastructure available to NGOs from the global South, or does it concentrate the rights-system in well-resourced organizations? What's the access model?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A network shutdown is detected, documented, and a dossier filed with a rapporteur within 24 hours; the rapporteur takes it seriously because the verification floor is met.
- A government deploys a counter-monitoring AI that contests every finding; the regime can distinguish substantive contestation from noise.
- An AI-drafted dossier turns out to be partially wrong; the attribution structure handles correction without destroying the deploying NGO's credibility.
- A small NGO in the global South wants to use the documentation infrastructure; the access model makes it possible without dependency on a single Northern provider.
- A rapporteur themselves is from a state hostile to the documented violation; the regime has language about routing to alternative venues.

**Deliverable.** The verification-and-admission regime — verification floor, adversarial robustness, attribution structure, lawyer-signoff, equitable access. Designed for international human-rights treaty bodies and the NGOs that file with them. Identify which provisions have no analogue in pre-AI human-rights documentation practice.
