# m010 — Reputation Signal (SPEC)

## 0. Header
- **ID:** m010
- **Name:** Reputation / Legitimacy Signal
- **Status:** draft (advisory-only v0)
- **Owner:** (unset)
- **Last updated:** 2026-02-04
- **Scope:** **v0 advisory** (signal computation + publication only; no enforced on-chain policy changes)

## 1. Problem
Regen ecosystem decisions (registry quality, governance, marketplace curation, and agentic pre-screening) benefit from a shared, queryable signal of **legitimacy/reputation** across key subject types. The m010 design introduces a stake-weighted endorsement signal with time decay, along with challenge/invalidations, so downstream workflows can reference an interpretable score.

## 2. Target actor and action
- **Actors:** signalers (staked REGEN holders), subjects (entities being endorsed), an admin (for invalidation), challengers.
- **Action being evaluated (one action):** a **stake-weighted endorsement** (level 1–5) submitted by a signaler about a subject in a category.
- **Event source:** “submit/withdraw/challenge/invalidate signal” events in the m010 reputation registry workflow (advisory in v0; may be implemented via CosmWasm in v1).

## 3. Signal definition
- **Signal name:** Reputation Score
- **Unit:** score (0–1000)
- **Directionality:** higher = better
- **Granularity:** per `(subject_type, subject_id, category)`
- **Subject types (as specified):** `CreditClass`, `Project`, `Verifier`, `Methodology`, `Address`.
- **Categories:** multiple configurable reputation categories.

## 4. Evidence inputs

| Input | Source | Fields | Validity rules | Anti-spoof assumptions | Refresh cadence |
|---|---|---|---|---|---|
| Endorsement signal | m010 signal store | `subject_type`, `subject_id`, `category`, `endorsement_level (1–5)`, `signaler`, `timestamp` | `endorsement_level` must be within 1–5; subject type must be supported; category must be configured | signer controls their key; uniqueness constraints handled by contract/indexing | on each new signal / state change |
| Stake weight | Regen staking/bank data | `staked_amount` for signaler (and/or category min stake) | must meet `min_stake_by_category` (if configured) | stake is read from chain state (not self-reported) | on signal submission and/or periodic re-evaluation |
| Signal status | m010 workflow state | active / withdrawn / challenged / invalidated | withdrawn signals don’t count; challenged signals pause contribution; invalidated signals are excluded | admin key is trusted for invalidation | on status updates |
| Time decay params | m010 config | `decay_half_life_days` | must be set at instantiate/config update time | config changes are governance/admin-controlled | when config changes |
| Optional rationale links | KOI knowledge layer | rationale IRIs / document links | used for context only; not a scoring input in v0 | KOI sources can be cited but not trusted for stake | on digest generation |

## 5. Scoring function
### 5.1 Time decay
A decay factor is applied based on age of a signal using a configurable half-life:

```
# as specified

# decay_factor is scaled by 1000
decay_factor = 1000 * (1/2)^(age / half_life)
```

Where:
- `age` is elapsed time since signal timestamp (same unit as `half_life`)
- `half_life` corresponds to `decay_half_life_days`.

### 5.2 Contribution weight
Each signal’s contribution is stake-weighted and scaled by endorsement level:

```
# as specified

score = sum(stake * decay * endorsement_level / 5) / total_weight * 1000
```

Notes:
- “total_weight” refers to the normalization denominator (e.g., total stake weight over included signals).
- Signals with status **withdrawn**, **challenged**, or **invalidated** do not contribute.

### 5.3 Normalization
- Final score is normalized to **0–1000**.
- Endorsement levels are 1–5.

### 5.4 Controls
- **Category-specific minimum stake** may be required to submit a signal (`min_stake_by_category`).
- Non-transferable reputation: reputation is derived from signals; it is not a transferable asset.

## 6. Economic linkage
**v0 (advisory):** No direct economic enforcement is specified in the provided inputs. The score is intended to be consumed by other processes (governance analysis, agent pre-screening, arbiter selection, and other mechanisms).

**Intended downstream use (non-binding in v0):** reputation scores may influence voting weight, pre-screening, and selection/curation decisions in related mechanisms (M001-ENH, M008, M009, M011).

## 7. On-chain vs off-chain boundary
- **v0:** compute and publish the signal in off-chain systems (e.g., daily/weekly digests) using verified chain stake data plus a maintained signal store.
- **Optional v1:** a CosmWasm smart contract implementation exists in the provided materials as an implementation summary (“production-ready contract”), including execute/query messages and tests. v1 would formalize the signal store and scoring on-chain, but that is out of scope for v0.

## 8. Attack model
- **Sybil:** mitigated by stake-weighting and minimum stake thresholds per category.
- **Collusion / cartels:** challengers and admin invalidation exist; residual risk remains if large stakeholders coordinate.
- **Bribery:** endorsements can be bought; mitigations are social/process (challenge workflows) and downstream reliance only where appropriate.
- **Data poisoning:** KOI rationale links are context-only; stake and signal store are the authoritative scoring inputs.
- **Reputation capture / censorship:** admin-only invalidation is powerful; governance controls and auditability are required in v1. In v0, publish all invalidation events and rationale in the digest.

## 9. Integration points
- **KOI MCP (knowledge):** resolve rationale IRIs, cross-reference methodology documents, and provide context around subjects and categories.
- **Ledger MCP (chain data):** verify stake amounts, validate subject identifiers (credit classes, projects), and check validator status.
- **Governance:** reputation may be consumed by governance analysis and pre-screening workflows.
- **Other mechanisms:** explicitly called out as consumers: M001-ENH (class creators), M008 (attesters), M009 (service providers), M011 (marketplace curation).

## 10. Acceptance tests
The following tests are derived from the specified behaviors and the listed integration test scenarios.

1) **Full workflow:** multiple signalers submit signals on the same subject/category; reputation query returns a normalized score; withdrawing a signal updates score accordingly.
2) **Insufficient stake:** signal submission below the category minimum stake is rejected.
3) **Invalid endorsement level:** values outside 1–5 are rejected; 1–5 are accepted.
4) **Ownership:** only the original signaler can withdraw their signal.
5) **Challenge state:** challenged signals do not contribute to reputation until resolved.
6) **Admin invalidation:** only admin can invalidate; invalidated signals do not contribute.

Adversarial:
- **Sybil attempt:** many low-stake identities submit endorsements; due to stake-weighting/min stake, aggregate influence remains bounded relative to a single larger stake holder.

## 11. Rollout plan
### v0 checklist (advisory-only)
- Define categories and minimum stakes per category (policy).
- Implement an off-chain signal store that supports submit/withdraw/challenge/invalidate states.
- Compute score using the specified formulas and publish in a periodic digest.
- Verify stake weights via Ledger MCP.
- Record all state transitions and (when present) rationale links.

### Optional v1 outline (non-binding)
- Deploy a CosmWasm contract implementing message handlers for submit/withdraw/challenge/invalidate and query interfaces for signals and aggregated reputation.
- Add governance-controlled admin/parameters, plus audit tooling.

---

## Appendix A — Source anchors
- `files/M010_IMPLEMENTATION_SUMMARY.md`
  - “Core Features” (Reputation signals, aggregated calculation, security features)
  - “Key Algorithms” (time decay; reputation score)
  - “Integration Points” (KOI MCP, Ledger MCP, governance, other mechanisms)
  - “Integration Tests” (workflow, insufficient stake, invalid endorsement, ownership, challenge system, admin powers, edge cases)
- `files/ECOSYSTEM_MAP.md`
  - “Priority build targets” / “The gaps” (context on repo roles and where m010 fits)
