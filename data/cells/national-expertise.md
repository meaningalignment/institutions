---
human_label: "Regulatory agencies (FDA, BaFin)"
human_era: "20th c."
human_era_bucket: twentieth
status: not_started
owner: none
visions:
  fidelity: "Mandate literacy in professional training"
---

# AI regulatory agencies & regulator-anticipation

## At a glance

### Coordination challenge

How a nation vests technical authority to gatekeep what enters markets and protect the public from bad outcomes.

### Examples

- FDA
- FAA
- EPA
- BaFin
- FERC

### How AGI breaks them

- Regulators can't audit black-box models.
- Filings are agent-generated faster than they can be reviewed.
- Regulated entities use agents to anticipate and dodge rules.
- Public-interest expertise is itself being automated.

## How humans solve this today

National regulatory agencies — the FDA, FAA, BaFin, the FTC and their international peers — translate science and policy into binding decisions over enormously consequential domains: drug approval, aircraft safety, financial stability, market conduct. The mechanism is recognizable: career experts inside the agency build deep domain knowledge, the agency publishes rules and guidance, regulated firms file for approval or report incidents, the agency reviews and responds. The slow rhythm — months for a no-action letter, years for a new rule — is partly defect (regulatory lag) and partly feature: it forces agencies to commit positions in writing that can be challenged, appealed, and litigated. Firms in the meantime act conservatively when they're unsure, often consulting senior regulators informally before making consequential moves.

A vivid case: Renee's airline used to face a four-month wait for FAA guidance on subtle issues. The wait often resolved into a phone call with the regulator-of-record, who would tell her informally whether they were thinking of writing the issue up — letting her decide whether to ground a plane preemptively or let it fly while the formal process unfolded.

## Where AGI breaks it

When regulatory agencies start operating partly through AI systems — for routine review, for triage, and especially for "regulator-anticipation" inquiries from regulated entities — the conventional dynamics shift in ways the existing administrative law was not built for:

1. **Speed inverts the authority dynamic.** A regulator-anticipation agent that answers in seconds invites firms to move fast on its informal opinion — without the slowness that used to give regulators time to think.
2. **The opinion isn't a ruling.** The agent's view is not a formal action by the agency; it carries no precedential weight, can change the next day with a model update, and yet may be relied on as if it were guidance.
3. **Expertise is decoupled from accountability.** A senior regulator who issues an informal opinion can be called to defend it; the agent has no career, no reputation among peers, no exposure to the consequences if its view is wrong.
4. **Consistency at scale, novel inconsistencies.** The agent gives broadly consistent answers to similar questions, which is a gain. But subtle inconsistencies (between two firms in similar situations, or between today's answer and last week's) can compound silently in ways human regulators caught.

## Scenarios

A mid-size airline's safety agent flags a subtle drift in one of its diagnostic pipelines — a pattern it thinks the FAA would care about, but that no current rule explicitly forbids. The human safety officer, Renee, agrees. Under the old regime she'd have written a letter, heard back in four months, and in the meantime flown the planes. In the new regime, the FAA runs an agent she can query: here's our situation, here's what we see, how would you, the regulator, view this? The answer that comes back lets her ground one aircraft for six days and keep the fleet flying the rest — long before anyone has to write a formal rule.

## Problem Sets

### Status of an AI-Issued Regulator-Anticipation Opinion

**Anchor contexts.** An FAA regulator-anticipation agent advising airlines on novel safety patterns; an FDA agent advising drug developers on whether a particular study design will satisfy approval requirements.

**The gap.** We lack a regulatory-anticipation regime that lets regulated entities act on AI-issued informal opinions at agent speed without those opinions either becoming de facto law (binding the agency) or being so non-binding that firms can't reasonably rely on them.

**Design choices the team must take a position on.**
1. **Status of the opinion.** Pure informal advisory (no protection), good-faith reliance shield (if you acted on it, you're protected from sanction even if the agency later disagrees), or precedential within bounds (similar future inquiries get the same answer until formally changed)?
2. **Consistency commitment.** Does the agency commit to the AI's answers being consistent across firms and across time, or is it understood that the AI represents one view at one moment?
3. **Update transparency.** When the AI's answer changes (model update, new training), are firms relying on prior answers notified? Past inquiries reopened?
4. **Override authority.** Can a senior human regulator override the AI's answer in real-time, and what triggers them looking — random sample, severity threshold, firm request?
5. **Logging and audit.** Who can see the inquiry-and-answer logs — the asking firm, the agency, the public, an oversight body? When (immediately, after a delay, only on subpoena)?

**Success criterion (stress tests).** A regime succeeds if it survives:
- Renee's airline acts on an AI-issued opinion and grounds an aircraft for six days; if the opinion later turns out to be wrong, the airline isn't punished for good-faith reliance.
- Two firms ask the same question and get different answers; the procedure detects the inconsistency and resolves it.
- The AI's answer drifts over a quarter as the model is retrained; firms relying on the older answer are notified or shielded.
- A firm tries to "shop" for a favorable answer by rephrasing the question across many submissions; the procedure handles repeat-asking without making legitimate clarifications hard.
- The agency wants to formally codify a position the AI has been giving; there's a path that doesn't require disavowing prior reliance.

**Deliverable.** The regulator-anticipation regime — opinion status, consistency commitment, update transparency, override authority, logging. Designed for a sector-specific regulator (FAA, FDA, BaFin). Identify which provisions have no analogue in informal-letter or no-action-letter regimes.

### Mandate literacy in professional training {vision: fidelity}

**Scenario.** A newly appointed regulator at a federal financial agency, Arjun, sits down for his orientation and realizes something odd. Every part of his formal training is about rules — which statutes, which enforcement tools, which precedents. Nothing in it asks him to engage with what the agency is actually for — whose savings it protects, what "fair dealing" was meant to cover, why the statute he is learning to enforce was passed in the first place. The senior colleagues who carry that understanding are due to retire in the next decade. Arjun begins to understand that if the training pipeline doesn't change, the agency will still enforce rules but will lose its ability to recognize when the rules and the purpose have diverged.

**Challenge:** Design a professional-training regime that builds mandate literacy — the capacity to recognize when an institution's rules have drifted from its purpose — into the pipeline that produces a national-scale institution's practitioners, and specify which programs carry it, how it is taught, and how the state's role relates to profession-set content.

**Evaluation.** A strong design makes mandate literacy something practitioners can be tested and credentialed on rather than a forgettable box-check, and gives the system a way to surface and replace training programs that have themselves drifted.

**Design choices the team must take a position on.**
1. **Which programs carry it.** Which professional training programs should carry mandate-level instruction, and how — following the partial models of law-school jurisprudence and medical-school ethics rotations, or something broader?
2. **Lip-service resistance.** How do you prevent mandate-training from being taught as lip service — a box-check that everyone forgets after graduation?
3. **State vs. profession.** What role should the state play, given templates like federally funded medical residencies whose content is nonetheless set by professional bodies?
4. **Surfacing drift.** How do you surface and replace training programs that have themselves drifted — journalism schools that train for clicks, business schools that train for shareholder-value maximization at the expense of broader mandates?
