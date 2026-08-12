#!/usr/bin/env node
import { spawnSync } from "node:child_process";

function run(cmd, args, env = {}) {
  const res = spawnSync(cmd, args, { encoding: "utf8", env: { ...process.env, ...env } });
  if (res.status !== 0) {
    console.error(res.stdout || "");
    console.error(res.stderr || "");
    process.exit(res.status ?? 1);
  }
}

console.log("Running replay...");
run("node", ["scripts/replay-m010.mjs", "fixtures/m010/v0_sample.json", "content/digests/2026/02/04/signal-agent.md"]);

console.log("Validating replay digest...");
run("node", ["scripts/validate-signal-agent.mjs"]);

console.log("Running stub mode...");
run("node", ["scripts/stub-run-signal-agent.mjs", "stubs/koi.sample.json", "stubs/ledger.sample.json", "content/digests/2026/02/04/signal-agent-stub.md"]);

console.log("Validating stub digest...");
run("node", ["scripts/validate-signal-agent.mjs"], { SIGNAL_AGENT_DIGEST: "content/digests/2026/02/04/signal-agent-stub.md" });

console.log("regen-heartbeat verify: PASS");
