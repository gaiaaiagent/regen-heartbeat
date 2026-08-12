#!/usr/bin/env bash
set -euo pipefail
HB_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
DATE=${1:-$(date +%Y-%m-%d)}
Y=${DATE:0:4}; M=${DATE:5:2}; D=${DATE:8:2}
OUTDIR="$HB_ROOT/content/digests/$Y/$M/$D"
mkdir -p "$OUTDIR"
OUTFILE="$OUTDIR/signal-agent.md"
cat > "$OUTFILE" <<MD
---
title: "Daily Heartbeat — ${DATE} (signal-agent)"
date: ${DATE}
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
As of **${DATE}**.

Mechanism spec reference: agentic-tokenomics `mechanisms/m010-reputation-signal/SPEC.md`.

What this is: a reputation/legitimacy *signal* computed from evidence inputs and published for downstream reference.
What this is not: enforcement, gating, or transaction execution.

| subject_type | subject_id | reason | evidence_links |
|---|---|---|---|
| none | none | No MCP sources configured for this smoke run | [] |

```json
{
  "mechanism_id": "m010",
  "scope": "v0_advisory",
  "as_of": "${DATE}",
  "signals_emitted": 0,
  "subjects_touched": 0,
  "evidence_coverage_rate": 0.0,
  "median_event_latency_hours": null,
  "sources_checked": {"koi": false, "ledger": false, "web": false},
  "notes": "smoke run: no MCP connectivity"
}
```
MD

echo "Wrote: $OUTFILE"
