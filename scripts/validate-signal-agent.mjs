#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const target = process.env.SIGNAL_AGENT_DIGEST
  ?? path.join(repoRoot, "content", "digests", "2026", "02", "04", "signal-agent.md");

if (!fs.existsSync(target)) {
  console.error(`Missing digest file: ${target}`);
  process.exit(2);
}

const md = fs.readFileSync(target, "utf8");

function requireIncludes(s, needle) {
  if (!s.includes(needle)) {
    console.error(`Missing required marker: ${needle}`);
    process.exit(3);
  }
}

requireIncludes(md, "## m010 Reputation Signal (v0 advisory)");
requireIncludes(md, "```json");
requireIncludes(md, '"mechanism_id": "m010"');

const match = md.match(/```json\s*([\s\S]*?)\s*```/);
if (!match) {
  console.error("Missing JSON code block");
  process.exit(4);
}

let obj;
try {
  obj = JSON.parse(match[1]);
} catch (e) {
  console.error("Invalid JSON in code block");
  console.error(e?.message ?? e);
  process.exit(5);
}

// Minimal schema-aligned validation (canonical schema lives in agentic-tokenomics:
// mechanisms/m010-reputation-signal/schemas/m010_kpi.schema.json)
const requiredKeys = [
  "mechanism_id",
  "scope",
  "as_of",
  "signals_emitted",
  "subjects_touched",
  "evidence_coverage_rate",
  "median_event_latency_hours",
  "sources_checked"
];

for (const k of requiredKeys) {
  if (!(k in obj)) {
    console.error(`Missing KPI key: ${k}`);
    process.exit(6);
  }
}

if (obj.mechanism_id !== "m010") {
  console.error(`mechanism_id must be "m010"`);
  process.exit(7);
}
if (typeof obj.scope !== "string" || obj.scope.length < 1) {
  console.error("scope must be a non-empty string");
  process.exit(8);
}
if (typeof obj.as_of !== "string" || Number.isNaN(Date.parse(obj.as_of))) {
  console.error("as_of must be an ISO-8601 datetime string");
  process.exit(9);
}
if (!Number.isInteger(obj.signals_emitted) || obj.signals_emitted < 0) {
  console.error("signals_emitted must be an integer >= 0");
  process.exit(10);
}
if (!Number.isInteger(obj.subjects_touched) || obj.subjects_touched < 0) {
  console.error("subjects_touched must be an integer >= 0");
  process.exit(11);
}
if (typeof obj.evidence_coverage_rate !== "number" || obj.evidence_coverage_rate < 0 || obj.evidence_coverage_rate > 1) {
  console.error("evidence_coverage_rate must be a number between 0 and 1");
  process.exit(12);
}
if (!(obj.median_event_latency_hours === null || (typeof obj.median_event_latency_hours === "number" && obj.median_event_latency_hours >= 0))) {
  console.error("median_event_latency_hours must be a non-negative number or null");
  process.exit(13);
}

const sc = obj.sources_checked ?? {};
const hasKeys = ("koi" in sc) && ("ledger" in sc) && ("web" in sc);
if (!hasKeys || typeof sc.koi !== "boolean" || typeof sc.ledger !== "boolean" || typeof sc.web !== "boolean") {
  console.error("sources_checked must be an object with boolean keys: koi, ledger, web");
  process.exit(14);
}

const allFalse = sc.koi === false && sc.ledger === false && sc.web === false;

// No-fabrication gate: if no sources were checked, KPIs must not claim signal coverage.
if (allFalse) {
  const bad =
    obj.signals_emitted !== 0 ||
    obj.subjects_touched !== 0 ||
    obj.evidence_coverage_rate !== 0.0 ||
    obj.median_event_latency_hours !== null;

  if (bad) {
    console.error("No-fabrication violation: sources_checked all false but KPIs are non-zero");
    process.exit(15);
  }
}

console.log("signal-agent digest validation: PASS");
process.exit(0);
