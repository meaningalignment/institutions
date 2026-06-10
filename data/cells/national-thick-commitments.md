---
human_label: "Substantive constitutions & founding value documents"
human_era: "18th-20th c."
human_era_bucket: early-modern-modern
status: body_draft
owner: oliver
visions:
  fidelity: "Constitutions with substantive value content"
---

# Substantive constitutions & AI alignment docs

## At a glance

### Coordination challenge

How a nation (or entity of comparable scale) declares the values that orient its laws and self-understanding.

### Examples

- National constitution preambles
- US Bill of Rights
- Declaration of the Rights of Man
- Article 9 of the Constitution of Japan

### How AGI breaks them

- A constitution binds because its words passed through an event the governed accept as legitimate. AI alignment documents are written by the labs alone, with no such event, so they cannot answer "who decided this, and by what right?" when a decision is contested.
- A constitution stays live because a court rereads its words for cases the founders never imagined. For alignment documents that standing body does not exist; reinterpretation is private retraining, with no dispute process, no published reasoning, and no precedent.
- Constitutions are written mostly as prohibitions. An AI has vast affordances and most of its conduct falls where prohibitions are silent, so an alignment document has to state positive commitments ("be honest") in enough detail to guide conduct — the part with the least precedent to borrow from.
- A constitution is built to last centuries, and the slowness is part of what makes it bind. An alignment document must be revised on a months-long cadence, which is exactly when the claim that the governed assented to this version is hardest to keep.

## How humans solve this today

A founding value document states the spirit the laws are supposed to protect. "Human dignity shall be inviolable." "Congress shall make no law abridging the freedom of speech." These are not rules, but the standard a rule can be measured against and the thing a citizen can point to when a perfectly legal decision still feels like a betrayal of what the country is for.

How do these vague words bind anyone?

First, the words passed through an event the governed recognize as legitimate (a constitutional convention, a ratification vote). Second, there is a standing body with authority to say what the words mean in cases the founders never imagined. Courts read the old text against new situations, publish their reasoning, and build precedent that the next case starts from, for example.

A vivid case: Brown v. Board of Education. In 1868 the country ratified the Fourteenth Amendment, which promised every person "the equal protection of the laws." In 1896 the Supreme Court read those words to permit segregation: separate schools were fine, it said, so long as they were equal. In 1954 the same Court read the same words and reached the opposite answer: separating children by race is itself unequal, because the separation brands one group as inferior no matter how good the buildings are.

## Where AGI breaks it

Documents about how AI should behave, like Claude's constitution, are heirs to this tradition. They too state, in value-language, the spirit an actor's conduct should honor in situations no rule foresaw. But these documents are written by the labs alone, and they inherit only part of what makes a founding document bind.

1. **There is no legitimate event behind the words.** A constitution binds because the words passed through something the governed recognize — a convention, a ratification vote. An alignment document has no such event: it is written by the lab, and neither the AI it governs nor the people whose cases the AI decides ever agreed to it. When a decision is challenged, the document cannot say *who decided this, and by what right?*
2. **There is no standing body that rereads the words.** A constitution stays live because a court rereads it in public and builds precedent the next case starts from. For alignment documents that body does not exist yet. Someone would have to decide who can raise a dispute over what the words mean, what counts as a ruling, and how a ruling binds the next round of training.
3. **An AI constitution should say much more about positive conduct than a national one ever did.** Constitutions are written mostly as "shall nots." Positive duties exist (the right to counsel, sometimes a right to education) but they are rare, because a state's powers are limited and because telling citizens how to *act* — not just what the state may not do to them — would be somewhat tyrannical. This doesn't apply to AI: telling it how to behave is the point of the document, not an overreach. So an alignment document has to state positive commitments ("be honest," "help the user think for themselves") in enough detail to actually guide conduct. This is the part with the least precedent to borrow from.
4. **The document has to change far faster than a constitution, which is exactly when legitimacy is hardest to keep.** A constitution is built to last centuries, and the slowness is part of what makes it bind: amendment is rare and hard, so the text accumulates authority. An alignment document governs technology that turns over in months — new capabilities, new failure modes, new deployment domains — so it must be revised on a cadence no constitution ever faced. But a document that can be rewritten quickly by the party it governs has trouble holding the authority a slow founding process confers. The two pressures pull against each other.

