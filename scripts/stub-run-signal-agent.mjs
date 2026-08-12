#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function median(nums) {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a,b) => a-b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const repoRoot = process.cwd();
const koiPath = process.argv[2] ?? path.join(repoRoot, "stubs", "koi.sample.json");
const ledgerPath = process.argv[3] ?? path.join(repoRoot, "stubs", "ledger.sample.json");
const outPath = process.argv[4] ?? path.join(repoRoot, "content", "digests", "2026", "02", "04", "signal-agent-stub.md");

if (!fs.existsSync(koiPath) || !fs.existsSync(ledgerPath)) {
  console.error("Missing stub input(s).");
  console.error(`KOI: ${koiPath}`);
  console.error(`Ledger: ${ledgerPath}`);
  process.exit(1);
}

// Normalize using the local normalizer for a stable shape.
function normalize(p) {
  const res = spawnSync("node", ["scripts/mcp-normalize.mjs", p], { cwd: repoRoot, encoding: "utf8" });
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout);
    process.exit(2);
  }
  return JSON.parse(res.stdout);
}

const koiItems = normalize(koiPath);
const ledgerItems = normalize(ledgerPath);

// Merge
const items = [...koiItems, ...ledgerItems];

// as_of: use max of source as_of if present, else now
const koi = readJson(koiPath);
const led = readJson(ledgerPath);
const asOfStr = koi.as_of || led.as_of || new Date().toISOString();
const asOf = new Date(asOfStr);

const signalsEmitted = items.length;
const subjectsTouched = new Set(
  items.flatMap(i => (Array.isArray(i.subjects) ? i.subjects : []).map(s => `${s.subject_type}:${s.subject_id}`))
).size;

let bothEvidence = 0;
const latencies = [];

for (const it of items) {
  const koiOk = (it.evidence?.koi_links ?? []).length > 0;
  const ledOk = (it.evidence?.ledger_refs ?? []).length > 0;
  if (koiOk && ledOk) bothEvidence += 1;

  const ts = new Date(it.timestamp);
  const hours = (asOf - ts) / (1000 * 60 * 60);
  if (Number.isFinite(hours)) latencies.push(hours);
}

const evidenceCoverageRate = signalsEmitted ? bothEvidence / signalsEmitted : 0.0;
const medianLatencyHours = median(latencies);

const kpi = {
  mechanism_id: "m010",
  scope: "v0_advisory_stub",
  as_of: asOf.toISOString(),
  signals_emitted: signalsEmitted,
  subjects_touched: subjectsTouched,
  evidence_coverage_rate: Number(evidenceCoverageRate.toFixed(4)),
  median_event_latency_hours: medianLatencyHours === null ? null : Number(medianLatencyHours.toFixed(2)),
  sources_checked: { koi: true, ledger: true, web: false },
  notes: "Stub mode: KPIs computed from deterministic stub payloads (simulated MCP outputs)."
};

// Markdown output
const lines = [];
lines.push(`# Digest — signal-agent (stub mode)`);
lines.push(``);
lines.push(`MCP connectivity: KOI=true, LEDGER=true (stub payloads)`);
lines.push(``);
lines.push(`## m010 Reputation Signal (v0 advisory)`);
lines.push(`as of ${kpi.as_of}`);
lines.push(``);
lines.push(`Canonical mechanism reference: \`mechanisms/m010-reputation-signal/SPEC.md\``);
lines.push(``);
lines.push(`What this is: an offline stub run that simulates KOI+Ledger MCP outputs.`);
lines.push(`What this is not: enforcement, gating, or on-chain actions.`);
lines.push(``);
lines.push(`### Normalized evidence items`);
lines.push(`| source | kind | id | timestamp | url |`);
lines.push(`|---|---|---|---|---|`);
if (!items.length) {
  lines.push(`| none | none | none | none | none |`);
} else {
  for (const it of items.slice(0, 10)) {
    lines.push(`| ${it.source} | ${it.kind} | ${it.id} | ${it.timestamp} | ${it.url} |`);
  }
}
lines.push(``);
lines.push(`### KPI (JSON)`);
lines.push("```json");
lines.push(JSON.stringify(kpi, null, 2));
lines.push("```");
lines.push(``);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join("\n"), "utf8");

console.log(`Wrote stub digest: ${outPath}`);
console.log(JSON.stringify(kpi));
