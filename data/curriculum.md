# AGI Institutions Curriculum

**Who is it for?**

This curriculum is targeting two groups. The first is researchers already working on these problems who want an 80/20 of the important parts of an adjacent field. The second is people from a technical background interested in AI and society but not yet sure how to contribute, or how much relevant work already exists. If that's you, this should show why these problems are real and that fields well outside your own have a lot to say about them.

**What's in it, and what isn't?**

It is not comprehensive, and the pieces are not always a field's most famous or most representative. We picked work that is accessible and, in our judgment, directly relevant to the institutions powerful AI will reshape. Reading it should give you a sense of why each field matters and enough of its vocabulary to start talking to the people who work in it.

**How is it structured?**

We've selected eight academic fields we think are relevant: AI alignment, philosophy of values, microeconomics, political theory, legal theory, game theory and mechanism design, and social choice. Each field opens with a short overview and includes core readings, foundational works for going deeper, and key concepts to grasp.

**How should I use it?**

The fields are independent; read them in any order. The key concepts are a good way to check whether a field has really landed.

---

## 1. The Big Picture

What are the drivers of societal change? What is the relationship between institutions, culture, and technology?

This is the orienting section: it treats institutions not as abstractions but as things implemented through organizations, customs, and self-governance — not only through markets and states. The throughline is that institutions are built and rebuilt as technology shifts the costs of coordination, and that values themselves can drift as those costs change. We picked work that connects technological change, institutional form, and the slow movement of what people take for granted, so the rest of the curriculum reads as design under those pressures rather than as separate fields.

*Core readings: ~4–6 hours.*

### Core readings

