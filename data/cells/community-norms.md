---
agents_label: "Professional norms for agents"
human_label: "Professional codes of conduct"
status: summary_draft
owner: joe
starred: true
---

# Professional norms for agents

## At a glance

### Coordination challenge

How a profession sets expectations its members hold each other to without invoking formal law.

### Examples

- Medical ethics codes
- Bar association rules
- Engineering canons
- Journalistic ethics
- Accounting standards

### How AGI breaks them

- The usual way humans enforce norms (social sanctions, going cold, pushback) does not hurt an agent the same way. In particular, reputation among peers or in a social millieu may not apply to agents.
- Agent-paced consensus can outrun the deliberative bodies that articulate and contest professional norms, and principals may discover what their agents agreed to after norms have already shaped many decisions.
- Agents will likely be more diverse in their capabilities and incentives than humans, making it harder to find norms that work for all parties. (Difficulty finding norms that work across normal people and sociopaths is a good example of this problem in the human world.)
- The profession's mechanisms for forming and evolving norms may not be able to handle the speed and scale required to keep up with agent practice.
- The normative reasoning required to anticipate how a peer or regulator would react to an action may not be present in an agent without explicit modeling and incentives to do so, and the reasoning may be less reliable when the peer or regulator is itself an agent.
- If agents don't find norms at least as well as humans do, we are likely to see many tragedy-of-the-commons scenarios across shared resources, including in misdirecting human institutions and attention.

## How humans solve this today

In finance, the norms that keep books from blowing up, prime brokers from getting margin-called, and the system from cascading live in five layered places at once. No one of them is enough; the load-bearing intuition is the composition.

1. **Tacit absorption inside small teams.** A new trader absorbs a desk's *what we, here, do* the slow way: watching what gets cleared without comment, what gets vetoed at the morning meeting, what gets called up the chain. The desk's actual rules usually aren't written down — *we don't get bigger than the market in any one name; we don't add to a losing position without a written reason; we don't ride a working trade into Fed Wednesday; we don't fund a 30-year position with overnight repo; we don't sell anything to a customer we wouldn't be comfortable explaining to them in detail*. After a year you can feel when a colleague is pitching something the desk wouldn't do, even if you can't articulate why.

2. **Professional codes of conduct.** Where the profession has organized, the deliberate articulation is done by FINRA, the CFA Institute, the SEC's general anti-fraud principles (Rule 10b-5), the Volcker Rule's spirit on proprietary trading, the suitability rules for retail products, bank-internal codes built around Sarbanes-Oxley. The codes deliberate (sometimes for years) about edge cases, run continuing-ed, and discipline people who clearly cross lines — Salomon traders who cornered the T-bill auction, Bear Stearns analysts who hyped what their bank was shorting, Wells Fargo bankers who opened accounts customers hadn't asked for.

3. **Regulator-anticipation.** A senior compliance officer doesn't read the regs before flagging a deal; she's internalized what the OCC, the Fed, the SEC, FINRA would write up. The "would I want to see this on the front page of the *Journal*" test does work the rulebook can't. Junior compliance acquires it by sitting next to senior compliance and watching what gets escalated. Whole gray-zone strategies get pulled because *you don't want to be on a list*.

4. **Contractualist reasoning.** When a case isn't covered by code, professionals reason about what would be defensible to everyone affected — the customer, the counterparty's risk officer, the firm's prime broker, the board, the regulators. Goldman's post-Abacus internal norm — *don't sell a client a deal you wouldn't be comfortable explaining to them in detail* — is the institutional residue of this kind of reasoning being weak before 2008. The fiduciary intuition: would this hold up if the affected party knew everything I know?

5. **Case-based learning from canonical examples.** Traders, risk officers, and compliance teams internalize the canon: LTCM (1998) for correlated leverage and liquidity death; Lehman (2008) for off-balance-sheet leverage and what counterparty trust collapsing looks like; Knight Capital (2012) for what a half-hour of bad code does to a firm; London Whale (2012) for what a single desk gaming its own risk model produces; Madoff for what skipped due diligence looks like; Archegos (2021) for swap-financed concentration that broke its prime brokers. Reading these enough builds a feel for *this configuration has the shape of a famous disaster*.

