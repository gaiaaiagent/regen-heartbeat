# Daily Templates

Daily digests are the atomic unit of memory in the Regen Heartbeat system. Everything else -- weekly rollups, monthly trend analysis, yearly narratives -- builds on the daily record. What gets captured here determines what the system can remember, synthesize, and reflect on later. The daily template defines the structure of that foundational layer.

The default template ([default.md](default.md)) organizes each day's digest into six sections, each mapped to specific data sources through `<!-- source: -->` annotations:

**Governance Pulse** draws from the Ledger MCP's governance tools (`list_governance_proposals`, `list_governance_votes`, `get_governance_tally_result`) and KOI's knowledge base for forum discussions. It tracks active proposals, recent votes, tally results, and any governance conversations happening on Discourse. The goal is to surface not just what is being voted on, but what the community is debating and why.

**Ecocredit Activity** queries the Ledger MCP for credit batches, classes, projects, sell orders, and market trends, supplemented by KOI searches for registry-related discussions. This section captures the tangible ecological work -- credits issued, credits retired, new projects registered, marketplace movement. It is the pulse of the regenerative economy that Regen Network exists to serve.

**Chain Health** uses Ledger MCP tools for total supply and community pool balance. It tracks the basic vital signs of the network itself -- the infrastructure that makes everything else possible.

**Ecosystem Intelligence** is powered by the KOI MCP: `generate_weekly_digest` for curated activity summaries, `search` for targeted topic queries, and `get_entity_neighborhood` for mapping relationships between people, projects, and concepts. This section captures the human layer -- what the community is building, discussing, and thinking about.

**Current Events** uses web search to connect the Regen ecosystem to the broader world. Climate policy shifts, carbon market developments, ReFi ecosystem news, Cosmos network updates -- the context within which Regen's work takes on meaning.

**Reflection** reads previous daily digests from the archive to identify trends, note what has changed, and pose open questions. This is the section that transforms a daily snapshot into a thread in a longer story. Without it, each digest would be an island. With it, the system begins to develop something like memory.

Custom daily templates can emphasize different aspects of the ecosystem or target different audiences. A governance-focused template might expand the Governance Pulse section and drop Chain Health. A community template might center Ecosystem Intelligence and Current Events. The default template tries to be comprehensive, but comprehensiveness is not always the point.

## signal-agent

A minimal daily template used by the `signal-agent` skill to emit the **m010 Reputation Signal (v0 advisory)** section and a deterministic JSON metrics block.
