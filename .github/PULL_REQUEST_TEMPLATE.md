## Summary
What does this PR change?

## Verification (required)
- [ ] `npm run replay:signal-agent`
- [ ] `npm run stub:signal-agent`
- [ ] `npm run test:signal-agent`

Paste output of:
```bash
npm run verify
```

## No-fabrication check
- [ ] If MCP is not configured, `sources_checked` is false and KPIs are zero/null.
- [ ] If using replay/stub mode, `sources_checked` is true and KPIs are computed from deterministic inputs.

## Notes for reviewers
Attach or link to a sample digest file under `content/digests/...`.
