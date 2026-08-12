# Publishing (Quartz + GitHub Pages)

This repo can publish the Quartz site via GitHub Actions.

## One-time GitHub settings
1) Repo Settings → Pages
2) Source: **GitHub Actions**

## What happens on push
- Push to `main` triggers `.github/workflows/deploy-quartz.yml`
- The workflow first runs: `npm run test:signal-agent` (Unit 5 no-fabrication gate)
- If tests pass, it builds Quartz and deploys to GitHub Pages.

## Troubleshooting
- If deployment fails with permissions errors, confirm workflow has:
  - `pages: write`
  - `id-token: write`
  - `contents: read`
See GitHub Pages deploy action docs for required permissions.
