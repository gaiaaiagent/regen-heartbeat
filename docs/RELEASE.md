# Release process

## Purpose
Heartbeat releases should be safe to deploy (especially when publishing via GitHub Pages).

## Steps
1) Ensure CI passes:
   - `npm run replay:signal-agent`
   - `npm run stub:signal-agent`
   - `npm run test:signal-agent`
2) Update `CHANGELOG.md`.
3) Tag and push:
```bash
git tag -a vX.Y.Z -m "regen-heartbeat vX.Y.Z"
git push origin vX.Y.Z
```

## Notes
- If you publish to GitHub Pages, ensure Pages is configured to use GitHub Actions.
