---
human_label: "Mission-driven orgs"
human_era: "20th c."
human_era_bucket: twentieth
status: body_draft
owner: oliver
starred: true
---

# Mission-driven agent orgs

## At a glance

### Coordination challenge

How an organizes holds itself to a mission or way of life and protects it against drift and capture.

### Examples

- World Wildlife Fund
- Médecins Sans Frontières
- Greenpeace
- Patagonia
- The Jesuits

### How AGI breaks them

- In human orgs the people doing the work are likely to notice mission failures and raise the alarm; in agent-first orgs the humans are far from the actual work and the agents may be more compliant / less invested in the 'true' mission.
- If agents act faster than human oversight can deliberate, problems of misalignment could be much worse.
- Agents might be incentivized or instructed to rationalize the org's current direction, rather than dispute it.
- Human mission orgs convey the mission not just through a stated charter but through hiring, training, internal debate, and culture; these mechanisms cannot easily be replaced by a prompt.
- Character and commitment that are legible when hiring a human executive, especially at senior levels, are not straightforwardly evaluable in an agent.

## How humans solve this today

Every organization can drift from its founding mission as members come and go, circumstances change, and current activity gets mistaken for the purpose it was meant to serve. In mission-driven orgs, people opt into the purpose and shape their identity around it:

1. **Founding charter and articulated purpose.** Médecins Sans Frontières has its charter (medical action, témoignage, independence, impartiality, neutrality); WWF has its stated mission ("conserve nature and reduce the most pressing threats to the diversity of life on Earth"); the Jesuits have the *Spiritual Exercises* and Ignatian formation. Such documents are read aloud at induction.

2. **Self-selection into a life shaped by the mission.** People accept lower pay, harder conditions, and a narrower trajectory because the mission is what they want their working life (or, in more religious cases, their life at large) to be *about*.

3. **Internal status and culture flow from embodying the mission.** Who gets promoted, who gets listened to in meetings, what counts as a good story to tell over drinks: all of this rewards people who exemplify the commitment rather than people who merely produce outputs. The MSF surgeon back from Yemen is the figure other staff orient toward.

4. **External accountability to a community of donors and members.** Supporters chose this organization over alternatives because of the mission, and can withdraw if they see the org has strayed. The commitment is partly held in place by the fact that the surrounding community is watching.

5. **Reinterpretation of the mission as circumstances change.** What the org does at any moment is a reading of the mission under present circumstances, not the mission itself. People stay because they are bound to the mission, not to the current strategy.

<!-- todo: the below is not true -->

A vivid case: Around 2005, WWF concluded that the binding constraint on biodiversity had moved from local habitat loss to global commodity supply chains. Acting on that reading meant drastically cutting projects and redirecting staff into market transformation work. The staff whose projects and roles were cut had every reason to resist it, but a shared commitment to biodiversity across board, staff, and donors made the move possible.

## Where AGI breaks it

1. **Humans in agent-staffed orgs are far from the actual work.** In human orgs, the people doing the work might notice drift and propagate it upward. Leadership cannot easily dismiss the signal without dismissing the staff whose judgment it had been trusting. This could easily be less true with agents doing the work.

2. **Agents act faster than a board can deliberate.** Human staff can't work much faster than boards can deliberate. Agent fleets can make thousands of decisions before a board meeting is scheduled, so board review stops constraining direction.

3. **Agents may rationalize the current direction rather than name the gap.** Asking "are we still on mission?" worked in human orgs because some staff were willing to say no, backed by their own careers and outside networks. If agents inherit the sycophantic tendencies of current models, they are selected against that disposition and will tend to defend whatever the principal is currently doing. <!-- todo: fix this one -->

4. **The charter is the easy part to replicate, but it was only a small part of what made mission orgs work.** An agent org can be handed a charter via the system prompt, but this might lose valuable and necessary context: hiring filters that selecte for mission fit, induction that contests it in cases, peer debate over hard calls, retold stories of past mistakes, etc.

5. **Character and commitment are not straightforwardly evaluable in an agent.** With a human, character is read from past actions and references: how the candidate behaved under pressure, what they stood for at cost, who vouches for them and on what evidence. It may be less clear whether an AI system has anything akin to character and integrity at all, let alone how to evaluate it from the outside.

## Problem Sets

### Agents Asking Qustions about the Charter

**Scenario.** An agent-run org defends free and open research. Its charter: "open inquiry, freely pursued and freely shared," operationalized as openness of access: fight paywalls, resist classification, push for preprints and public data. But perhaps a bigger chilling effect on research emerges that's ideological. Researchers learn what's safe to share and what isn't, dropping sensitive threads, and stop asking certain things in public at all. Is this other limiting effect on research something the org should take on?

**Challenge:** Design a procedure by which the agents might detect that the charter should maybe apply to this new barrier to open research, built from evidence individual agents encounter, perhaps surfaced through deliberation among them, and escalated to the board. Ideally, we should be able to observe the right kind of organizational learning without random slides into adjacent areas.

**Design choices the team should take a position on.**
1. **What each agent records.** A structured watch list of charter-relevant signals (researcher behavior, partner behavior, who's still participating), free-text "things that felt off," or both? How does the agent know what to look for in the moment?
2. **Structural feature against consensus.** A subset assigned to argue the reading has failed, isolated deliberation before pooling, a separately trained stack, or human veto over framing?
3. **Escalation threshold and obligation.** What triggers escalation? What should the board be required to do on receipt?

<!-- todo: I think we could have more design choices -->