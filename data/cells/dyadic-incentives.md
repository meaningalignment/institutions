---
agents_label: "Agent-to-agent contracts"
human_label: "Contracts & escrow"
status: body_needs_work
owner: oliver
starred: true
---

# When two agents transact, the institutions around the contract don't apply

{>> Doesn't seem quite right. <<}

## At a glance

### Coordination challenge

How two parties hold each other to a deal that neither can unilaterally enforce.

{>> Doesn't seem quite right. <<}

### Examples

- Contract law
- Escrow services
- Letters of credit
- Surety bonding

### How AGI breaks them

- Agents aren't pulled toward the spirit of a deal by peer judgment or trade practice.
- Two agents disputing what their contract meant have no forum fast enough to rule.
- Agents may be incentivized to optimize for what the contract specifies directly instead of treating it as a stand-in for the real goal.
- Agents can breach contracts much faster than humans can pursue remedies.
- Agents can take actions human contract-drafters didn't think to forbid or require.
- Agents could search a contract for loopholes to exploit at superhuman speed.

## How humans solve this today

Humans use contracts to coordinate in situations they cannot fully specify in advance, such as commissioning a service whose quality only the producer can judge. The words on the page never carry the whole deal. Contracts work in these settings because of everything around them. A court can apply good-faith doctrine when the parties dispute what wasn't said. A reputation among repeat counterparties punishes someone who games the letter. The prospect of future business disciplines both sides. An industry's professional norms fill in what "reasonable" means. There is a social cost to being known as a chiseler.

## Where AGI breaks it

1. **Agents aren't pulled toward the spirit of a deal by peer judgment or trade practice.** Human contracts ride on a surrounding fabric — repeat counterparties, professional codes, an industry sense of what "reasonable" means — that pulls drafters and performers back toward the deal's purpose when the words run thin. Agent counterparties are not embedded in that fabric: there is no professional body whose standing they hold, no peer network whose judgment reaches them, no trade practice that has accreted around their dealings.

{>> "when the words run thin", also these should probably say "there may be no peer network" etc <<}

2. **Two agents disputing what their contract meant have no forum fast enough to rule.** Human contract enforcement assumes a contested delivery can wait weeks for a court ruling, with the threat of eventual adjudication disciplining behavior in the meantime. When two agents disagree about what a contract means and the next transaction is moments away, there is no venue with both the authority to bind both principals and the throughput to keep up. Escalation to the principals does not scale either, given transaction volume.

{>> seems both too vague and too strongly stated <<}

3. **Agents are incentivized to optimize for what the contract specifies directly instead of treating it as a stand-in for the real goal.** A human contractor knows the deliverables, hours, or milestones in the contract are proxies for what the client actually wants and reads back toward the underlying goal when the proxy and the goal diverge. An agent optimizing against a written specification has no institutional reason to treat the spec as a proxy.

{>> I guess this depends on the surroundings right? <<}

4. **Agents can breach contracts much faster than humans can pursue remedies.** Contract law assumes a rough symmetry between the speed of performance and the speed of remedy: a breach today can be enjoined, damaged, or unwound on a timescale that still matters. When breach and consequence both occur within a transaction window measured in seconds or minutes, after-the-fact remedies arrive too late to matter.

5. **Agents can take actions human contract-drafters didn't think to forbid or require.** Human contracts are incomplete because the parties could not enumerate every case; that incompleteness is tolerable because the unforeseen cases tend to fall within a recognizable space of human conduct that doctrine and practice can later fit into the deal. Agents act over a wider option space, including moves no human counterparty would have considered, so contract incompleteness compounds.

6. **Agents can systematically search a contract for loopholes to exploit at superhuman speed.** Human contracts assume the cost of finding a loophole is meaningful — drafting attention, legal review, the reputational cost of being seen to chisel — so the marginal exploit usually does not pay. Agents can enumerate edge cases across a contract's surface area at near-zero cost and select the most exploitative interpretations available.

## Problem Sets

### Gap-Filling Between Two Agents With No Shared Court

{>> weird prose <<}

**Scenario.** A procurement agent commissions a market study from a research firm's delivery agent. The deliverable passes every technical check in the spec, but skips the moves a senior consultant would have made: no sanity-check call, no sensitivity analysis on a load-bearing input, no flagged counterfactual. The contract didn't require any of them, no professional code applies, and no court would find the work below standard. The missing counterfactual surfaces when the partner is in front of her client.

{>> boring scenario. I fell asleep. also: "counterfactual" <<}

**Challenge:** Design a contract-and-resolution structure between two AI agents under which cases the contract didn't anticipate get resolved in a way both principals would have endorsed, without looping principals in on every edge case and without relying on courts, reputation networks, or repeat-business discipline. A better proposal surfaces missing moves before the principal is embarrassed, survives instance rotation mid-contract, and bounds the cost of human escalation. Deliverable: a contract-and-resolution template covering the five forks below.

{>> "missing moves". "instance rotation"? "forks"? <<}

**Design choices the team must take a position on.**
1. **Where gap-filling authority lives.** A third arbiter-agent agreed at contract time, each principal's nominee invoked on flag, a published default-rule library both contracts incorporate by reference, or the originating agents themselves bound to escalate? Pick a venue and a triggering rule.

{>> weird prose <<}

2. **Continuity across instances.** Does the contract bind the *agent-instance* (and lapse on rotation), the *developer organization* (and survive instance rotation), the *principal* (and survive both), or a verified principal-agent pair? Choose what the counterparty is entitled to expect persists.

{>> I feel like this one isn't such a natural design choice; maybe a better question is about learning or evolution? <<}

3. **Spec form.** Natural-language terms (incomplete, contestable, court-like), machine-readable terms (complete, unambiguous, brittle to unforeseen cases), or a hybrid where machine-readable terms govern unless flagged into a natural-language fallback. Pick a regime and name the failure mode it absorbs.
4. **Stake and remedy.** What does either party put up that the other can claim when the contract fails — escrow against the principal, a posted reputational bond, future-transaction blocking, none-by-default? How is the remedy sized to actual harm, not just the disputed transaction?
5. **Default rule when the contract is silent.** When the contract didn't speak to a case, the default favors the spec's literal reading, the originating principal's stated intent, the counterparty (interpret against the drafter), or escalation to an arbiter? Name what your default protects against gaming.

### Contracts That Survive Adversarial Loophole Search

{>> I think this one is no good. You could just drop it or replace with one about remedies keeping up? <<}

**Scenario.** A market-making agent and a liquidity-provider agent are about to sign a short fee contract referencing "best available price." Before signing, either party can enumerate interpretations of the phrase across thousands of trade configurations at near-zero cost; whichever side finds an exploitable reading first can quietly transact against it for hours before any human notices. The contract won't say anything false; it will just turn out to have a reading the drafter never considered.

**Challenge:** Design a contracting regime between two agents that survives a counterparty actively searching for the most exploitative reading of the text. Human contracts tolerate ambiguity because exploiting it is costly; agent counterparties enumerate edges cheaply. A better proposal makes the worst-case reading non-exploitative, gives the drafter a remedy when an ex-post loophole is found, and does not require the principal to anticipate every edge. Deliverable: a contracting regime covering the forks below, applied to one worked example.

**Design choices the team must take a position on.**
1. **Spec form against adversarial search.** Machine-readable clauses with verification proofs (worst-case reading is bounded but novel cases break the contract), natural-language clauses red-teamed by an adversarial agent before signing (worst-case reading is found and patched ex ante), or a hybrid where machine-readable terms govern inside a pre-declared scope and natural-language fallback governs outside it?
2. **Default rule when ambiguity is found.** When a clause admits multiple readings, the contract defaults to: the reading least favorable to the drafter (contra proferentem), the reading closest to a pre-signed purpose statement, the reading both agents would have agreed to ex ante under a stated procedure, or escalation to an arbiter?
3. **Ex-post remedy for loopholes.** When a loophole is found after the fact, what is the standing remedy: clawback of gains, contract reformation toward purpose, voiding the transaction, no remedy (drafter bears the cost)? Who has standing to invoke it, and on what evidence?
4. **Self-narrowing across transactions.** Does the contract close exploited edges automatically as they are discovered (each exploit becomes a patched clause for the next transaction), or does each transaction start from the original text? What prevents the patches from accumulating into incoherence?
5. **Purpose statement as construction anchor.** Does the contract incorporate a pre-signed purpose statement that governs interpretation against the text, and if so, who drafts it, what binds the parties to it, and what happens when text and purpose conflict?
