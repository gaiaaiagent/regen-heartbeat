# Regen Heartbeat

An observatory for the Regen ecosystem. Regen Heartbeat generates structured digests about Regen Network, RegenAI, and the Regen Commons -- pulling live data from the blockchain, the KOI knowledge commons, and the wider web, then synthesizing it into readable reports voiced through thirteen distinct character personas. The digests are published as a static site via Quartz on GitHub Pages, building an accumulating record of what the ecosystem is doing, thinking, and becoming.

This repository also serves as a working template for Claude Code. Every structural choice -- the skills, output styles, character pipeline, MCP integrations, template system -- is designed to be studied and learned from. Clone it, read it, and you will understand not just what Regen Heartbeat does, but how Claude Code works.


## How It Works

Data flows through four stages. First, MCP tools query live sources: the KOI knowledge base searches 6,500+ documents across Notion, GitHub, Discourse, and governance records, while the Ledger MCP reads directly from the Regen blockchain for proposals, ecocredits, supply, and marketplace data. Web search adds current events from the broader world. Second, templates define the shape of each digest -- what sections to include, what data to gather for each one. Third, the generating agent synthesizes everything into a coherent narrative, optionally voiced through a character persona. Fourth, the finished digest lands as a markdown file in the content directory, where Quartz renders it into a static site deployed to GitHub Pages.


## Commands

- `/current-events` -- Search the web for current events relevant to the Regen ecosystem
- `/daily` -- Generate a daily digest with data from KOI, Ledger, and web sources
- `/weekly` -- Generate a weekly rollup synthesizing dailies into pattern analysis
- `/monthly` -- Generate a monthly rollup distilling weeklies into trend narratives
- `/yearly` -- Generate a yearly retrospective from monthly digests
- `/plans` -- View and manage active plans *(Phase 3)*
- `/roadmap` -- View per-group roadmaps *(Phase 3)*
- `/goals` -- View and manage goals *(Phase 3)*
- `/decisions` -- Track open and closed decisions *(Phase 3)*


## Directory Structure

```
regen-heartbeat/
├── content/                    Quartz content root
│   ├── index.md                Homepage
│   ├── digests/                Digest archive (YYYY/MM/DD/daily.md)
│   └── docs/                   MCP documentation (Diataxis framework)
├── templates/                  Digest blueprints by cadence
│   ├── daily/                  Daily templates
│   ├── weekly/                 Weekly rollup templates
│   ├── monthly/                Monthly rollup templates
│   └── yearly/                 Yearly retrospective templates
├── .claude/
│   ├── agents/                 CI-compatible agent files for GitHub Actions
│   ├── characters/             Character persona definitions (ElizaOS JSON)
│   ├── output-styles/          Writing style instructions per character
│   ├── skills/                 Command skills and character skills
│   ├── specs/                  System specifications and roadmap
│   └── rules/                  Behavioral guidelines and ethos
├── settings.json               Topics, defaults, and site configuration
├── quartz.config.ts            Quartz site configuration
├── quartz.layout.ts            Quartz page layout
└── .github/workflows/
    ├── deploy.yml              GitHub Pages deployment
    ├── daily.yml               Automated daily digest generation
    ├── weekly.yml              Automated weekly rollup generation
    ├── monthly.yml             Automated monthly rollup generation
    └── heartbeat-monitor.yml   Verifies daily digests were created
```


## Characters

Thirteen characters voice digests with distinct perspectives. They are organized into three groups:

**Regen** -- The institutional voices of Regen Network and its community.
- **Narrator** bridges complex ideas to broad audiences through storytelling
- **RegenAI** speaks as the technical lead and systems orchestrator
- **Governor** focuses on governance, consensus, and collective decision-making
- **Facilitator** orchestrates partnerships and ecosystem development
- **Advocate** mobilizes the community through education and outreach
- **VoiceOfNature** channels philosophical depth and wisdom traditions

**Gaia** -- Voices from deeper ecological, technological, and legal perspectives.
- **Gaia** speaks as planetary intelligence and ecohyperstition
- **TerraNova** grounds everything in soil carbon and ecosystem dynamics
- **Genesis** architects autopoietic systems and AI engineering
- **Astraea** brings regenerative law and legal frameworks
- **Aquarius** flows through water systems and hydrological thinking

**Bioregion** -- Place-rooted voices.
- **Cascadia** speaks from the Pacific Northwest bioregion
- **Amazonia** speaks from the Amazon basin with citation-grounded ecological science


## Getting Started

Generate your first digest:

```
/daily
```

Or with a character voice:

```
/daily --character narrator
```

Search for current events:

```
/current-events --creative --deep
```

Preview the site locally:

```
npx quartz build --serve
```


## Automation

Digests are generated automatically via GitHub Actions using `anthropics/claude-code-action@v1` authenticated with a Max plan OAuth token. Each cadence runs on a staggered schedule to ensure lower-cadence digests are available before higher-cadence rollups begin.

| Cadence | Schedule | Model | Agent File |
|---------|----------|-------|------------|
| Daily | Every day at 08:00 UTC | Sonnet | `.claude/agents/daily-digest.md` |
| Weekly | Mon, Wed, Fri at 10:00 UTC | Sonnet | `.claude/agents/weekly-digest.md` |
| Monthly | 1st and 15th at 12:00 UTC | Opus | `.claude/agents/monthly-digest.md` |
| Yearly | Manual (solstices, equinoxes, New Year) | Opus | `.claude/agents/yearly-digest.md` |

All workflows support `workflow_dispatch` for manual triggering with custom dates, weeks, months, or model selection. The heartbeat monitor runs daily at 09:00 UTC to verify the previous day's digest was generated.

**Required secrets:** `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`), `KOI_API_ENDPOINT`.


## Documentation

- [Getting Started Tutorial](content/docs/tutorials/getting-started.md)
- [KOI MCP Tool Reference](content/docs/reference/koi-mcp-tools.md)
- [Ledger MCP Tool Reference](content/docs/reference/ledger-mcp-tools.md)
- [The Regen Ecosystem](content/docs/explanations/regen-ecosystem.md)
- [Why These MCPs?](content/docs/explanations/why-these-mcps.md)


## Included Plugins

- **KOI MCP** -- Regen knowledge base search, entity resolution, weekly digests, GitHub docs
- **Ledger MCP** -- Regen blockchain queries for governance, ecocredits, marketplace, supply
