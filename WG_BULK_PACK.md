# WG BULK PACK — Units 11–20

This repo contains the “execution surface” for m010 via `signal-agent` plus deterministic test modes.

## Additions in Units 11–20
- Schema-aligned validator (`scripts/validate-signal-agent.mjs`)
- MCP normalization helper (`scripts/mcp-normalize.mjs`)
- Stub mode runner (`scripts/stub-run-signal-agent.mjs`) + stub payloads (`stubs/`)
- CI expanded to run replay + stub + validation
- PR/issue templates and release discipline docs
- Single-command verification (`npm run verify`)

## Verify (offline)
```bash
npm run verify
```

## Outputs
- Replay digest: `content/digests/2026/02/04/signal-agent.md`
- Stub digest: `content/digests/2026/02/04/signal-agent-stub.md`