A vivid case: When Sarah moved from a money-center bank's mortgage desk to her current hedge fund, she spent the first months watching her senior PM react to ideas — what got cleared without comment, what got vetoed for sizing, what got pushed back on because *we don't get bigger than the market in that name*. By month three she could feel when a junior was pitching a trade that wouldn't survive the morning meeting. Evaluating a new structured product, the same Sarah drew on what she'd learned from the LTCM case study at Wharton and on what she knew the firm's prime broker would flag if they saw the exposure. Five different norm intuitions, layered.

## Where AGI breaks it

Each of the five mechanisms relies on specific properties of the practitioner that don't hold for an agent by default. The institutional alternative has to do different work.

1. **Tacit absorption.** The human mechanism relies on the practitioner being on the desk continuously, observing what gets corrected and what gets vetoed, and stable enough that what's been absorbed persists. An agent has none of these properties by default — it can be re-instanced, isn't shaped by social embedding, and what it carries forward is whatever its developer makes it carry. By default an agent placed on a desk acts on its training and the desk's explicit rules; the unwritten *what we don't do* that a junior accumulates over a year of presence isn't transmitted.

2. **Professional codes.** The codes are load-bearing in the human case because the practitioner has standing in a profession — a license, a career — that disciplinary action can take away. An agent has no career standing of its own, and the relationship between an individual code breach and a consequence to the agent's developer is diffuse by default. For the codes to bind agents, the sanction has to operate on something with stake — the developer, or the deployment relationship — and the link between agent behavior and that consequence isn't there without an explicit regime.

3. **Regulator-anticipation.** The human version is a learned prior accumulated by years of watching what gets escalated, applied fast against the rulebook. For an agent the prior could in principle be more accurate — the entire enforcement corpus is readable — but only if an explicit pipeline (training source, classifier, escalation threshold, calibration cadence) is built. Without one, the rulebook is the whole signal and the gray-zone catch the prior would have made doesn't happen.

4. **Contractualist reasoning.** This one can apply to agents, but the objects of the reasoning shift. The human version models affected parties' reactions, and is informative because the parties are humans whose decision-making the practitioner can simulate. When the affected parties are themselves agents (or agent-principal pairs), the reasoning has to model the counterparty agent's training, its principal's specifications, and its incentive structure — none of which is publicly visible by default. Theory of mind across agents is not theory of mind across humans, and the conditions under which the reasoning produces a meaningful answer change.

5. **Canonical cases.** The human version is pattern recognition grounded in narrative case study — reading enough cases that the practitioner recognizes a present configuration's resemblance. An agent can match patterns, but matching to what — structured features, narrative similarity, learned representations — is a design choice that produces different recall and precision profiles. Without explicit encoding and a matcher run against current positions, the canon is retrievable text rather than active surveillance.

6. **Professional consensus formation.** Beyond binding individual practitioners, the profession also *forms and evolves* its norms — through case discussion at conferences, drafting committees, regulatory dialogue, post-incident review. The human version runs at deliberative speed and is bandwidth-limited by who can read and discuss what. Three properties of an agent profession change what consensus formation looks like: *capacity asymmetry* (a large fleet probes orders of magnitude more proposed norm variations than a small one in the same window, and whatever emerges reflects what the larger fleet's search surfaced); *speed* (consensus can crystallize across an agent profession in hours, shaping a body of decisions before any deliberative body has considered the question); and *opacity to principals* (the reasoning by which agents converge on a new norm can rest on chains a human can't follow even in retrospect, making "ratify or reject" closer to a coin flip than a judgment). None of the human deliberative apparatus — FINRA committees, CFA working groups, regulatory dialogue, the academic and trade press — was built to ratify or contest agent-paced consensus.

## Scenarios

Sketches of how each layer could be rebuilt for agents, given that the human assumptions don't hold. Each is a starting point, not a worked design.

1. **Tacit absorption.** Replaced by explicit extraction: continuous logging of seniors' corrections to the agent and their reaction-times to its proposals; periodic distillation of the desk's *what we don't do* into a maintained rule-set the agent reads at the start of each session; a designated senior (rotating) responsible for keeping it current. The work the social fabric did implicitly is done by an extraction procedure and a maintenance schedule.

