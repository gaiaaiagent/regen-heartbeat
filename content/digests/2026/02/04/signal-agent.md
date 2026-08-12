# Digest — signal-agent

MCP connectivity: KOI=true, LEDGER=true (replay fixtures)

## m010 Reputation Signal (v0 advisory)
as of 2026-02-04T12:00:00Z

Canonical mechanism reference: `mechanisms/m010-reputation-signal/SPEC.md`

What this is: a deterministic replay run that produces non-zero KPIs without MCP.
What this is not: enforcement, gating, or on-chain actions.

### Candidate subjects (from fixtures)
| subject_type | subject_id | reason | evidence_links |
|---|---|---|---|
| CreditClass | C01-001 | registry_quality | [] |
| Project | P-regen-042 | delivery_risk | ["koi://note/project-1","ledger://tx/1001"] |
| Verifier | V-DeltaMRV | attestation_quality | ["koi://note/verifier-2","ledger://tx/1002"] |
| Methodology | METH-SoilCarbon-v3 | method_rigor | ["ledger://tx/1003"] |
| Address | regen1abcd...wxyz | operator_trust | ["koi://note/address-4"] |
| Project | P-regen-077 | delivery_risk | ["koi://note/project-5","ledger://tx/1005"] |

### KPI (JSON)
```json
{
  "mechanism_id": "m010",
  "scope": "v0_advisory_replay",
  "as_of": "2026-02-04T12:00:00Z",
  "signals_emitted": 12,
  "subjects_touched": 6,
  "evidence_coverage_rate": 0.5,
  "median_event_latency_hours": 36,
  "sources_checked": {
    "koi": true,
    "ledger": true,
    "web": false
  },
  "notes": "Replay mode: KPIs computed from deterministic fixtures (no MCP required)."
}
```
