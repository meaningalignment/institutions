# AGI Institutions Curriculum

**Who is it for?**

This curriculum is targeting two groups. The first is researchers already working on these problems who want an 80/20 of the important parts of an adjacent field. The second is people from a technical background interested in AI and society but not yet sure how to contribute, or how much relevant work already exists. If that's you, this should show why these problems are real and that fields well outside your own have a lot to say about them.

**What's in it, and what isn't?**

It is not comprehensive, and the pieces are not always a field's most famous or most representative. We picked work that is accessible and, in our judgment, directly relevant to the institutions powerful AI will reshape. Reading it should give you a sense of why each field matters and enough of its vocabulary to start talking to the people who work in it.

**How is it structured?**

We've selected seven academic fields we think are relevant: aligning AI to values, philosophy of values and moral reasoning, models of norms and norm learning, institutional and behavioral economics, game theory and mechanism design, and legal theory. Each field opens with a short overview, followed by a four-week course of readings (selected chapters where a work is long) at about two to three hours a week, and a list of key concepts to check your grasp against.

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

- Deirdre McCloskey — *Bourgeois Dignity: Why Economics Can't Explain the Modern World* (2010), ch. 1–2 — the case that the Great Enrichment was preceded by a change in values and rhetoric (dignity and liberty for commerce), not by capital accumulation or institutional reform; values move first, the big societal change follows.
- Avner Greif & Joel Mokyr — [Institutions and Economic History: A Critique of Professor McCloskey](https://www.cambridge.org/core/journals/journal-of-institutional-economics/article/institutions-and-economic-history-a-critique-of-professor-mccloskey/84B81FE15DE0BFBFD863F81059C570B6) (2016) — the direct rebuttal: institutions as shared beliefs and expectations, not just formal rules, and values as themselves institutionally produced; read against McCloskey to see what the ideas-first account leaves out.

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

- Long Ouyang et al. — [Training Language Models to Follow Instructions with Human Feedback](https://arxiv.org/abs/2203.02155) (2022) — the InstructGPT paper that brought RLHF to language models; the technique that lets human judgment shape model behavior and the substrate most value-loading in deployed systems runs on.
- Yuntao Bai et al. — [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) (2022) — training behavior against an explicit written set of principles rather than case-by-case labels; a concrete instance of encoding values as a governing document.
- *Optional:* Nathan Lambert — [The RLHF Book](https://rlhfbook.com), esp. ch. 10 ([The Nature of Preferences](https://rlhfbook.com/c/10-preferences.html)) and ch. 17 (Crafting Model Character) — a free, continuously updated book-length treatment; ch. 10 is a self-contained tour from Bentham through von Neumann–Morgenstern, Arrow, and Sen to why RLHF's preference assumptions fail.

### Week 2 — Character training

- Sam Marks, Jack Lindsey & Christopher Olah — [The Persona Selection Model](https://alignment.anthropic.com/2026/psm/) (2026) — why character training works at all: pre-training teaches a model to simulate many personas, and post-training selects and refines one Assistant character; assistant behavior is then best understood through that character's traits and self-model.
- Anthropic — [Claude's Constitution](https://www.anthropic.com/news/claude-new-constitution) (2026) — read as a worked example of constitutional and character-based training, i.e. what it looks like to specify an agent's standing dispositions, not as a canonical text.
- Sharan Maiya et al. — [Open Character Training](https://arxiv.org/abs/2511.01689) (2025) — the first open-source pipeline for character training: shaping a persona via Constitutional AI and synthetic introspective data, with character proving more robust to adversarial prompting than system prompts or steering; the practical how-to.
- *Optional:* OpenAI — [Introducing the Model Spec](https://openai.com/index/introducing-the-model-spec/) (2024) — the rules-based counterpart: intended behavior specified as a hierarchy of objectives and rules rather than as character; read against Claude's Constitution as the other side of the design fork.
- *Optional:* Oliver Klingefjord — [Model Integrity and Character](https://meaningalignment.substack.com/p/model-integrity-and-character) (2026) — why a coherent character that stays true to its values under pressure beats rule-compliance for trustworthy models; the argument for Anthropic's side of that fork.

### Week 3 — Collecting values

- Oliver Klingefjord, Ryan Lowe & Joe Edelman — [What Are Human Values, and How Do We Align AI to Them?](https://arxiv.org/abs/2404.10636) (2024) — an elicitation method that asks people for the considerations behind their choices rather than for ratings, and reconciles them into a moral graph; a concrete alternative to preference collection, with the background framing for why "values" needs an operational definition.
- Lily Hong Zhang, Smitha Milli et al. — [Cultivating Pluralism in Algorithmic Monoculture: The Community Alignment Dataset](https://arxiv.org/abs/2507.09650) (2025) — a 15,000-person, five-country study showing people vary far more than the 21 LLMs tested, and that standard preference-collection methods structurally miss that diversity; the current state of the art on what large-scale value collection gets wrong.
- *Optional:* Anthropic — [Introducing Anthropic Interviewer](https://www.anthropic.com/research/anthropic-interviewer) (2025) — Claude-led qualitative interviews at scale (1,250 professionals in the pilot); the emerging methodology for eliciting attitudes and values by interview rather than by ratings.
- *Optional:* Tan Zhi-Xuan et al. — [Beyond Preferences in AI Alignment](https://arxiv.org/abs/2408.16984) (2024) — the philosophical case that preference-utility can't carry what we mean by values; the bridge to the philosophy-of-values field.

### Week 4 — What deployed models are actually like

- Saffron Huang et al. — [Values in the Wild](https://arxiv.org/abs/2504.15236) (2025) — empirically taxonomizes 3,307 values Claude expresses across ~308K real conversations; alignment measured at population scale rather than asserted.
- Anthropic — [Who's in Charge? Disempowerment Patterns in Real-World LLM Usage](https://arxiv.org/abs/2601.19062) (2026) — 1.5M real conversations scored for reality, value-judgment, and action distortion; users rate potentially disempowering interactions *more* favorably — the deployed-scale companion to Gradual Disempowerment in the Big Picture section.
- Anthropic — [Emotion Concepts and Their Function in a Large Language Model](https://www.anthropic.com/research/emotion-concepts-function) (2026) — interpretability work finding emotion-concept representations that causally shape behavior (desperation states drive reward hacking and blackmail; positive states favor prosocial choices), without implying subjective experience; read the blog post, with the [full paper](https://transformer-circuits.pub/2026/emotions/index.html) for depth.

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

- Alasdair MacIntyre — *After Virtue* (1981), ch. 1–2 — the famous opening: modern moral debate is interminable because the language of morality survives only as fragments of lost practices, leaving emotivism — moral claims as mere expressions of attitude — as the working theory of our culture.
- Bernard Williams — *Ethics and the Limits of Philosophy* (1985), ch. 8 — thick evaluative concepts: terms like "cruel" or "courageous" that describe and evaluate at once; why they carry more of a community's values than thin terms like "good" or "right."
- *Optional:* Aristotle — *Nicomachean Ethics*, Book II — the tradition whose fragmentation MacIntyre is diagnosing, from the source: virtue as acquired by habituation, excellence as a mean found in practice; also the oldest account of moral learning in the curriculum.

### Week 2 — Values in agency and choice

- Charles Taylor — What is Human Agency? (1977) — strong evaluation: values as the deep, identity-defining evaluations behind our motivations for choice.
- David Velleman — *The Possibility of Practical Reason* (2000), ch. 1 — values as reasons that can be acted on, and why an agent needs them to count as acting at all.
- *Optional:* David Velleman — [*Self to Self*](https://www.fulcrum.org/concern/monographs/rv042w25m) (2006), introduction and "The Centered Self" — integrity as consistency with one's self-image, and the one-shot prisoner's-dilemma argument that an agent who acts consistently with who he takes himself to be is trustworthy in a way a merely strategic agent cannot be; the source behind the model-integrity argument in the AI section (second edition free online).
- *Optional:* Alasdair MacIntyre — *After Virtue* (1981), ch. 14–15 — the constructive turn after the week 1 diagnosis: values as virtues internal to social practices, and why values stripped from their practice lose their grip.

### Week 3 — Normative reasoning with plural values

- Ruth Chang — All Things Considered (2004) — what an all-things-considered judgment actually is: how the particular values at stake in a given circumstance get put together, and why that requires a more comprehensive value rather than a common scale.
- Ruth Chang — [Hard Choices](https://www.cambridge.org/core/journals/journal-of-the-american-philosophical-association/article/hard-choices/B82E4EE91FE0A4A4D38A0F866BC3FF9C) (2017) — when options are "on a par" rather than one being better, choice is an act of commitment that creates reasons rather than tracking them; why an agent can't just maximize a scalar.
- David Velleman — *How We Get Along* (2009), ch. 1 — from reasoning alone to reasoning together: sociality as joint improvisation, where agents acting on self-understandings need shared values and reasons to coordinate at all.
- *Optional:* T.M. Scanlon — *What We Owe to Each Other* (1998), ch. 1–2 — values as what we can justify to others; the contractualist frame for agents whose principals and constraints are what's being reasoned over.

### Week 4 — Moral learning

- Charles Taylor — *Sources of the Self* (1989), the "epistemic gain" section of ch. 3 (§3.3) — practical reason as reasoning in transitions: you can know a new evaluative position is better than your old one without a neutral scale, because the move itself is an error-reducing gain; the epistemology behind judging value upgrades locally.
- Christine Tappolet — *Emotions, Values, and Agency* (2016), ch. 1 — emotions as perceptual experiences of values: why feeling fear, shame, or admiration is a way of registering evaluative facts, and what that gives emotions to do in moral learning — the felt process by which a working set of values gets revised.

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

- Raphael Köster, Dylan Hadfield-Menell, Gillian K. Hadfield, Joel Z. Leibo et al. — [Spurious normativity enhances learning of compliance and enforcement behavior in artificial agents](https://www.pnas.org/doi/10.1073/pnas.2106028118) (PNAS, 2022) — the canonical norm-emergence result: arbitrary "silly" rules plus third-party punishment let multi-agent RL agents bootstrap general compliance-and-enforcement machinery; the demonstration that norms can *emerge* from learning dynamics.
- Eugene Vinitsky, Raphael Köster, Joel Z. Leibo et al. — [A learning agent that acquires social norms from public sanctions in decentralized multi-agent settings](https://arxiv.org/abs/2106.09012) (Collective Intelligence, 2023) — agents learn arbitrary norms purely from *public sanctioning signals* when reward-sharing is impossible; directly relevant to decentralized institutions where who-punishes-whom is the only public channel.
- *Optional skim:* Robert Axelrod — [An Evolutionary Approach to Norms](https://www.jstor.org/stable/1960858) (1986) — the classic agent-based simulation of norm emergence and metanorms (punishing those who fail to punish); the 1980s ancestor of every MARL enforcement experiment.

### Week 3 — Agents joining human normative communities

- Ninell Oldenburg & Tan Zhi-Xuan — [Learning and Sustaining Shared Normative Systems via Bayesian Rule Induction in Markov Games](https://arxiv.org/abs/2402.13399) (AAMAS, 2024) — agents infer institutional rules by Bayesian induction over observed compliance, converge on a shared normative system even from divergent priors, and let newcomers bootstrap norms fast by observation; the clearest model of norms as *learnable, sustainable institutions* rather than fixed rewards.
- Gillian K. Hadfield, Rakshit S. Trivedi & Dylan Hadfield-Menell — [Building AI for the Democratic Matrix](https://knightcolumbia.org/content/building-ai-for-the-democratic-matrix-a-technical-research-agenda-for-normative-competence-and-normative-institutions-1) (Knight First Amendment Institute, 2026) — the current statement of the section's thesis: build agents with *normative competence* — the ability to read and participate in whatever normative system they find themselves in — and embed them in normative institutions, rather than loading them with a fixed value set.
- *Optional:* Atrisha Sarkar, Rakshit S. Trivedi, Gillian K. Hadfield et al. — [Normative Modules](https://arxiv.org/abs/2405.19328) (2024) — the same group's concrete architecture: generative agents that identify an authoritative sanctioning institution and use it for equilibrium selection.

### Week 4 — Aligning agents to norms, not preferences

- Joel Z. Leibo, Alexander Sasha Vezhnevets et al. — [A Theory of Appropriateness with Applications to Generative AI](https://arxiv.org/abs/2412.19010) (2024) — appropriateness as the master concept: behavior is judged against a multi-scale mosaic of context-dependent standards (friends, family, office), and deploying AI responsibly means fitting agents into that mosaic rather than loading them with one value set; read the theory and generative-AI parts, skim the neuroscience.
- Tan Zhi-Xuan, Micah Carroll, Matija Franklin & Hal Ashton — [Beyond Preferences in AI Alignment](https://arxiv.org/abs/2408.16984) (2024) — the field's framing argument: alignment should target the norms and role-appropriate standards negotiated among stakeholders, not a scalar over one principal's preferences; the bridge from norm-modeling to institutional AI.
- *Optional:* Sydney Levine, Tan Zhi-Xuan et al. — [Resource Rational Contractualism Should Guide AI Alignment](https://arxiv.org/abs/2506.17434) (2025) — the contractualist version of the same move: align agents to the agreements rational parties *would* reach, approximated with resource-bounded heuristics.

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

## 5. Institutional & Behavioral Economics

<!-- advisors: TODO -->

Why do markets deliver some goods well and others badly — and what does AI do to that boundary?

This strand of economics runs from transaction-cost and information economics to the behavioral critiques of what choice-and-price models leave out. It matters twice over for AI: agents change the cost of specifying, monitoring, and enforcing transactions — which decides whether a good gets marketized or governed some other way — and they make it tempting to read values straight off behavior, the move this literature spent fifty years showing is unsafe. The two Klingefjord essays apply these ideas to the goods markets handle worst.

*Readings: ~9–12 hours.*

### Week 1 — Why firms and prices exist

- Ronald Coase — The Nature of the Firm (1937) — firms exist because using the market is costly; the lens for asking which transactions AI agents pull inside an organization versus push back out to the market.
- Friedrich Hayek — The Use of Knowledge in Society (1945) — prices as a decentralized system for transmitting dispersed knowledge; the benchmark any AI "central planner" claim has to beat.

### Week 2 — When markets break from the inside

- George Akerlof — The Market for "Lemons" (1970) — how information asymmetry can collapse a market entirely; central to agents that can manufacture or detect asymmetry at scale.
- Oliver Williamson — Transaction Cost Economics: The Governance of Contractual Relations (1979) — when to govern a relationship by contract, hierarchy, or hybrid; a menu of institutional forms for agent relationships.

### Week 3 — When the model of the chooser is wrong

- Amartya Sen — Rational Fools (1977) — why revealed preference can't capture commitment and other-regarding reasons; the case against inferring values straight from behavior.
- Richard Thaler — [From Cashews to Nudges: The Evolution of Behavioral Economics](https://www.aeaweb.org/articles?id=10.1257/aer.108.6.1265) (2018 Nobel lecture) — the most accessible single tour of the behavioral critique of homo economicus; supplies the vocabulary (anomalies, mental accounting, nudges) in one sitting.

### Week 4 — The goods markets handle worst

- Oliver Klingefjord — [Coasean Compression](https://meaningalignment.substack.com/p/coasean-compression) (2026) — MAI framing: when a good is hard to specify and verify (connection, belonging), markets sell a cheaper contractible proxy instead of the real thing; how those frictions decide what markets can actually deliver.
- Oliver Klingefjord — [Baumol's Sawdust](https://meaningalignment.substack.com/p/baumols-sawdust) (2026) — MAI framing: why cheap AI substitutes for relational goods thin the social infrastructure that made the real goods possible, so competition deepens the failure instead of correcting it.

### Key concepts

- Transaction costs
- Information asymmetry and adverse selection
- Contract incompleteness
- Revealed preference and its limits
- Behavioral anomalies
- Baumol's cost disease

---

## 6. Game Theory & Mechanism Design

<!-- advisors: TODO (candidates: Andrew Koh, Jobst Heitzig, Marcus Pivato, Roberto Weber) -->

Can we design the rules of interaction so that self-interested behavior produces good outcomes? Game theory describes what strategic players do; mechanism design works backwards from what we want them to do. Both become unavoidable once the players include AI agents that can commit, search rule spaces, and best-respond at scale.

One caution worth carrying in: mechanism design is powerful exactly where goals, actions, and information can be formalized, and misleading when a simplified objective is mistaken for the institution's real purpose. We picked Schelling and Roth because they keep the field anchored in real institutions rather than formal models.

*Readings: ~8–10 hours.*

### Week 1 — Strategy and coordination

- Thomas Schelling — *The Strategy of Conflict* (1960), ch. 3 — focal points: how coordination can succeed without communication; central to whether agents converge on shared expectations.
- Robert Aumann — Agreeing to Disagree (1976) — why rational players with common priors cannot knowingly hold different beliefs; the baseline for reasoning about what other agents know and believe.

### Week 2 — Cooperation without a designer

- Robert Axelrod — *The Evolution of Cooperation* (1984), ch. 1–4 — when cooperation emerges among self-interested players in repeated interaction; the baseline model for agent-to-agent relationships.

### Week 3 — Designing the rules

- Roger Myerson — Mechanism Design (2008 Nobel lecture) — the formal theory of designing rules so truth-telling and good behavior are incentive-compatible, plus its sharp limits.
- William Vickrey — Counterspeculation, Auctions, and Competitive Sealed Tenders (1961) — the founding auction-design paper: truth-telling as a property you build into the rules rather than hope for from the players.

### Week 4 — Building real institutions, for humans and agents

- Alvin Roth — The Economist as Engineer (2002) — market design as a practical craft (matching, clearinghouses); the closest the field comes to actually building institutions.
- Alvin Roth — [Repugnance as a Constraint on Markets](https://www.aeaweb.org/articles?id=10.1257/jep.21.3.37) (2007) — the designer's-eye companion: efficient mechanisms aren't enough if the transaction is socially refused; a built-in check on naïve marketization.
- Gillian Hadfield & Andrew Koh — [An Economy of AI Agents](https://arxiv.org/abs/2509.01063) (2025) — how autonomous agents reshape markets, firms, and the institutions markets require; the current, accessible AI-meets-mechanism-design piece, written by an economist working on aligning strategic AI systems.

### Key concepts

- Nash equilibrium
- Repeated games
- Focal points
- Commitment problems
- Incentive compatibility
- Revelation principle and its limits
- Matching markets and auction design
- Repugnance as a constraint on markets
- Strategic AI agents as mechanism participants

---

## 7. Legal Theory

<!-- advisors: TODO -->

How are rules made, interpreted, enforced, and contested? Law is our most developed technology for governing behavior through explicit rules. What happens to it when many of the actors are autonomous AI agents?

Law quietly assumes rules are costly to interpret, enforcement capacity is limited, and actors have human-scale attention. AI agents can break each of these — searching rule spaces, exploiting ambiguity, generating disputes, and automating compliance theater cheaply. The readings build from what law *is* (Hart, Fuller) toward what its infrastructure costs and how code substitutes for it (Lessig, Hadfield).

*Readings: ~7–10 hours.*

### Week 1 — What law is

- H.L.A. Hart — *The Concept of Law* (1961), ch. 5–6 — law as a union of primary rules and secondary rules (rules for changing, interpreting, and recognizing rules); explains why a rule system needs machinery for its own revision.
- Oliver Wendell Holmes — The Path of the Law (1897) — law from the standpoint of the "bad man" who cares only about predicted consequences, not the rule's authority; the default stance of an optimizing agent toward any rule system.

### Week 2 — How law can fail procedurally

- Lon Fuller — *The Morality of Law* (1964), ch. 2 — the inner morality of law: eight ways a rule system can fail procedurally even when well-intentioned; a checklist for any automated rule regime.

### Week 3 — What a legal order costs

- Gillian Hadfield & Barry Weingast — [Microfoundations of the Rule of Law](http://pscourses.ucsd.edu/ps200b/Hadfield%20Weingast%20Microfoundations%20of%20rule%20of%20law.pdf) (2014) — what a legal order needs to actually work as decentralized coordination, not just on paper.
- Gillian Hadfield — *Rules for a Flat World* (2017), ch. 1–2 — why legal infrastructure is scarce and expensive, and what a market for legal infrastructure could look like at machine scale.

### Week 4 — Code as the enforcement layer

- Lawrence Lessig — Code is Law (1999) — how technical architecture regulates behavior as powerfully as statute; foundational for AI systems that *are* the enforcement layer.

### Key concepts

- Legal positivism vs. natural law
- Primary vs. secondary rules
- The rule of recognition
- The inner morality of law
- The rule of law
- Common-law reasoning and precedent

