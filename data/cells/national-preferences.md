---
agents_label: "Elections and citizen assemblies"
human_label: "Elections and citizen assemblies"
status: body_draft
owner: oliver
---

# Agents that represent national interests / large groups

## At a glance

### Coordination challenge

How a nation aggregates millions of individual preferences into collective decisions.

### Examples

- National elections
- Citizens' assemblies
- Referenda
- Polls

### How AGI breaks them

- Agents can persuade at scale through one-on-one conversations, seeded online movements, manufactured polls and apparent majorities. Voter preferences become highly manipulable, by domestic and foreign actors alike.
- Elections, assemblies, referenda, and polls are slow and costly, so there will be pressures toward simulated polls and deliberation. It's unclear how they can be democratically legitimate.
- If no preference-aggregation alternatives keep pace with an increasingly volatile world, the pull toward authoritarianism grows.
- If we have AI lawmakers and executive branches, they are likely to be able to move quickly and unexpectedly in ways. For this reason, we may need a much clearer and continuous mandate from the people.

## How humans solve this today

National preference aggregation is done through a stack of institutions, not a single mechanism. Voters are assumed to form views freely from an independent press and the wider information environment, and those views are then aggregated through several instruments with different tradeoffs:

- **Representative elections** confer a multi-year mandate on a party or candidate to act across the whole bundle of issues a government will face. They let elected officials act quickly when needed, at the cost of compressing the public's actual preferences into a single up-or-down vote on a ticket.
- **Referenda** pull a single high-salience question out of that bundle and settle it directly with the electorate (Brexit), trading representativeness for resolution.
- **Citizens' assemblies and deliberative polls** form high-fidelity pictures of what the public would think if it had time and information, by convening a randomly selected minipublic to deliberate with expert testimony — accurate but slow and expensive, suited to a single contested question at a time.
- **Opinion polls, public-comment periods, and constituent mail** give officials a continuous low-stakes read on shifting opinion in between.

A vivid case: Ireland on abortion. A Citizens' Assembly of 99 randomly selected citizens deliberated for months with expert testimony, recommended repeal of the Eighth Amendment, the Oireachtas accepted the recommendation and put it to a national referendum, voters passed it 66–34, and the legislature then wrote the implementing statute.

## Where AGI breaks it

1. **Agents can persuade at scale through one-on-one conversations, seeded online movements, manufactured polls and apparent majorities.** Agents can hold tailored conversations with every voter at once, run synthetic movements that appear grassroots, and generate comment, mail, and online speech indistinguishable from human input. This leaves the system vulnerable to malicious actors, both foreign and domestic, who deploy agent fleets designed to steer voter opinion. Polls and public-comment periods stop functioning as readable signals because the cost of fabricating the signal collapses, and voter preferences themselves become a moving target.
2. **Elections, assemblies, referenda, and polls are slow and costly, so there will be pressures toward simulated polls and deliberation. It's unclear how they can be democratically legitimate.** Once AI can simulate a representative citizens' assembly in hours at negligible cost, governments and advocates will be tempted to substitute synthetic deliberation for the human kind. Legitimacy rests on the assembly being composed of actual citizens forming and revising views in real conditions; a simulated assembly has no clear answer to "by what authority does this output bind us." The institutional question is not whether the simulation is accurate but what would have to be true for its results to count.
3. **If no preference-aggregation alternatives keep pace with an increasingly volatile world, the pull toward authoritarianism grows.** Multi-year electoral cycles and months-long assemblies were tolerable when policy moved at a comparable pace. As agent-era policy speeds up — automated regulation, fast-moving security and economic decisions made partly by AI systems — the slow aggregators fall behind the decisions they're supposed to legitimate. Decisions migrate to whoever can act without waiting for them: executive action, emergency powers, agency rulemaking that never goes to vote.
4. **If we have AI lawmakers and executive branches, they are likely to be able to move quickly and unexpectedly in ways. For this reason, we may need a much clearer and continuous mandate from the people.** AI lawmakers and executive systems can take actions at machine speed, across thousands of policy surfaces at once, in ways that are often illegible and unpredictable even to the officials nominally in charge. The mandate that needs to govern them therefore has to be both higher-resolution (specifying values and priorities at the granularity the systems actually act on, not the granularity of a party platform) and continuous, updateable as the public sees what the systems are doing, rather than ratified once every several years.

## Problem Sets

### Aggregation fast enough to legitimate policy

**Scenario.** A national government's policy machinery, now run largely by AI systems, is acting fast across many domains at once. The public can see the resulting posture no longer tracks any party's platform, and the complaints are mounting. Policymakers want to get a real read on what people want, but the next election is three years away, a referendum is too binary, a citizens' assembly would take a year, and polls are too gameable to bind anyone. No one knows what institution would actually fit.

