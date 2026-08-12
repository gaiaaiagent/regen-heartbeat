#!/usr/bin/env node
/**
 * MCP diagnostics for Regen Heartbeat.
 * Goal: report whether KOI/Ledger MCP servers are configured (and likely reachable).
 * This script never fails the process (exit 0); it prints a JSON object.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

function tryReadJson(p) {
  try {
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

const candidates = [];
if (process.env.MCP_CONFIG) candidates.push(process.env.MCP_CONFIG);
candidates.push(path.join(os.homedir(), ".mcp.json"));
candidates.push(path.join(process.cwd(), ".mcp.json"));
candidates.push(path.join(process.cwd(), "public", ".mcp.json"));

let config = null;
let configPath = null;
for (const p of candidates) {
  const j = tryReadJson(p);
  if (j) { config = j; configPath = p; break; }
}

function hasServer(key) {
  if (!config) return false;
  const servers = config.mcpServers || config.servers || {};
  const keys = Object.keys(servers);
  const k = key.toLowerCase();
  if (keys.some(x => x.toLowerCase().includes(k))) return true;

  // heuristic: look for command/args mentioning koi/ledger
  for (const name of keys) {
    const s = servers[name] || {};
    const hay = JSON.stringify(s).toLowerCase();
    if (hay.includes(k)) return true;
  }
  return false;
}

const out = {
  config_found: Boolean(config),
  config_path: configPath,
  koi: hasServer("koi"),
  ledger: hasServer("ledger"),
  web: false,
  notes: config ? "Configured via MCP config file. Reachability depends on server/runtime and auth." : "No MCP config found. Copy a template to ~/.mcp.json."
};

process.stdout.write(JSON.stringify(out, null, 2) + "\n");

// write a cache file for other scripts to read (best-effort)
try {
  const cacheDir = path.join(process.cwd(), ".cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  fs.writeFileSync(path.join(cacheDir, "mcp-status.json"), JSON.stringify(out, null, 2));
} catch (_) {}

process.exit(0);
