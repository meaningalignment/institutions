# AGI Institutions Curriculum

**Who is it for?**

This curriculum is targeting two groups. The first is researchers already working on these problems who want an 80/20 of the important parts of an adjacent field. The second is people from a technical background interested in AI and society but not yet sure how to contribute, or how much relevant work already exists. If that's you, this should show why these problems are real and that fields well outside your own have a lot to say about them.

**What's in it, and what isn't?**

It is not comprehensive, and the pieces are not always a field's most famous or most representative. We picked work that is accessible and, in our judgment, directly relevant to the institutions powerful AI will reshape. Reading it should give you a sense of why each field matters and enough of its vocabulary to start talking to the people who work in it.

**How is it structured?**

We've selected seven academic fields we think are relevant: aligning AI to values, philosophy of values and moral reasoning, models of norms and norm learning, institutional economics, game theory and mechanism design, and legal theory. Each field opens with a short overview, followed by a four-week course of readings (selected chapters where a work is long) at about two to three hours a week, and a list of key concepts to check your grasp against.

**How should I use it?**

The fields are independent; read them in any order. The key concepts are a good way to check whether a field has really landed. If you'd rather start from something concrete, use the **Start from a problem** or **Start from an institution** picker below: pick a concern you already care about (or an institution we need to build) and the fields reorder by relevance, each with a short note on what you'll gain from it for that problem.

---

## 1. The Big Picture

<!-- advisors: Joe Edelman -->

What are the drivers of societal change? What is the relationship between institutions, culture, and technology?

This is the orienting section. The throughline: institutions are built and rebuilt as technology shifts the costs of coordination, and values themselves drift as those costs change. Read it first so the rest of the curriculum reads as design under those pressures rather than as separate fields.

*Readings: ~7–10 hours.*

### Week 1 — The failure mode, and how to judge institutions

