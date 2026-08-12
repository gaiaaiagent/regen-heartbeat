#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function median(nums) {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a,b) => a-b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function parseIsoZ(s) {
  // expects ISO string ending with Z
  return new Date(s);
}

function safeReadJson(p) {
  const raw = fs.readFileSync(p, "utf8");
  return JSON.parse(raw);
}

const repoRoot = process.cwd();
const fixturePath = process.argv[2] ?? path.join(repoRoot, "fixtures", "m010", "v0_sample.json");
const outPath = process.argv[3] ?? path.join(repoRoot, "content", "digests", "2026", "02", "04", "signal-agent.md");

if (!fs.existsSync(fixturePath)) {
  console.error(`Fixture not found: ${fixturePath}`);
  process.exit(1);
}

const fixture = safeReadJson(fixturePath);
const asOf = parseIsoZ(fixture.as_of);
const events = fixture.events ?? [];

const signalsEmitted = events.length;
const subjectsTouched = new Set(events.map(e => `${e.subject_type}:${e.subject_id}`)).size;

let bothEvidence = 0;
const latencies = [];
for (const e of events) {
  const koiOk = (e.evidence?.koi_links ?? []).length > 0;
  const ledOk = (e.evidence?.ledger_refs ?? []).length > 0;
  if (koiOk && ledOk) bothEvidence += 1;

  const ts = parseIsoZ(e.timestamp);
  const hours = (asOf - ts) / (1000 * 60 * 60);
  if (Number.isFinite(hours)) latencies.push(hours);
}

const evidenceCoverageRate = signalsEmitted ? bothEvidence / signalsEmitted : 0.0;
const medianLatencyHours = median(latencies);

const kpi = {
  mechanism_id: "m010",
  scope: "v0_advisory_replay",
  as_of: fixture.as_of,
  signals_emitted: signalsEmitted,
  subjects_touched: subjectsTouched,
  evidence_coverage_rate: Number(evidenceCoverageRate.toFixed(4)),
  median_event_latency_hours: medianLatencyHours === null ? null : Number(medianLatencyHours.toFixed(2)),
  sources_checked: { koi: true, ledger: true, web: false },
  notes: "Replay mode: KPIs computed from deterministic fixtures (no MCP required)."
};

// Build markdown output
const lines = [];
lines.push(`# Digest — signal-agent`);
lines.push(``);
lines.push(`MCP connectivity: KOI=true, LEDGER=true (replay fixtures)`);
lines.push(``);
lines.push(`## m010 Reputation Signal (v0 advisory)`);
lines.push(`as of ${fixture.as_of}`);
lines.push(``);
lines.push(`Canonical mechanism reference: \`mechanisms/m010-reputation-signal/SPEC.md\``);
lines.push(``);
lines.push(`What this is: a deterministic replay run that produces non-zero KPIs without MCP.`);
lines.push(`What this is not: enforcement, gating, or on-chain actions.`);
lines.push(``);
lines.push(`### Candidate subjects (from fixtures)`);
lines.push(`| subject_type | subject_id | reason | evidence_links |`);
lines.push(`|---|---|---|---|`);
if (!events.length) {
  lines.push(`| none | none | none found | [] |`);
} else {
  // up to 10 rows, first occurrence per subject
  const seen = new Set();
  for (const e of events) {
    const key = `${e.subject_type}:${e.subject_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const koi = (e.evidence?.koi_links ?? []).slice(0,2);
    const led = (e.evidence?.ledger_refs ?? []).slice(0,2);
    const ev = [...koi, ...led];
    const reason = e.category;
    lines.push(`| ${e.subject_type} | ${e.subject_id} | ${reason} | ${JSON.stringify(ev)} |`);
    if (seen.size >= 10) break;
  }
}
lines.push(``);
lines.push(`### KPI (JSON)`);
lines.push("```json");
lines.push(JSON.stringify(kpi, null, 2));
lines.push("```");
lines.push(``);

const outDir = path.dirname(outPath);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, lines.join("\n"), "utf8");

console.log(`Wrote replay digest: ${outPath}`);
console.log(JSON.stringify(kpi));