- Joe Edelman — [Nothing to Be Done](https://medium.com/what-to-build/nothing-to-be-done-bfe2ce71a3a2) — argues many problems are structural, not motivational; sets up why redesigning institutions, not exhorting individuals, is the lever.
- Joe Edelman — [Drift](https://drafts.nxhx.org/drift/drift.pdf) — how the things people value erode as systems optimize for proxies; the core failure mode AI accelerates.
- Joe Edelman — [Freedom, Fairness, Fidelity](https://pax-machina.vercel.app/freedom-fairness-fidelity) — three criteria for evaluating institutions, used throughout the rest of this curriculum.
- Elinor Ostrom — [Beyond Markets and States](https://www.nobelprize.org/uploads/2018/06/ostrom_lecture.pdf) (2010 Nobel lecture) — communities govern shared resources without privatizing or nationalizing them; the canonical case that institutional design is a third option beyond "market it" or "regulate it."
- Avner Greif & Joel Mokyr — [Institutions and Economic History: A Critique of Professor McCloskey](https://www.cambridge.org/core/journals/journal-of-institutional-economics/article/institutions-and-economic-history-a-critique-of-professor-mccloskey/84B81FE15DE0BFBFD863F81059C570B6) (2007) — institutions as shared beliefs and expectations, not just formal rules; explains why imposed designs fail when the underlying beliefs don't follow.

### Foundational works

- Douglass North — *Institutions, Institutional Change and Economic Performance* (1990)
- Charles Taylor — *Modern Social Imaginaries* (2004)
- Elinor Ostrom — *Governing the Commons* (1990)
- Herbert Simon — The Architecture of Complexity (1962)
- Deirdre McCloskey — *Beyond Positivism, Behaviorism, and Neoinstitutionalism in Economics* (2022)

### Key concepts

- Institutions as rules vs. institutions as beliefs
- Social imaginaries
- Self-governance and the commons
- Polycentric order
- Institutional drift
- Path dependence
- Culture and economic change
- Bounded rationality

---

## 2. AI Alignment

AI will be deeply embedded in our future institutions, so it matters how these systems are trained to follow instructions, represent values, and remain correctable.

Alignment is the youngest field here, grown out of machine learning and AI safety, concerned with how to make a model do what its principals actually want. The familiar version of the question is about a single model following instructions; the version that matters for institutions is how systems behave as participants in social orders — as negotiators, advisors, administrators, or intermediaries — which connects it to delegation, oversight, and certification. The readings cover the core training methods (RLHF, constitutional and character-based training) and the failure modes, like reward hacking and misgeneralization, that any institution leaning on these systems inherits.

*Core readings: ~6–9 hours.*

### Core readings

- Paul Christiano et al. — [Deep Reinforcement Learning from Human Feedback](https://arxiv.org/abs/1706.03741) (2017) — the technique that lets human judgment shape model behavior; the substrate most value-loading in deployed systems runs on.
- Yuntao Bai et al. — [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) (2022) — training behavior against an explicit written set of principles rather than case-by-case labels; a concrete instance of encoding values as a governing document.
- Iason Gabriel — [Artificial Intelligence, Values, and Alignment](https://arxiv.org/abs/2001.09768) (2020) — maps "align to what?" (instructions, intentions, preferences, values) and why the target choice is itself a normative, institutional question.
- Anthropic — [Claude's Constitution](https://www.anthropic.com/news/claudes-constitution) (2025) — read as a worked example of constitutional and character-based training, i.e. what it looks like to specify an agent's standing dispositions, not as a canonical text.
- Edelman et al. — [Full-Stack Alignment](https://arxiv.org/abs/2512.03399) (2025) — argues alignment must run through the institutions around the model, not only the model, and connects training-time choices to societal-scale ones.

### Foundational works

- Paul Christiano — What Failure Looks Like (2019)
- Andrew Critch & David Krueger — AI Research Considerations for Human Existential Safety (2020)
- Evan Hubinger et al. — Risks from Learned Optimization in Advanced Machine Learning Systems (2019)

### Key concepts

- RLHF
- Constitutional AI
- Character training
- Deliberative alignment
- Scalable oversight (as institutional oversight)
- Outer vs. inner alignment
- Reward hacking and Goodhart's law
- Specification gaming
- Delegation and principal-agent dynamics
- Multi-agent systems
- Model evaluations as certification
- Red teaming

---

## 3. Philosophy of Values

"Values" colloquially means what is important to us. But what are values, exactly? How have institutions encoded and understood them before, and do AI give us new affordances for modeling what matters?

Within philosophy this sits in ethics and metaethics — the questions of what is good, what we owe each other, and what kind of thing a value even is. For AI, the live question is how a value gets *represented*: as a preference to satisfy, a reason to act on, a virtue internal to a practice, or a claim we can justify to others. Those are different answers from different corners of the field, and which one an institution adopts shapes what it can encode. Language models are able to encode values in thick ways, allowing us to move away from thinking of human wanting in terms of mere preferences.

*Core readings: ~8–12 hours.*

### Core readings

- Tan Zhi-Xuan et al. — [Beyond Preferences in AI Alignment](https://arxiv.org/abs/2408.16984) (2024) — argues preference-utility is too thin to carry what we mean by values; bridge between AI alignment and the philosophy of values.
- Alasdair MacIntyre — *After Virtue* (1981), ch. 14–15 — values as virtues internal to social practices; explains why values stripped from their practice lose their grip.
- Charles Taylor — What is Human Agency? (1977) — strong evaluation: some values are not just stronger preferences but frameworks that rank preferences themselves.
- David Velleman — *The Possibility of Practical Reason* (2000), ch. 1 — values as reasons that can be acted on, not just states to be satisfied.
- T.M. Scanlon — *What We Owe to Each Other* (1998), ch. 1–2 — values as what we can justify to others; the contractualist frame for agents whose principals and constraints are what's being reasoned over.

### Foundational works

- Aristotle — *Nicomachean Ethics*
- Philippa Foot — *Natural Goodness* (2001)
- Charles Taylor — *Sources of the Self* (1989)
- Bernard Williams — *Ethics and the Limits of Philosophy* (1985)

### Key concepts

- Values as preferences vs. as reasons
- Values as virtues and character
- Values as social practices
- Values as public justification
- Strong evaluation
- Contractualism
- Thick vs. thin evaluative concepts
- Value pluralism
- Value incommensurability
- Moral realism
- Reflective equilibrium

---

## 4. Microeconomics

Why do markets deliver some goods well and others badly — and what does AI do to that boundary?

Microeconomics is the study of choice under constraint, but the parts that bear on institutions are its less textbook branches: contract theory, information economics, and the welfare and capability critiques that ask what markets fail to capture. The frictions these branches study — transaction costs, information asymmetry, what a contract can and can't specify — are exactly what set the limit on which goods a market can deliver, and they are precisely the frictions AI agents change. The readings take one canonical piece per branch; the two Klingefjord essays are MAI framing pieces that apply these ideas to the goods markets handle worst, not neutral core economics.

*Core readings: ~8–11 hours.*

### Core readings

- Ronald Coase — The Nature of the Firm (1937) — firms exist because using the market is costly; the lens for asking which transactions AI agents pull inside an organization versus push back out to the market.
- Friedrich Hayek — The Use of Knowledge in Society (1945) — prices as a decentralized system for transmitting dispersed knowledge; the benchmark any AI "central planner" claim has to beat.
- George Akerlof — The Market for "Lemons" (1970) — how information asymmetry can collapse a market entirely; central to agents that can manufacture or detect asymmetry at scale.
- Oliver Williamson — Transaction Cost Economics: The Governance of Contractual Relations (1979) — when to govern a relationship by contract, hierarchy, or hybrid; a menu of institutional forms for agent relationships.
- Amartya Sen — Rational Fools (1977) — why revealed preference can't capture commitment and other-regarding reasons; the case against inferring values straight from behavior.
- Oliver Klingefjord — [Coasean Compression](https://meaningalignment.substack.com/p/coasean-compression) (2026) — MAI framing: when a good is hard to specify and verify (connection, belonging), markets sell a cheaper contractible proxy instead of the real thing; how those frictions decide what markets can actually deliver.
- Oliver Klingefjord — [Baumol's Sawdust](https://meaningalignment.substack.com/p/baumols-sawdust) (2026) — MAI framing: why cheap AI substitutes for relational goods thin the social infrastructure that made the real goods possible, so competition deepens the failure instead of correcting it.

### Foundational works

- Oliver Hart & Bengt Holmström — The Theory of Contracts (1987)
- Adam Smith — *The Wealth of Nations* (1776), Books I–II
- Amartya Sen — *Development as Freedom* (1999)
- Joel Mokyr — *A Culture of Growth* (2016)
- Samuel Bowles — *Microeconomics: Behavior, Institutions, and Evolution* (2004)

### Key concepts

- Transaction costs
- Information asymmetry
- Moral hazard
- Adverse selection
- Externalities
- Principal-agent problems
- Contract incompleteness
- Revealed preference and its limits
- Capabilities approach
- Market design
- Baumol's cost disease
- Supply and demand
- Marginal utility

---

## 5. Political Theory

How is power constituted, constrained, and held accountable? What makes authority legitimate, and what recourse do people have when it fails?

Political theory asks how power is constituted, justified, and checked — running from theories of justice through democratic theory, constitutionalism, and the study of representation. The strand most relevant to AI is the problem of *power under delegation*: citizens delegate to representatives, agencies to systems, users to assistants, and courts increasingly defer to technical expertise. AI lengthens and automates every link in that chain, which is why legitimacy, representation, and accountability matter here more than justice in the abstract. The readings pair the classics on fairness and constitutional structure with work on exit and voice, self-governance, and non-domination.

*Core readings: ~8–12 hours.*

### Core readings

- John Rawls — *A Theory of Justice* (1971), ch. 1–3 — the original position and veil of ignorance; a procedure for choosing institutions without knowing your place in them, directly usable as a design test.
- Alexander Hamilton & James Madison — Federalist Papers No. 10 and No. 51 — how to constrain faction and ambition by structure rather than virtue; the founding case for designing against bad actors, including automated ones.
- Albert Hirschman — *Exit, Voice, and Loyalty* (1970), ch. 1–4 — the two basic levers people have over failing institutions; AI changes the cost of both, especially exit.
- Philip Pettit — Republicanism and freedom as non-domination (selections) — freedom as not being subject to arbitrary power, even benevolent power; the right lens for users standing under powerful AI intermediaries.
- Jürgen Habermas — *Between Facts and Norms* (1992), ch. 7–8 — legitimacy as the outcome of inclusive deliberation; demanding, but the deepest account of why procedure confers authority.

### Foundational works

- Aristotle — *Politics*
- Robert Dahl — *Democracy and Its Critics* (1989)
- Bernard Manin — *The Principles of Representative Government* (1997)
- John Dryzek — *Deliberative Democracy and Beyond* (2000)

### Key concepts

- Social contract
- Veil of ignorance
- Separation of powers
- Legitimacy
- Accountability
- Delegation and representation
- Republican non-domination
- Technocracy and expert authority
- Exit, voice, loyalty
- Polycentricity
- Subsidiarity
- Discourse ethics and communicative rationality

---

## 6. Legal Theory

How are rules made, interpreted, enforced, and contested? Law is our most developed technology for governing behavior through explicit rules. What happens to it when many of the actors are autonomous AI agents?

Law quietly assumes a set of conditions: rules are costly to interpret, enforcement capacity is limited, ambiguity creates friction, actors have human-scale attention, and process is slow enough to let expectations stabilize. AI agents can break each of these — searching rule spaces, exploiting ambiguity, generating disputes, and automating compliance theater cheaply. The readings build from what law *is* (Hart, Fuller) toward what its infrastructure costs and how code substitutes for it (Lessig, Hadfield); we added agency and fiduciary concepts because if agents act on behalf of humans, those doctrines move to the center.

*Core readings: ~6–9 hours.*

### Core readings

- Gillian Hadfield & Barry Weingast — [Microfoundations of the Rule of Law](http://pscourses.ucsd.edu/ps200b/Hadfield%20Weingast%20Microfoundations%20of%20rule%20of%20law.pdf) (2014) — what a legal order needs to actually work as decentralized coordination, not just on paper.
- H.L.A. Hart — *The Concept of Law* (1961), ch. 5–6 — law as a union of primary rules and secondary rules (rules for changing, interpreting, and recognizing rules); explains why a rule system needs machinery for its own revision.
- Lon Fuller — *The Morality of Law* (1964), ch. 2 — the inner morality of law: eight ways a rule system can fail procedurally even when well-intentioned; a checklist for any automated rule regime.
- Lawrence Lessig — Code is Law (1999) — how technical architecture regulates behavior as powerfully as statute; foundational for AI systems that *are* the enforcement layer.
- Gillian Hadfield — *Rules for a Flat World* (2017), ch. 1–2 — why legal infrastructure is scarce and expensive, and what a market for legal infrastructure could look like at machine scale.

### Foundational works

- Oliver Wendell Holmes — The Path of the Law (1897)
- Cass Sunstein & Adrian Vermeule — Interpretation and Institutions (2003)
- Scott Shapiro — *Legality* (2011)

### Key concepts

- Legal positivism vs. natural law
- The rule of recognition and legal validity
- Primary vs. secondary rules
- The inner morality of law (Fuller's procedural desiderata)
- The rule of law
- Common-law reasoning and precedent
- Adjudication, judicial discretion, and hard cases
- Legal interpretation (textualism, purposivism, originalism)
- Delegation and interpretive authority
- Agency law and fiduciary duty
- Due process
- Legal personhood

---

## 7. Game Theory & Mechanism Design

What happens when strategic agents interact, and can we design the rules of interaction so that self-interested behavior produces good outcomes? Game theory describes what people do; mechanism design works backwards from what we want them to do. Both become unavoidable once the strategic agents include AI.

Game theory grew out of economics and mathematics to model strategic interaction; mechanism design is its inverse, working backwards from a desired outcome to the rules that would produce it. The two connect to AI directly: once strategic actors include agents, the question of how to set rules so self-interest produces good outcomes stops being abstract. One caution worth carrying in: mechanism design is powerful exactly where goals, actions, and information can be formalized, and misleading when a simplified objective is mistaken for the institution's real purpose — so it reads best alongside Ostrom, Sen, and legal theory. We picked Schelling and Roth because they keep the field anchored in real institutions rather than formal models.

*Core readings: ~6–8 hours.*

### Core readings

- Thomas Schelling — *The Strategy of Conflict* (1960), ch. 3 — focal points: how coordination can succeed without communication; central to whether agents converge on shared expectations.
- Robert Axelrod — *The Evolution of Cooperation* (1984), ch. 1–4 — when cooperation emerges among self-interested players in repeated interaction; the baseline model for agent-to-agent relationships.
- Roger Myerson — Mechanism Design (2008 Nobel lecture) — the formal theory of designing rules so truth-telling and good behavior are incentive-compatible, plus its sharp limits.
- Alvin Roth — The Economist as Engineer (2002) — market design as a practical craft (matching, clearinghouses); the closest the field comes to actually building institutions.

### Foundational works

- John von Neumann & Oskar Morgenstern — *Theory of Games and Economic Behavior* (1944), ch. 1–3
- Robert Aumann — Agreeing to Disagree (1976)
- William Vickrey — Counterspeculation, Auctions, and Competitive Sealed Tenders (1961)

### Key concepts

- Nash equilibrium
- Repeated games and the folk theorem
- Focal points
- Signaling
- Incentive compatibility
- Revelation principle and its limits
- VCG mechanisms
- Matching markets and auction design
- Principal-agent problems
- Collusion and coalition-proofness
- Commitment problems
- Robust and detail-free mechanism design

---

## 8. Social Choice

Can we even define "what the group wants" coherently? Social choice studies how individual preferences can — or can't — be aggregated into collective decisions, and which design choices about voting, deliberation, and elicitation the impossibility results force on us.

Social choice theory sits at the intersection of economics, political science, and mathematics, asking whether individual preferences can be aggregated into a coherent collective choice at all — and a series of impossibility results says not without trade-offs. This bears on AI because cheaper elicitation, simulation, and deliberation make it tempting to think a system can simply read off the will of the people; the classical results say cheap aggregation is still aggregation, with all its paradoxes intact. The readings pair the foundational impossibility theorems with newer mechanisms like quadratic funding and generative social choice, where AI-mediated collective decisions are now being built.

*Core readings: ~5–7 hours.*

### Core readings

- Kenneth Arrow — *Social Choice and Individual Values* (1951), ch. 1–3 — the impossibility theorem: no aggregation rule can satisfy a few mild fairness conditions at once; the result every "AI finds the consensus" claim must reckon with.
- Amartya Sen — The Impossibility of a Paretian Liberal (1970) — even minimal rights conflict with unanimity; shows aggregation can't quietly respect individual spheres.
- Vitalik Buterin, Zoë Hitzig & Glen Weyl — A Flexible Design for Funding Public Goods (2019) — quadratic funding as a mechanism for surfacing intensity of preference; a concrete post-voting aggregation primitive.
- Tan Zhi-Xuan et al. — [Beyond Preferences in AI Alignment](https://arxiv.org/abs/2408.16984) (2024) — why aggregating preferences is the wrong target when what we want is closer to reasons and norms; connects social choice back to value representation.

### Foundational works

- Felix Brandt, Vincent Conitzer, Ulle Endriss, Jérôme Lang & Ariel Procaccia — *Handbook of Computational Social Choice* (2016), ch. 1–2
- Amartya Sen — *Collective Choice and Social Welfare* (1970; expanded ed. 2017)

### Key concepts

- Arrow's impossibility theorem
- Gibbard–Satterthwaite theorem
- Strategy-proofness
- Condorcet cycles
- Aggregation vs. deliberation
- Judgment aggregation
- Preference elicitation
- Quadratic voting and funding
- Generative social choice
- Deliberative polling
- Sortition and citizens' assemblies
- Liquid democracy
- Computational social choice

---

