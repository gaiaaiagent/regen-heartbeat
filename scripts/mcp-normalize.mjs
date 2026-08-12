#!/usr/bin/env node
import fs from "node:fs";

function asArray(x) {
  if (Array.isArray(x)) return x;
  if (x && typeof x === "object") {
    if (Array.isArray(x.items)) return x.items;
    if (Array.isArray(x.results)) return x.results;
    if (Array.isArray(x.data)) return x.data;
  }
  return [];
}

function isoOrNull(s) {
  if (typeof s !== "string") return null;
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

function normalizePayload(payload, fallbackSource = "unknown") {
  const rootSource = typeof payload?.source === "string" ? payload.source : fallbackSource;
  const rootKind = typeof payload?.kind === "string" ? payload.kind : "unknown";
  const items = asArray(payload);

  return items.map((it, idx) => {
    const source = typeof it.source === "string" ? it.source : rootSource;
    const kind = typeof it.kind === "string" ? it.kind : rootKind;
    const id = (typeof it.id === "string" && it.id.length) ? it.id : `${source}:${kind}:${idx}`;
    const timestamp = isoOrNull(it.timestamp) ?? (payload?.as_of ? isoOrNull(payload.as_of) : null) ?? new Date().toISOString();
    const title = typeof it.title === "string" ? it.title : "";
    const url = typeof it.url === "string" ? it.url : "";
    const subjects = Array.isArray(it.subjects) ? it.subjects : [];
    const evidence = it.evidence && typeof it.evidence === "object" ? it.evidence : {koi_links:[], ledger_refs:[], web_links:[]};

    // Ensure evidence buckets exist
    evidence.koi_links = Array.isArray(evidence.koi_links) ? evidence.koi_links : [];
    evidence.ledger_refs = Array.isArray(evidence.ledger_refs) ? evidence.ledger_refs : [];
    evidence.web_links = Array.isArray(evidence.web_links) ? evidence.web_links : [];

    return { source, kind, id, timestamp, title, url, subjects, evidence, raw: it };
  });
}

const inPath = process.argv[2];
const outPath = process.argv[3];

if (!inPath) {
  console.error("Usage: node scripts/mcp-normalize.mjs <input.json> [output.json]");
  process.exit(1);
}

const raw = fs.readFileSync(inPath, "utf8");
const payload = JSON.parse(raw);

const normalized = normalizePayload(payload);

if (outPath) {
  fs.writeFileSync(outPath, JSON.stringify(normalized, null, 2) + "\n", "utf8");
}

process.stdout.write(JSON.stringify(normalized, null, 2) + "\n");