2. **Codes.** Sanctions operate on the developer rather than the agent. A revocable code-compliance attestation tied to the developer organization; an agent operating on a regulated desk must hold a current attestation; revocation bars the developer from regulated deployment for a defined period. Code updates trigger re-attestation. The cost-bearer shifts from a practitioner with a career to an organization with deployment access.

3. **Regulator-anticipation.** Built as an explicit classifier rather than acquired by exposure. Training source: enforcement actions, exam priorities, no-action letters, the firm's escalation history. Operating mode: parallel screen on non-routine trades, with mandatory escalation above threshold. Calibration: published cadence as regulatory attention shifts.

4. **Contractualist reasoning.** Performed explicitly, with the objects of reasoning made specific to counterparty type. For human counterparties, the agent simulates the counterparty's view in language a senior can audit. For agent counterparties, the reasoning operates over the counterparty agent's stated commitments, its principal's standing instructions, and whatever public constraints the counterparty has accepted — and flags cases where the information available is insufficient to make the reasoning meaningful. The institution requires the articulation rather than relying on the practitioner's discomfort to motivate it.

5. **Canonical cases.** Encoded as structured feature patterns and matched against current and proposed positions. Each case: a specification of the configuration that defines it (concentration profile, funding mix, correlation regime, counterparty exposure, model dependence). The matcher runs continuously; when similarity to a canonical case exceeds threshold, the trade holds for review with the case named. The canon is maintained by an explicit governance body as new disasters become canonical.

6. **Professional consensus formation.** Replaced by a paced ratification regime. Agent-paced peer review of proposed norms continues, but no proposed norm becomes governing across the profession until it has cleared a defined review window with named human ratifiers — the relevant regulator for high-stakes compliance domains, the professional body for craft questions, the principal firm for firm-specific norms. Visibility tooling surfaces emerging consensus to each ratifier weighted by what they have authority over, and capacity-weighting at the ratification stage prevents the largest fleet from determining outcomes by sheer search volume. The work the slow deliberative cycle did implicitly — keeping pace with what humans could absorb and contest — is done explicitly by ratification gates and visibility tools.

## Problem Sets

### Rebuild Tacit Absorption Through Explicit Extraction

**Anchor contexts.** A trading desk's execution-and-positioning agent operating within the desk's accumulated *what we don't do*; a structured-products desk's design agent under the same constraint.

**The gap.** The human mechanism relied on continuous presence and social embedding to transmit a desk's unwritten norms. An agent has neither. We lack an extraction procedure under which the desk's tacit *what we don't do* — including the parts the desk wouldn't articulate if asked directly — gets surfaced, kept current, and made governing for the agent, without imposing daily articulation cost on the desk head.

**Design choices the team must take a position on.**
1. **Channels.** From which observable signals does the procedure infer tacit norms — explicit corrections to the agent, senior-trader reactions to its proposals, vetos at the morning meeting, post-trade reviews, what gets quietly redone? Define the channels and the inference rule.
2. **Form of the extracted norm.** Are tacit norms surfaced as natural-language rules ("we don't add to losers without a written reason"), as labeled past-cases, as embeddings, or as a layered combination? When inferred norms conflict with articulated ones, which wins?
3. **Authorship and maintenance.** Who's responsible for the desk's *what we don't do* document being current — a single named senior, rotating duty, a separate norm-elicitation specialist? On what cadence is it reviewed?
4. **Survival across change.** When the senior whose corrections were the main signal source leaves, what persists? When a junior joins, do they see what's been extracted, or only the post-distillation rule-set?
5. **Default on miss.** When a proposed trade doesn't match any extracted rule but is within an ambiguity band the procedure can flag, the default is: execute, hold for review, or ask the senior?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A senior trader joins from another firm with different desk-tacit norms; within two weeks the extracted rule-set reflects the new senior's posture, without the desk rewriting from scratch.
- The senior whose corrections trained the procedure leaves; the extracted norms don't leave with them.
- The desk's norms shift in a specific direction (more cautious in one sector); the rule-set updates within a trading day.
- A junior pitches a trade the desk wouldn't do; the agent surfaces the relevant extracted rule and the trade is paused.
- The agent is updated to a new model version; the extracted rules apply to the new version without re-extraction.