**Challenge:** Design a preference-aggregation institution that can produce legitimate, binding-or-near-binding output on policy-relevant timescales (weeks, not years), and that can keep pace with AI policy systems without devolving into rolling plebiscite. A better proposal sits inside the existing constitutional order rather than replacing it, and is robust to the manipulation pressures that come with any fast cheap aggregator. Deliverable: the institution's design — what it aggregates, on what cadence, who participates, who certifies the output, what it binds, and how it sits beside elections and the courts.

**Design choices the team must take a position on.**
1. **Output type.** Does the institution produce binding decisions, revocable mandates over named AI policy systems, advisory signals the executive must respond to on the record, or something else?
2. **Cadence.** Rolling continuous output, fixed monthly or quarterly cycles, or threshold-triggered (the institution convenes when system behavior or public sentiment crosses defined lines)?
3. **Participation.** Open to all eligible voters, randomly selected rotating panels, or layered (open polling feeding a smaller deliberative body that issues the formal output)?
4. **Manipulation resistance.** Identity-verified participation, structured rate limits and provenance requirements on inputs, sampling designs that make agent-fleet capture expensive, or some combination?
5. **Constitutional fit.** Does the institution operate by statute, by constitutional amendment, or as a self-binding norm executives publicly commit to? What happens when its output conflicts with the legislature?

### Standing for AI-mediated deliberation

**Scenario.** A regional government faces a contested decision on water rights. A traditional citizens' assembly would cost millions and delay the decision by a year, so a vendor offers three faster alternatives. The first uses AI as a facilitator and summarizer of a compressed human deliberation. The second lets each citizen send a personal AI agent, interviewed at length by its principal, to participate on their behalf in a multi-agent deliberation. The third replaces the citizens entirely with calibrated language-model proxies. The minister wants to use one; opponents call all three laundering. The legislature has to decide which, if any, can carry democratic standing.

**Challenge:** Design a regime that decides when, if ever, AI-mediated deliberation — at each of these levels of mediation — can carry democratic standing, and what evidence and procedure must be in place for its outputs to count. A better proposal distinguishes accuracy (the procedure predicts what real citizens would conclude) from authorization (real citizens have empowered this output to bind them), and is specific about what each requires at each tier of mediation. Deliverable: a tiered standing rule covering AI-as-facilitator, AI-as-delegate, and AI-as-substitute, with the audit and ratification structure that accompanies each tier.

**Design choices the team must take a position on.**
1. **Tiers.** Are the three levels (facilitator, delegate, substitute) the right cut, or does the regime use a different decomposition?
2. **Authorization vs. accuracy.** At which tiers, if any, does predictive accuracy plus disclosure suffice, and where is explicit citizen authorization required?
3. **Domain scoping.** Are there decision classes (rights, constitutional questions, irreversible policy) where the higher tiers are categorically inadmissible no matter the accuracy?
4. **Auditability.** What has to be inspectable — the facilitator model, the delegate agents' interviews with their principals, the synthetic citizens' priors — and by whom?
5. **Reversion and ratification.** What triggers a fallback to fully human deliberation, who pulls the trigger, and is a separate human ratification step required before any AI-mediated output binds?

### Deep elicitation that surfaces values beneath surface preferences

**Scenario.** Polling on a contested AI-regulation bill swings double digits week to week as agent-driven campaigns reach different demographics with different framings, and no one in government takes the numbers seriously anymore. Underneath the surface, on values like safety, autonomy, economic security, and fairness across regions, the public's commitments appear more stable and more shared than the polling suggests. A research consortium proposes a national elicitation: in-depth interviews with a representative sample, designed to surface the values people actually hold and the conditions under which they would endorse one as wiser than another. Six months, tens of millions of dollars.

**Challenge:** Design an elicitation institution that produces a high-resolution picture of the public's values on a contested issue — beneath surface preferences, surfacing shared commitments and bridges across apparently opposed positions — and that stays robust to agent-scale manipulation even as it remains slow and expensive. A better proposal is clear about when the cost is worth paying, what authority the output carries, and how the elicitation itself is defended from the manipulation pressures that broke polling. Deliverable: the institution's design — sampling, interview structure, reconciliation procedure, manipulation resistance, and the authority the output carries in policy and electoral debate.

**Design choices the team must take a position on.**
1. **What's elicited.** Surface preferences, underlying values, the contexts in which one value applies over another, or all three?
2. **Reconciliation.** How are conflicting values reconciled — by aggregation, by participants judging which is wiser for a context, by a deliberative second pass, or not at all (the output is the disagreement)?
3. **Manipulation resistance.** Verified human participation, sampling immune to self-selection, public audit of transcripts, or structural insulation of the body running the elicitation?
4. **Authority.** Binding on the legislature, advisory with a required response, admissible in court, or purely informational?
5. **When to invoke.** Run for any major contested issue, only when polling has visibly broken down, or only when a legislative body formally requests one?