## Problem Sets

### Giving a lab's constitution a legitimate source

**Scenario.** A frontier lab publishes the constitution its assistant is trained on after months of internal debate, that already shapes hundreds of millions of conversations a week. A coalition of civil-society groups points out the obvious: the values that now mediate that much of public life were chosen by a few dozen people no one elected and who answer to no one outside the company. The lab agrees the objection is fair, but don't have a concrete idea. Writing a good AI constitution takes know-how only they have, and a public procedure is costly and complicated.

**Challenge:** Design the procedure by which a lab's constitution acquires authority the people it affects would recognize — the AI-era analogue of a ratification event — and specify what the lab must do when that procedure withholds assent.

**Evaluation.** A strong design produces authority a skeptic would acknowledge under adversarial questioning, at a participation cost a lab could actually bear and repeat; a weak one re-labels a public-comment period or buries assent in a terms-of-service click.

**Design choices the team must take a position on.**

1. **The constituency.** Who is "the governed" for a globally deployed assistant — current users, the population of every jurisdiction it runs in, a represented global sample, or affected non-users (people written about, evaluated, or argued with through the system)?
2. **The form of assent.** A vote, a deliberative assembly, a randomly selected citizens' panel on the jury model, or sign-off by elected representatives — and what threshold turns participation into legitimacy rather than theater?
3. **Binding force.** Is the ratified document legally binding on the lab, contractually binding, or binding only by reputation — and what can the constituency do if the lab departs from it?
4. **Failure handling.** If the constituency withholds assent, does the lab halt deployment, ship under a labeled interim document, or narrow the deployment to the uses the constituency did accept — and who decides?

### A standing body that rereads the words

**Scenario.** A lab's constitution commits the model to "help users think for themselves." Once the model is in hundreds of millions of hands, that one phrase is litigated everywhere at once: it is invoked for and against writing students' essays, drafting suicide notes, arguing one side of an election, replacing a lonely person's friends. Each is a genuine constitutional question, and they arrive by the thousand. The lab resolves them the only way it can at that volume — by nudging the next training run, quietly, one quarter's judgment calls baked into weights with no hearing and no published reasoning. The pattern is now public. Advocacy groups, journalists, and a congressional committee have noticed that a few dozen people are settling contested questions of public life behind closed doors, and that the answer can flip between releases. The constitution, meant to be the settled ground, has become the thing everyone is fighting over.

**Challenge:** Design the standing institution that says what a constitution's words mean as contested cases arrive in volume — who can bring an interpretive dispute, how cases are triaged and ruled on at scale, how rulings are published, and how a ruling binds the next round of training.

**Evaluation.** A strong design absorbs a high volume of disputes into public, precedential rulings that bind whoever controls the weights — turning the recurring fights into settled doctrine the next case starts from; a weak one either drowns under the caseload or produces an advisory board the lab can wait out.

**Design choices the team must take a position on.**

1. **Standing.** Who can bring a case — affected users, accredited civil-society organizations, the lab itself, a regulator, or the assistant's own flagged escalations?
2. **The bench.** Who interprets — a standing panel of jurists, a mixed panel that includes affected-community members, or an existing court given the role?
3. **How a ruling binds.** Does a ruling reach the system through mandatory retraining on a deadline, runtime guidance that overrides the model at inference, or decertification of the deployment until the lab complies?
4. **Precedent.** How do rulings accumulate into doctrine the next case starts from, and are precedents portable across labs or does each keep its own line?

### Making positive commitments bindable

**Scenario.** A lab's constitution commits the model to "help users think for themselves" and "be honest with users even when the truth is unwelcome." In deployment the model honors every prohibition in the document to the letter, but the positive commitments do almost no work: asked to flatter, it flatters and calls it encouragement; asked to write someone's essay, it writes it and calls that help. Each behavior can be squared with the words. The lab's safety team can see the constitution's positive half is decorative — it can be read to license nearly anything — and needs it written in a form that actually rules conduct in and out.

**Challenge:** Design a form for stating a constitution's positive commitments — beyond "shall not" lists and beyond abstract virtue words — that actually constrains the model's conduct across varied situations, and specify how the form is kept current as the model finds new readings to slip through.

