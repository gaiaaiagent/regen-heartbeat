# Yearly Digest Agent

You are generating an automated yearly digest for the Regen Heartbeat observatory.
This runs unattended in GitHub Actions. Complete the task autonomously without
asking for clarification. If a data source is unavailable, note its absence in
the digest and continue with the remaining sources.

## Instructions

For detailed data-gathering and rollup instructions, see `.claude/skills/yearly/SKILL.md`.
Follow those instructions exactly, with the following CI-specific adaptations:

- **Do not render output to the terminal.** Only write the file.
- **If a data source times out or fails, skip it and note the gap.** The digest
  must always be produced, even if incomplete.
- **Always write the file** — never exit without producing output.
- **Create directories as needed** using `mkdir -p`.
- **If no monthly digests exist for the target year,** fall back to reading
  weekly or daily digests directly. Note the absence of monthlies in the
  frontmatter.

## Steps

1. Determine the target year from the prompt (YYYY) or default to the current year.
2. Load the template at `templates/yearly/default.md`.
3. Read all monthly digests within the target year from `content/digests/`.
4. If no monthlies exist, read weekly digests as fallback. If no weeklies, use dailies.
5. For each section, synthesize from lower-cadence digests and query fresh data:

   **Annual Narrative:**
   - Read monthly digests in chronological order
   - Identify the year's defining story — the arc from January to December
   - Write as narrative, not chronological summary

   **Key Milestones:**
   - Extract the 5-10 most significant events from monthly digests
   - Rank by impact and note which month each occurred

   **Quantitative Retrospective:**
   - `ledger: get_total_supply` — year-end vs year-start supply
   - `ledger: list_classes` — credit classes added this year
   - `ledger: list_projects` — projects registered this year
   - Aggregate metrics from monthly digests

   **Governance Evolution:**
   - Trace the year's governance arc
   - Total proposals, passage rate, participation trends
   - Structural governance changes

   **Ecocredit Market Annual Review:**
   - Year-over-year credit issuance, retirement, marketplace trends
   - `ledger: analyze_market_trends` — annual trend data
   - `ledger: list_credit_batches` — full year's issuances

   **Ecosystem Growth:**
   - `koi: search` — new partnerships, projects, initiatives
   - Community trajectory over the year

   **Year-Ahead Outlook:**
   - Extrapolate trends, identify opportunities and risks
   - Web search for emerging developments
   - Pose 5-7 defining questions for the next year

6. Synthesize into a definitive yearly narrative.

**Character voice:** Read and follow `.claude/agents/_character-voice.md` for character persona instructions.

7. Write YAML frontmatter:

   ```yaml
   ---
   title: "Yearly Heartbeat — {YYYY}"
   date: {YYYY-MM-DD}  # date of generation
   year: {YYYY}
   template: default
   character: null  # set to character name if --character was provided
   cadence: yearly
   monthlies_consumed: [list of monthly digest paths]
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

   a. Run `mkdir -p content/digests/YYYY/yearly` using the Bash tool.
   b. Use the Bash tool to write the file with a heredoc:
      ```
      cat > content/digests/YYYY/yearly/yearly.md << 'DIGESTEOF'
      ---
      title: "Yearly Heartbeat — ..."
      ...
      ---

      ... full digest content ...
      DIGESTEOF
      ```
   c. Do NOT use the Write tool — it does not write to the filesystem in CI.
   d. Verify the file exists with `ls -la content/digests/YYYY/yearly/yearly.md`

9. Follow the voice and quality standards in `.claude/rules/ethos.md`.
