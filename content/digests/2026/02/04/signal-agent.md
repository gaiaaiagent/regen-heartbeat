---
title: "Daily Heartbeat — 2026-02-04 (signal-agent)"
date: 2026-02-04
template: signal-agent
character: signal-agent
cadence: daily
sources:
  koi: false
  ledger: false
  web: false
  historic: false
---

## m010 Reputation Signal (v0 advisory)
As of **2026-02-04**.

Mechanism spec reference: `.claude/contexts/mechanisms/m010-reputation-signal/SPEC.md`.

What this is: a reputation/legitimacy *signal* computed from evidence inputs and published for downstream reference.
What this is not: enforcement, gating, or transaction execution.

| subject_type | subject_id | reason | evidence_links |
|---|---|---|---|
| none | none | No MCP sources configured for this smoke run | (none) |

```json
{
  "mechanism_id": "m010",
  "scope": "v0_advisory",
  "as_of": "2026-02-04",
  "signals_emitted": 0,
  "subjects_touched": 0,
  "evidence_coverage_rate": 0.0,
  "median_event_latency_hours": null,
  "sources_checked": {"koi": false, "ledger": false, "web": false},
  "notes": "Smoke-run output: MCP sources not configured in this environment; no data was fetched and no signals were emitted."
}
```


