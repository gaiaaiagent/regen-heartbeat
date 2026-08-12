# Digest — signal-agent (stub mode)

MCP connectivity: KOI=true, LEDGER=true (stub payloads)

## m010 Reputation Signal (v0 advisory)
as of 2026-02-04T12:00:00.000Z

Canonical mechanism reference: `mechanisms/m010-reputation-signal/SPEC.md`

What this is: an offline stub run that simulates KOI+Ledger MCP outputs.
What this is not: enforcement, gating, or on-chain actions.

### Normalized evidence items
| source | kind | id | timestamp | url |
|---|---|---|---|---|
| koi | search_results | forum-553 | 2026-02-03T18:00:00.000Z | https://forum.regen.network/t/announcing-regen-ai/553 |
| koi | search_results | forum-587 | 2026-02-03T20:00:00.000Z | https://forum.regen.network/t/automated-regen-digest-platform/587 |
| ledger | snapshot | gov-prop-101 | 2026-02-02T10:00:00.000Z | ledger://gov/proposals/101 |
| ledger | snapshot | market-activity-777 | 2026-02-03T06:00:00.000Z | ledger://market/activity/777 |

### KPI (JSON)
```json
{
  "mechanism_id": "m010",
  "scope": "v0_advisory_stub",
  "as_of": "2026-02-04T12:00:00.000Z",
  "signals_emitted": 4,
  "subjects_touched": 4,
  "evidence_coverage_rate": 0,
  "median_event_latency_hours": 24,
  "sources_checked": {
    "koi": true,
    "ledger": true,
    "web": false
  },
  "notes": "Stub mode: KPIs computed from deterministic stub payloads (simulated MCP outputs)."
}
```