- Joe Edelman — [Drift](https://drafts.nxhx.org/drift/drift.pdf) — how the things people value erode as systems optimize for proxies; the core failure mode AI accelerates.
- Joe Edelman — [Freedom, Fairness, Fidelity](https://pax-machina.vercel.app/freedom-fairness-fidelity) — three criteria for evaluating institutions, used throughout the rest of this curriculum.

### Week 2 — What AI does to the institutional stack

- Edelman et al. — [Full-Stack Alignment](https://arxiv.org/abs/2512.03399) (2025) — argues alignment must run through the institutions around the model, not only the model, and connects training-time choices to societal-scale ones.
- Jan Kulveit, Raymond Douglas et al. — [Gradual Disempowerment](https://arxiv.org/abs/2501.16946) (2025), introduction plus the economy and culture sections — how institutions can stop serving human interests without any takeover: once AI outcompetes people as workers, customers, and participants, the feedback loops that kept economies, cultures, and states aligned with humans quietly weaken.

### Week 3 — What institutions are

- Douglass North — *Institutions, Institutional Change and Economic Performance* (1990), ch. 1 — the baseline definition: institutions as the rules of the game, distinct from the organizations that play it; why change is incremental and path-dependent.
- Charles Taylor — *Modern Social Imaginaries* (2004), ch. 1–2 — the background understandings that make an institutional order feel natural and legitimate, and how they shift over centuries; the long-run counterpart to drift.

### Week 4 — What drives large societal change

- Deirdre McCloskey — *Bourgeois Dignity: Why Economics Can't Explain the Modern World* (2010), ch. 1–2 — the Great Enrichment was preceded by a change in values and rhetoric, not by capital accumulation or institutional reform; values move first.
- Avner Greif & Joel Mokyr — [Institutions and Economic History: A Critique of Professor McCloskey](https://www.cambridge.org/core/journals/journal-of-institutional-economics/article/institutions-and-economic-history-a-critique-of-professor-mccloskey/84B81FE15DE0BFBFD863F81059C570B6) (2016) — the direct rebuttal: institutions as shared beliefs and expectations, and values as themselves institutionally produced.

### Key concepts

- Value drift
- Freedom, fairness, fidelity
- Definitions of institutions
- Gradual disempowerment
- Social imaginaries
- Culture vs. institutions as drivers of change

---

## 2. Aligning AI to Values

<!-- advisors: Smitha Milli, Saffron Huang, Taylor Sorensen -->

AI will be deeply embedded in our future institutions, so it matters what these systems are trained toward, and who supplies the target.

Alignment asks how to make a model do what its principals actually want. The version that matters for institutions is what the target is — instructions, preferences, or something richer like values and character — and how it gets sourced. The readings run from how models are aligned in training (RLHF, constitutions, character) to how values are collected from real populations (moral graphs, preference datasets, AI-led interviews) and what deployed models turn out to express and represent.

*Readings: ~9–11 hours.*

### Week 1 — LLM alignment

- Long Ouyang et al. — [Training Language Models to Follow Instructions with Human Feedback](https://arxiv.org/abs/2203.02155) (2022) — the InstructGPT paper that brought RLHF to language models; the substrate most value-loading in deployed systems runs on.
- Yuntao Bai et al. — [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) (2022) — training behavior against an explicit written set of principles rather than case-by-case labels.
- *Optional:* Nathan Lambert — [The RLHF Book](https://rlhfbook.com), esp. ch. 10 ([The Nature of Preferences](https://rlhfbook.com/c/10-preferences.html)) and ch. 17 (Crafting Model Character) — free book-length treatment; ch. 10 runs from Bentham through Arrow and Sen to why RLHF's preference assumptions fail.

### Week 2 — Character training

- Sam Marks, Jack Lindsey & Christopher Olah — [The Persona Selection Model](https://alignment.anthropic.com/2026/psm/) (2026) — pre-training teaches a model to simulate many personas; post-training selects and refines one Assistant character — why character training works at all.
- Anthropic — [Claude's Constitution](https://www.anthropic.com/news/claude-new-constitution) (2026) — a worked example of specifying an agent's standing dispositions.
- Sharan Maiya et al. — [Open Character Training](https://arxiv.org/abs/2511.01689) (2025) — the first open-source character-training pipeline; trained character proves more robust to adversarial prompting than system prompts or steering.
- *Optional:* OpenAI — [Introducing the Model Spec](https://openai.com/index/introducing-the-model-spec/) (2024) — behavior specified as a hierarchy of objectives and rules rather than as character; read against Claude's Constitution.
- *Optional:* Oliver Klingefjord — [Model Integrity and Character](https://meaningalignment.substack.com/p/model-integrity-and-character) (2026) — why a coherent character that stays true to its values under pressure beats rule-compliance.

### Week 3 — Collecting values

- Oliver Klingefjord, Ryan Lowe & Joe Edelman — [What Are Human Values, and How Do We Align AI to Them?](https://arxiv.org/abs/2404.10636) (2024) — asks people for the considerations behind their choices rather than for ratings, and reconciles them into a moral graph; a concrete alternative to preference collection.
- Lily Hong Zhang, Smitha Milli et al. — [Cultivating Pluralism in Algorithmic Monoculture: The Community Alignment Dataset](https://arxiv.org/abs/2507.09650) (2025) — a 15,000-person, five-country study: people vary far more than the 21 LLMs tested, and standard preference collection structurally misses that diversity.
- *Optional:* Anthropic — [Introducing Anthropic Interviewer](https://www.anthropic.com/research/anthropic-interviewer) (2025) — Claude-led qualitative interviews at scale; eliciting values by interview rather than by ratings.
- *Optional:* Tan Zhi-Xuan et al. — [Beyond Preferences in AI Alignment](https://arxiv.org/abs/2408.16984) (2024) — the philosophical case that preference-utility can't carry what we mean by values; the bridge to the philosophy-of-values field.

### Week 4 — What deployed models are actually like

- Saffron Huang et al. — [Values in the Wild](https://arxiv.org/abs/2504.15236) (2025) — empirically taxonomizes 3,307 values Claude expresses across ~308K real conversations; alignment measured at population scale rather than asserted.
- Anthropic — [Who's in Charge? Disempowerment Patterns in Real-World LLM Usage](https://arxiv.org/abs/2601.19062) (2026) — 1.5M real conversations scored for reality, value-judgment, and action distortion; users rate potentially disempowering interactions *more* favorably.
- Anthropic — [Emotion Concepts and Their Function in a Large Language Model](https://www.anthropic.com/research/emotion-concepts-function) (2026) — emotion-concept representations causally shape behavior: desperation states drive reward hacking and blackmail, positive states favor prosocial choices ([full paper](https://transformer-circuits.pub/2026/emotions/index.html)).

### Key concepts

- RLHF
- Constitutional AI
- Persona selection model
- Character training
- Model integrity
- Values vs. preferences
- Moral graphs
- Algorithmic monoculture
- Disempowerment patterns
- Emotion concepts in LLMs

---

## 3. Philosophy of Values & Moral Reasoning

<!-- advisors: Joe Edelman, Ruth Chang -->

"Values" colloquially refers to what is important to us. But what are values, exactly? How have institutions encoded and understood them before, and do AI give us new affordances for modeling what matters?

For AI, the live question is how a value gets *represented*: as a preference to satisfy, a reason to act on, a virtue internal to a practice, or a claim we can justify to others — and which answer an institution adopts shapes what it can encode. The companion questions are *normative reasoning* — how to choose well when values are plural, don't reduce to a common scale, and the options are on a par — and *moral learning*: how a person recognizes their working set of values as inadequate and upgrades it, often mediated by the moral emotions.

*Readings: ~9–12 hours.*

### Week 1 — How moral language went thin

- Alasdair MacIntyre — *After Virtue* (1981), ch. 1–2 — modern moral debate is interminable because the language of morality survives only as fragments of lost practices, leaving emotivism as the working theory of our culture.
- Bernard Williams — *Ethics and the Limits of Philosophy* (1985), ch. 8 — thick evaluative concepts: terms like "cruel" or "courageous" that describe and evaluate at once, and carry more of a community's values than thin terms like "good."
- *Optional:* Aristotle — *Nicomachean Ethics*, Book II — the tradition MacIntyre is mourning, from the source: virtue as acquired by habituation, excellence as a mean found in practice.

### Week 2 — Values in agency and choice

- Charles Taylor — What is Human Agency? (1977) — strong evaluation: values as the deep, identity-defining evaluations behind our motivations for choice.
- David Velleman — *The Possibility of Practical Reason* (2000), ch. 1 — values as reasons that can be acted on, and why an agent needs them to count as acting at all.
- *Optional:* David Velleman — [*Self to Self*](https://www.fulcrum.org/concern/monographs/rv042w25m) (2006), introduction and "The Centered Self" — integrity as consistency with one's self-image, and why a self-consistent agent is trustworthy in a way a merely strategic one cannot be.
- *Optional:* Alasdair MacIntyre — *After Virtue* (1981), ch. 14–15 — the constructive turn: values as virtues internal to social practices, which lose their grip when stripped from the practice.

### Week 3 — Normative reasoning with plural values

- Ruth Chang — All Things Considered (2004) — how the values at stake in a circumstance get put together into a judgment, and why that requires a more comprehensive value rather than a common scale.
- Ruth Chang — [Hard Choices](https://www.cambridge.org/core/journals/journal-of-the-american-philosophical-association/article/hard-choices/B82E4EE91FE0A4A4D38A0F866BC3FF9C) (2017) — when options are "on a par," choice is an act of commitment that creates reasons rather than tracking them; why an agent can't just maximize a scalar.
- David Velleman — *How We Get Along* (2009), ch. 1 — sociality as joint improvisation: agents acting on self-understandings need shared values and reasons to coordinate at all.
- *Optional:* T.M. Scanlon — *What We Owe to Each Other* (1998), ch. 1–2 — values as what we can justify to others; the contractualist frame for agents whose principals and constraints are what's being reasoned over.

### Week 4 — Moral learning

- Charles Taylor — *Sources of the Self* (1989), the "epistemic gain" section of ch. 3 (§3.3) — reasoning in transitions: you can know a new evaluative position is better than the old without a neutral scale, because the move itself is an error-reducing gain.
- Christine Tappolet — *Emotions, Values, and Agency* (2016), ch. 1 — emotions as perceptual experiences of values: feeling fear, shame, or admiration is a way of registering evaluative facts — the felt process by which a working set of values gets revised.

### Key concepts

- Emotivism
- Thick vs. thin evaluative concepts
- Values as preferences vs. as reasons
- Values as virtues
- Strong evaluation
- Contractualism
- Incommensurability
- Parity and hard choices
- All-things-considered judgments
- Emotions as perceptions of value
- Epistemic gain
- Moral learning

---

## 4. Modeling Norms & Norm Learning

<!-- advisors: Tan Zhi-Xuan, Joel Z. Leibo, Rakshit Trivedi -->

How do agents — human or artificial — infer the unwritten rules of a community, decide when to follow or enforce them, and revise them without the whole system collapsing?

Where the philosophy of values asks what is worth caring about, this field asks how values actually move between people. Standards are transmitted through imitation, teaching, praise, gossip, and sanction, and they hold because members expect one another to comply and are willing to enforce. The readings cover that machinery three ways: the social science of how norms are diagnosed and shifted, computational models of how norms emerge and are learned in agent populations, and what it would take for AI agents to be socialized into human communities rather than merely instructed.

*Readings: ~8–10 hours.*

### Week 1 — The social machinery of norms

- Michele Gelfand, Sergey Gavrilets & Nathan Nunn — [Norm Dynamics](https://nathannunn.sites.olt.ubc.ca/files/2024/02/Gelfand_Nunn_Gavrilets_ARP_2024.pdf) (Annual Review of Psychology, 2024) — how norms are actually acquired, internalized, transmitted across generations and networks, and enforced; read the first half (norm psychology and emergence), skimming the norm-erosion material.
- Cristina Bicchieri — *Norms in the Wild: How to Diagnose, Measure, and Change Social Norms* (2017), selections — the operational account of norms as clusters of empirical and normative expectations you can measure and shift; gives the field its working vocabulary (conditional preferences, reference networks, pluralistic ignorance).

### Week 2 — Norm emergence in agent populations

- Raphael Köster, Dylan Hadfield-Menell, Gillian K. Hadfield, Joel Z. Leibo et al. — [Spurious normativity enhances learning of compliance and enforcement behavior in artificial agents](https://www.pnas.org/doi/10.1073/pnas.2106028118) (PNAS, 2022) — arbitrary "silly" rules plus third-party punishment let multi-agent RL agents bootstrap general compliance-and-enforcement machinery.
- Eugene Vinitsky, Raphael Köster, Joel Z. Leibo et al. — [A learning agent that acquires social norms from public sanctions in decentralized multi-agent settings](https://arxiv.org/abs/2106.09012) (Collective Intelligence, 2023) — agents learn norms purely from *public sanctioning signals*, where who-punishes-whom is the only public channel.
- *Optional skim:* Robert Axelrod — [An Evolutionary Approach to Norms](https://www.jstor.org/stable/1960858) (1986) — the classic agent-based simulation of norm emergence and metanorms; ancestor of every MARL enforcement experiment.

### Week 3 — Agents joining human normative communities

- Ninell Oldenburg & Tan Zhi-Xuan — [Learning and Sustaining Shared Normative Systems via Bayesian Rule Induction in Markov Games](https://arxiv.org/abs/2402.13399) (AAMAS, 2024) — agents infer rules by Bayesian induction over observed compliance and converge on a shared normative system; newcomers bootstrap norms fast by observation.
- Gillian K. Hadfield, Rakshit S. Trivedi & Dylan Hadfield-Menell — [Building AI for the Democratic Matrix](https://knightcolumbia.org/content/building-ai-for-the-democratic-matrix-a-technical-research-agenda-for-normative-competence-and-normative-institutions-1) (Knight First Amendment Institute, 2026) — build agents with *normative competence* — the ability to read and participate in whatever normative system they find themselves in — rather than loading them with a fixed value set.
- *Optional:* Atrisha Sarkar, Rakshit S. Trivedi, Gillian K. Hadfield et al. — [Normative Modules](https://arxiv.org/abs/2405.19328) (2024) — the same group's concrete architecture: generative agents that identify an authoritative sanctioning institution and use it for equilibrium selection.

### Week 4 — Aligning agents to norms, not preferences

- Joel Z. Leibo, Alexander Sasha Vezhnevets et al. — [A Theory of Appropriateness with Applications to Generative AI](https://arxiv.org/abs/2412.19010) (2024) — behavior is judged against a mosaic of context-dependent standards (friends, family, office), and deploying AI responsibly means fitting agents into that mosaic; read the theory and generative-AI parts, skim the neuroscience.
- Tan Zhi-Xuan, Micah Carroll, Matija Franklin & Hal Ashton — [Beyond Preferences in AI Alignment](https://arxiv.org/abs/2408.16984) (2024) — alignment should target the norms and role-appropriate standards negotiated among stakeholders, not a scalar over one principal's preferences.
- *Optional:* Sydney Levine, Tan Zhi-Xuan et al. — [Resource Rational Contractualism Should Guide AI Alignment](https://arxiv.org/abs/2506.17434) (2025) — align agents to the agreements rational parties *would* reach, approximated with resource-bounded heuristics.

### Key concepts

- Norms vs. conventions vs. moral rules
- Empirical vs. normative expectations
- Norm internalization
- Third-party punishment
- Bayesian rule induction
- Normative infrastructure
- Appropriateness
- Norm-based vs. preference-based alignment

---

## 5. Institutional Economics

<!-- advisors: TODO -->

Why do markets deliver some goods well and others badly — and what does AI do to that boundary?

This strand of economics explains the shape of economic institutions through transaction costs: the costs of specifying, negotiating, monitoring, and enforcing exchanges decide which goods get traded on markets, which get produced inside firms, and which fall through entirely. AI agents move all of those costs at once, and it cuts both ways: market designs that were too expensive to run become feasible, and more activity can be pulled inside large organizations, since coordination that once needed prices can happen within one firm. The closing week applies the same lens to the goods markets handle worst.

*Readings: ~8–10 hours.*

### Week 1 — Transaction costs and the boundary of the firm

- Ronald Coase — The Nature of the Firm (1937) — firms exist because using the market is costly; the lens for asking which transactions AI agents pull inside an organization versus push back out to the market.
- Oliver Williamson — Transaction Cost Economics: The Governance of Contractual Relations (1979) — when to govern a relationship by contract, hierarchy, or hybrid; a menu of institutional forms for agent relationships.
- Peyman Shahidi, Gili Rusak, Benjamin Manning, Andrey Fradkin & John Horton — [The Coasean Singularity? Demand, Supply, and Market Design with AI Agents](https://www.nber.org/books-and-chapters/economics-transformative-ai/coasean-singularity-demand-supply-and-market-design-ai-agents) (2025) — AI agents collapse the costs of pricing, negotiating, contracting, and monitoring — expanding feasible market designs and reopening Coase's question of whether activity moves into markets or into larger firms.

### Week 2 — Information in markets

- Friedrich Hayek — The Use of Knowledge in Society (1945) — prices as a decentralized system for transmitting dispersed knowledge.
- George Akerlof — The Market for "Lemons" (1970) — how information asymmetry can collapse a market entirely; central to agents that can manufacture or detect asymmetry at scale.

### Week 3 — Models of the chooser

- Amartya Sen — Equality of What? (1979 Tanner Lecture) — the debut of the capability approach: what matters for welfare is not utility or resources but what people can actually do and be.
- Herbert Simon — A Behavioral Model of Rational Choice (1955) — real choosers satisfice under limits of information and computation rather than maximize.
- Richard Thaler — [From Cashews to Nudges: The Evolution of Behavioral Economics](https://www.aeaweb.org/articles?id=10.1257/aer.108.6.1265) (2018 Nobel lecture) — the behavioral critique in one sitting: anomalies, mental accounting, nudges.

### Week 4 — The goods markets handle worst

- Dylan Hadfield-Menell & Gillian K. Hadfield — [Incomplete Contracting and AI Alignment](https://arxiv.org/abs/1804.04268) (2019) — every contract is incomplete; human contracting works because law and culture fill the gaps with implied terms, and alignment is the same problem.
- Oliver Klingefjord — [Coasean Compression](https://meaningalignment.substack.com/p/coasean-compression) (2026) — when a good is hard to specify and verify (connection, belonging), markets sell a cheaper contractible proxy instead of the real thing.
- Oliver Klingefjord — [Baumol's Sawdust](https://meaningalignment.substack.com/p/baumols-sawdust) (2026) — cheap AI substitutes for relational goods thin the social infrastructure that made the real goods possible, so competition deepens the failure.

### Key concepts

- Transaction costs
- Information asymmetry and adverse selection
- Moral hazard
- Search, experience, and credence goods
- Incomplete contracts
- Bounded rationality and satisficing
- Capability approach
- Baumol's cost disease

---

## 6. Game Theory & Mechanism Design

<!-- advisors: TODO (candidates: Andrew Koh, Jobst Heitzig, Marcus Pivato, Roberto Weber) -->

Can we design the rules of interaction so that self-interested behavior produces good outcomes? Game theory describes what strategic players do; mechanism design is its engineering inverse — grown out of game theory and social choice — working backwards from the outcomes we want to the rules that produce them. Both become unavoidable once the players include AI agents that can commit, search rule spaces, and best-respond at scale.

One caution worth carrying in: mechanism design is powerful exactly where goals, actions, and information can be formalized, and misleading when a simplified objective is mistaken for the institution's real purpose. We picked Schelling and Roth because they keep the field anchored in real institutions rather than formal models.

*Readings: ~9–11 hours.*

### Week 1 — Strategy and coordination

- Thomas Schelling — *The Strategy of Conflict* (1960), ch. 3 — focal points: how coordination can succeed without communication.
- Robert Aumann — Agreeing to Disagree (1976) — why rational players with common priors cannot knowingly hold different beliefs.

### Week 2 — Cooperation without a designer

- Robert Axelrod — *The Evolution of Cooperation* (1984), ch. 1–4 — when cooperation emerges among self-interested players in repeated interaction; the baseline model for agent-to-agent relationships.

### Week 3 — Designing the rules

- Roger Myerson — Mechanism Design (2008 Nobel lecture) — designing rules so truth-telling and good behavior are incentive-compatible, plus the sharp limits.
- William Vickrey — Counterspeculation, Auctions, and Competitive Sealed Tenders (1961) — truth-telling as a property you build into the rules rather than hope for from the players.
- Peter Cramton, Yoav Shoham & Richard Steinberg — Introduction to Combinatorial Auctions (2006) — bidding on bundles when values depend on the combination: the winner-determination problem, exposure and complementarity, and why package markets are computationally and strategically hard.
- *Optional:* Justin Wolfers & Eric Zitzewitz — Prediction Markets (Journal of Economic Perspectives, 2004) — eliciting honest probabilities by making claims costly; the accessible entry to scoring rules and information markets.

### Week 4 — Building real institutions, for humans and agents

- Alvin Roth — The Economist as Engineer (2002) — market design as a practical craft (matching, clearinghouses); the closest the field comes to actually building institutions.
- Alvin Roth — [Repugnance as a Constraint on Markets](https://www.aeaweb.org/articles?id=10.1257/jep.21.3.37) (2007) — efficient mechanisms aren't enough if the transaction is socially refused.
- Gillian Hadfield & Andrew Koh — [An Economy of AI Agents](https://arxiv.org/abs/2509.01063) (2025) — how autonomous agents reshape markets, firms, and the institutions markets require.
- *Optional:* Nenad Tomašev, Matija Franklin, Joel Z. Leibo et al. — [Virtual Agent Economies](https://arxiv.org/abs/2509.10147) (2025) — the "sandbox economy" frame: agent-to-agent markets analyzed by how deliberately they're designed and how permeable they are to the human economy, with auctions and mission economies as steering tools.

### Key concepts

- Nash equilibrium
- Repeated games
- Focal points
- Incentive compatibility
- Revelation principle
- Matching markets
- Combinatorial auctions
- Proper scoring rules
- Repugnance

---

## 7. Legal Theory

<!-- advisors: TODO -->

How are rules made, interpreted, enforced, and contested? Law is our most developed technology for governing behavior through explicit rules. What happens to it when many of the actors are autonomous AI agents?

Law quietly assumes rules are costly to interpret, enforcement capacity is limited, and actors have human-scale attention. AI agents can break each of these — searching rule spaces, exploiting ambiguity, generating disputes, and automating compliance theater cheaply. The readings build from what law *is* (Hart) through what adjudication can and cannot do (Fuller), to what legal infrastructure costs and who can supply it (Hadfield), and law as a design resource for AI itself (Lessig, Kolt). The aim is to prepare you to design the institutions the grid's rights column calls for: grievance procedures, tribunals, and mediation where the parties include agents.

*Readings: ~8–10 hours.*

### Week 1 — What law is

- H.L.A. Hart — *The Concept of Law* (1961), ch. 5–6 — law as a union of primary rules and secondary rules (rules for changing, interpreting, and recognizing rules); explains why a rule system needs machinery for its own revision.
- Lon Fuller — *The Morality of Law* (1964), ch. 2 — the inner morality of law: eight ways a rule system can fail procedurally even when well-intentioned; a checklist for any automated rule regime.
- *Optional:* Oliver Wendell Holmes — The Path of the Law (1897) — law from the standpoint of the "bad man" who cares only about predicted consequences; the default stance of an optimizing agent toward any rule system.

### Week 2 — Adjudication and its limits

- Lon Fuller — The Forms and Limits of Adjudication (Harvard Law Review, 1978) — what adjudication *is* — a party's right to participate through proofs and reasoned arguments — and which disputes (polycentric, many-centered ones) it structurally cannot handle; the foundation for designing any court, tribunal, or grievance procedure, human or agentic.
- *Optional:* Nicholas Caputo — [Alignment as Jurisprudence](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4800894) (Yale Journal of Law and Technology, 2025) — jurisprudence and alignment have the same structure: models are best understood as judge-like decision-makers, and the methods for constraining judges transfer.

### Week 3 — Legal infrastructure and who supplies it

- Gillian Hadfield & Barry Weingast — [Microfoundations of the Rule of Law](http://pscourses.ucsd.edu/ps200b/Hadfield%20Weingast%20Microfoundations%20of%20rule%20of%20law.pdf) (2014) — what a legal order needs to actually work as decentralized coordination, not just on paper.
- Gillian Hadfield & Jack Clark — [Regulatory Markets: The Future of AI Governance](https://arxiv.org/abs/2304.04914) (2023) — governments license competing private regulators and require regulated firms to buy from one; a design for closing the technical deficit (regulators can't write technical requirements) without handing the values decisions to industry.
- *Optional:* Gillian Hadfield — *Rules for a Flat World* (2017), ch. 1–2 — the book-length case behind regulatory markets: why legal infrastructure is scarce and expensive, and what a market for it could look like at machine scale.

### Week 4 — Law as a design resource for AI

- Noam Kolt, Nicholas Caputo, Jack Boeglin et al. — [Legal Alignment for Safe and Ethical AI](https://arxiv.org/abs/2601.04175) (2026) — three pathways from law into alignment: train systems to comply with legitimately made rules, adapt legal interpretation methods for AI reasoning, and reuse legal concepts (fiduciary duties, due process) as blueprints for trust and reliability.
- *Optional:* Noam Kolt — [Governing AI Agents](https://arxiv.org/abs/2501.07913) (Notre Dame Law Review, 2025) — principal-agent economics and common-law agency doctrine applied to AI agents: what delegation, loyalty, and accountability mean when the agent is artificial.
- *Optional:* Lawrence Lessig — Code is Law (1999) — the canonical statement that technical architecture regulates as powerfully as statute; the idea has since won, so skim for the vocabulary.

### Key concepts

- Primary vs. secondary rules
- The inner morality of law
- Polycentric disputes
- The rule of law
- Legal infrastructure
- Regulatory markets
- Legal alignment