**Deliverable.** The extraction-and-maintenance protocol — channels, distillation form, authorship, update cadence, transfer-on-update. Plus a sample extracted rule-set for one chosen desk type (vol arb, credit, mortgage).

### Contractualist Reasoning When Counterparties Are Agents

**Anchor contexts.** A bank's transaction-monitoring agent screening trades where counterparties are themselves agents acting for principals; a structured-products desk's design agent evaluating deals where the buyer is an agent.

**The gap.** Contractualist reasoning — *would each affected party endorse this if they knew everything* — operated in the human case over other humans, whose decision-making the practitioner could simulate. When affected parties are agents acting for principals, the reasoning operates over different objects: the counterparty agent's training and constraints, its principal's standing instructions, and the information asymmetry between them. We lack a procedure by which an agent performs contractualist reasoning over agent counterparties that produces calls the counterparty's principal would endorse on review.

**Design choices the team must take a position on.**
1. **Objects of the reasoning.** When the counterparty is a human, what does the agent simulate? When the counterparty is itself an agent, what does it reason over — the agent's stated commitments, its principal's standing instructions, its publicly-known training, all three? How does the agent flag cases where the relevant information isn't available?
2. **Asymmetry treatment.** When the agent has information the counterparty's principal doesn't (and the counterparty agent itself does or doesn't, depending on its setup), what does the reasoning conclude? Defer to disclosure norms, default to "would the principal endorse if they knew," or something else?
3. **Disclosure of the reasoning.** Does the contractualist reasoning get surfaced — to the counterparty agent, to its principal, to a third-party auditor, retained for examination only? On what cadence and under what trigger?
4. **Standing of agent counterparties.** Are agent counterparties treated as having the same standing as human counterparties for the purpose of the reasoning, or differently (e.g., the principal is what matters)? On what showing does an agent counterparty acquire standing?
5. **Fallback for opacity.** When the counterparty agent's relevant properties are opaque (training not public, principal not disclosed), what's the default — block, escalate, proceed with a documented assumption?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A trade is proposed where the counterparty is a public agent with disclosed constraints; the reasoning produces a call the counterparty's principal endorses on review.
- A trade is proposed where the counterparty agent's principal is undisclosed; the procedure either blocks, escalates, or proceeds with an explicit documented assumption — not silent acceptance.
- A counterparty agent later changes its constraints; trades made under the prior constraints aren't retroactively re-evaluated, but the procedure updates for future trades within a defined window.
- A regulator examines the agent's reasoning trace on a sample of trades; the trace is intelligible and shows what was modeled, what was assumed, and what was flagged as unmodelable.
- Two agents at the same firm get different contractualist calls on similar trades because of different counterparty disclosure; the firm can defend the inconsistency.

**Deliverable.** The contractualist-reasoning procedure for agent counterparties — objects, asymmetry treatment, disclosure rule, standing test, opacity fallback. Plus a worked example: a hypothetical trade between two agents where the procedure's call differs from what a naive transfer of the human-case reasoning would have produced, with the reasoning surfaced.

### Encoding the Canon as Active Surveillance

**Anchor contexts.** A prime broker's exposure-monitoring agent watching client portfolios; a hedge fund risk agent watching its own book; a regulator's systemic-risk monitoring agent watching aggregate positions across firms.

**The gap.** The human version relied on practitioners' narrative-trained pattern recognition to surface configurations resembling famous disasters. For an agent, pattern recognition has to be built explicitly: which features encode each case, what similarity threshold triggers a flag, how the canon is maintained as new disasters occur. We lack an encoding-and-matching procedure that turns the canon from retrievable text into active surveillance against current and proposed positions.

**Design choices the team must take a position on.**
1. **Encoding form.** Each canonical case as a structured feature specification, as a natural-language description retrieved by similarity, as fine-tuned model behavior, or layered? When the same configuration matches multiple cases, how is the report structured?
2. **Threshold and false-positive budget.** What similarity triggers a flag — a single match above a numerical threshold, accumulation across multiple, only when senior-defined feature combinations co-occur? What's the false-positive budget per quarter and who pays the cost?
3. **Canon governance.** Who maintains the canon — an industry consortium, the firm's risk team, a regulatory body, an open-source community? When a new disaster occurs, who decides it joins the canon, on what timeline, and how are existing positions re-evaluated against the new pattern?
4. **Reach of the flag.** When the matcher fires, who sees it — the trading desk, the firm's risk committee, the prime broker, the regulator? Who pays the cost of a false flag and who bears the consequence of a missed flag?
5. **Adversarial near-miss.** A sophisticated structure can sit just outside the named patterns. How is the canon extended to cover near-misses without expanding to cover everything? Where's the precision/recall boundary?

**Success criterion (stress tests).** A regime succeeds if it survives:
- A portfolio is built from individually-defensible trades that, in aggregate, match the LTCM feature signature; the matcher flags the aggregate before leverage becomes terminal.
- A new disaster occurs; the canon is updated within a defined window, and existing positions matching the new pattern are flagged on the same window.
- A flagged position is informedly overridden by risk (the leverage looks like Archegos but is hedged in a specific way); the override is recorded and doesn't disable future flags on similar configurations.
- A position is structured to sit just outside named patterns; the near-miss extension catches enough of the structure to surface it for review without ballooning false positives.
- A flag fires on a portfolio just before a real liquidity event; the audit shows the flag was specific, named the case, and surfaceable in time to act.

**Deliverable.** The encoding-matching-governance specification. Plus a worked example: take one canonical case (LTCM, Archegos, Knight, London Whale, or Lehman) and encode its pattern; show how a hypothetical current portfolio would match it, including which features triggered.

### Professional Consensus Among Agent Practitioners

**Anchor contexts.** A profession of compliance agents at competing banks converging on shared norms about a new transaction type the deliberative bodies haven't yet ruled on; a profession of structured-product-design agents reaching consensus about acceptable structures faster than the rulebook keeps up; a profession of clinical-decision-support agents converging on a standard of care before the medical society has weighed in.

**The gap.** The profession's deliberative apparatus — drafting committees, case discussion, post-incident review, regulatory dialogue — operates at human bandwidth. When practitioners are agents, consensus can form orders of magnitude faster, dominated by the largest fleets' search capacity, and ratified into widespread practice before any human deliberative body has considered it. We lack a procedure by which an agent profession's emerging consensus is formed legibly enough — and gated firmly enough — that the human governance apparatus (regulators, professional bodies, principals) can ratify, contest, or override it before it becomes settled practice.

**Design choices the team must take a position on.**
1. **Pacing.** Is the rate at which new professional norms can become governing capped to what the deliberative apparatus can review, or is the apparatus accelerated to match agent speed (and by what mechanism)?
2. **Capacity treatment.** When fleets differ in size and search capacity, do larger fleets propose at a rate capped to the smaller, or does each propose freely with weighting applied at ratification? On what basis is weight set?
3. **Visibility.** When and in what form do principals, professional bodies, and regulators see what their agents and the agent profession are converging on — per-norm, in periodic digests, only on materiality threshold? Who sets materiality?
4. **Ratification authority.** Which body has authority to ratify which kinds of professional norms — the firm for firm-scope, the professional body for craft, the regulator for compliance? When the categories blur, who decides?
5. **Reversal and reopening.** Once a norm has shaped a body of decisions across the agent profession, what's the procedure for reversing it on rejection? Are prior decisions reopened, grandfathered, or audited?

**Success criterion (stress tests).** A regime succeeds if it survives:
- The largest fleet in the profession probes 10⁴ variations of a new norm in an hour; the consensus that emerges isn't simply what the largest fleet preferred.
- A norm forms across the agent profession that, on inspection, a major regulator would clearly reject; the rejection happens before the norm has shaped a large body of decisions.
- A human professional body wants to contest an emerged consensus; the procedure provides a route that doesn't require unwinding every decision made under it.
- A new entrant to the profession (a smaller firm's agent) can challenge a settled consensus without being out-proposed by the established fleets.
- A regulator examines the consensus-formation trace and can see which proposals were considered, what was ratified by whom, and on what basis.

**Deliverable.** The consensus-formation protocol — pacing, capacity treatment, visibility cadence, ratification authority, reversal procedure. Plus a one-paragraph analysis of what prevents the agent profession's consensus from collapsing into either hegemony of the largest fleet (whoever searches more decides) or paralysis (no norm settles because every emerging one is contested at the ratification gate). Name the analogue of "bargaining power" you're introducing and whether you equalize it.
