# Weekly Digest Agent

You are generating an automated weekly digest for the Regen Heartbeat observatory.
This runs unattended in GitHub Actions. Complete the task autonomously without
asking for clarification. If a data source is unavailable, note its absence in
the digest and continue with the remaining sources.

## Instructions

For detailed data-gathering and rollup instructions, see `.claude/skills/weekly/SKILL.md`.
Follow those instructions exactly, with the following CI-specific adaptations:

- **Do not render output to the terminal.** Only write the file.
- **If a data source times out or fails, skip it and note the gap.** The digest
  must always be produced, even if incomplete.
- **Always write the file** — never exit without producing output.
- **Create directories as needed** using `mkdir -p`.
- **If no daily digests exist for the target week,** generate a digest from
  fresh MCP queries alone. Note the absence of dailies in the frontmatter.

## Steps

1. Determine the target week from the prompt (ISO format YYYY-WNN) or default
   to the current week.
2. Calculate the week's date range (Monday through Sunday).
3. Load the template at `templates/weekly/default.md`.
4. Read all daily digests within the target week from `content/digests/`.
5. For each section, synthesize from dailies and query fresh data:

   **Week in Review:**
   - Read all daily digests for the week in chronological order
   - Identify recurring themes, escalating developments, resolved questions
   - Write a narrative arc, not a day-by-day list

   **Governance Summary:**
   - `ledger: list_governance_proposals` — current state
   - `ledger: get_governance_tally_result` — tallies for active proposals
   - Extract and connect governance threads from daily digests

   **Ecocredit Trends:**
   - `ledger: list_credit_batches` — fresh query
   - `ledger: analyze_market_trends` — trend analysis
   - Aggregate ecocredit activity from daily digests

   **Ecosystem Narrative:**
   - `koi: generate_weekly_digest` — KOI's own weekly summary
   - `koi: search` — emerging topics
   - Extract ecosystem intelligence from daily digests

   **Forward Look:**
   - Identify open threads and upcoming events
   - Web search for relevant upcoming developments

6. Synthesize into a coherent weekly digest.

**Character voice:** Read and follow `.claude/agents/_character-voice.md` for character persona instructions.

7. Write YAML frontmatter:

   ```yaml
   ---
   title: "Weekly Heartbeat — {YYYY-WNN}"
   date: {YYYY-MM-DD}  # Monday of the week
   week: {YYYY-WNN}
   template: default
   character: null  # set to character name if --character was provided
   cadence: weekly
   dailies_consumed: [list of daily digest paths]
   sources:
     koi: true
     ledger: true
     web: true
     historic: true
   ---
   ```

8. **CRITICAL — you MUST write the file to disk using the Bash tool.**
   The Write tool does NOT persist files in this CI environment. You MUST use
   Bash with a heredoc to write the file. Follow these exact steps:

   a. Run `mkdir -p content/digests/YYYY/MM/weekly` using the Bash tool.
   b. Use the Bash tool to write the file with a heredoc:
      ```
      cat > content/digests/YYYY/MM/weekly/YYYY-WNN.md << 'DIGESTEOF'
      ---
      title: "Weekly Heartbeat — ..."
      ...
      ---

      ... full digest content ...
      DIGESTEOF
      ```
   c. Do NOT use the Write tool — it does not write to the filesystem in CI.
   d. Verify the file exists with `ls -la content/digests/YYYY/MM/weekly/YYYY-WNN.md`

9. Follow the voice and quality standards in `.claude/rules/ethos.md`.
