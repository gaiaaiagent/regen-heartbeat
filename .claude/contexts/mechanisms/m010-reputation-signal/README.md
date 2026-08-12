# m010 — Reputation Signal (v0 advisory)

m010 defines a reputation / legitimacy signal for Regen ecosystem subjects (e.g., credit classes, projects, verifiers, methodologies, addresses) based on **stake-weighted endorsements** with **time decay**.

## What it outputs
- A normalized **reputation score** (0–1000) per `(subject_type, subject_id, category)`.
- A queryable history of submitted signals (endorsements), including state transitions (active, withdrawn, challenged, invalidated).

## What it does not do (v0)
- No enforcement, gating, fee changes, or automatic voting-weight changes.
- No transactions are initiated by agents; the signal is informational/advisory.

## How to reference
- Canonical spec: `mechanisms/m010-reputation-signal/SPEC.md`
- Other mechanisms may treat m010 as an input signal (e.g., class creator reputation, attester reputation, service-provider reputation, marketplace curation signals).