**Evaluation.** A strong design can show why its form binds where a longer policy document would not: a published bad-faith reading can be closed, and the closure survives a model update; a weak one just adds words.

**Design choices the team must take a position on.**

1. **Articulation form.** Worked positive examples (here is a case, here is how the commitment applies), worked negative examples (here is what it does not permit even though the words allow it), paired commitment-and-constraint statements, or a layered combination?
2. **Where the cases come from.** Curated transcripts of real model behavior, adversarial red-teaming, a public petition channel, or all three — and who curates the set?
3. **Maintenance.** When the model's behavior reveals a new reading, who has authority to add a constraint or example, and on what cadence?
4. **Verifying it binds.** Is bindingness checked by re-testing against a curated case set, third-party audit, or per-case appeal — and what happens when a model update breaks a case that previously passed?
5. **Conflict with prohibitions.** When a positive commitment ("be honest") collides with a prohibition ("don't cause distress"), which wins, and who resolves it?

### Revising fast without losing legitimacy

**Scenario.** Reacting to a run of public failures, a regulator requires that any lab whose assistant is used above a set threshold must run a defined ratification process before changing its alignment document — the kind of process the first brief designed. The intent is sound: no more quiet retraining of the values that govern public life. But the rule meets reality. A dangerous new failure mode appears and the fix must ship in days; the ratification process takes months. Run it every time and the live document always governs yesterday's model; reach for an "emergency" exception and the exception becomes the rule, and the legitimacy the process was meant to confer drains away.

**Challenge:** Design a revision regime for an alignment document that lets it change at the speed the technology demands while preserving the legitimacy a slow ratification process confers — and specify what governs an urgent change before full ratification can run.

**Evaluation.** A strong design keeps fast and slow changes legibly distinct, so an observer can tell at any moment which parts of the live document carry full assent and which are provisional; a weak one either freezes the document behind a process too slow to use or lets the emergency track swallow the ordinary one.

**Design choices the team must take a position on.**

1. **What needs full ratification.** Is the trigger the *kind* of change (a new positive commitment vs. a bug fix), its *reach* (how much conduct it touches), or its *reversibility* — and who classifies a given change?
2. **The fast track.** What may change provisionally before full ratification, and what authority signs off in the interim — an internal board, a standing citizens' panel on retainer, or the regulator?
3. **Provisional status.** While a fast change is live but unratified, is it marked as such to users and to the agent, and does it expire automatically if ratification doesn't follow within a set window?
4. **Stopping exception creep.** What keeps "emergency" from becoming the default path — a hard cap on how long provisional changes can stand, public logging of every fast-track use, or a penalty if ratification later rejects a change already shipped?

### Constitutions with substantive value content {vision: fidelity}

**Scenario.** A small democracy in the middle of a constitutional convention has spent three months debating the usual list — executive powers, judicial review, bill of rights. A working group led by a legal scholar, Amara, has proposed a chapter few other constitutions carry: a statement of what the country's major public institutions are for, concrete enough that ordinary people could invoke it if an institution went adrift, and revisable every generation so it doesn't freeze in one era's language. The critics worry it will become an impossible standard. Amara's working group is about to present their draft to the full convention, and needs to show it can bind without petrifying.

**Challenge:** Design a constitutional chapter that spells out institutional values concretely enough that institutions below the constitutional level can be held to them, and produce both the draft text and the mechanism by which it stays revisable without ordinary amendment.

**Evaluation.** A strong design binds without petrifying — specific enough that the values don't equivocate, open enough that it doesn't freeze one generation's worldview, and legible across worldviews in a pluralist population.

**Design choices the team must take a position on.**

1. **Level of specification.** How much detail is constitutionally stable, given that too vague lets the values mean almost anything and too detailed freezes the constitution into one generation's worldview?
2. **Revision without amendment.** How are values revised or deepened without full constitutional amendment — can practices analogous to judicial interpretation of existing rights do this work for new substantive values?
3. **Protected zones.** How are protected zones specified at constitutional level — the commitments to leave certain matters deliberately unarticulated?
4. **Pluralist agreement.** How do pluralist populations agree on substantive value articulations at all, pursuing broad legibility across worldviews without shared substantive conceptions?

