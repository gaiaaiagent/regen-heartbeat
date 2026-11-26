# Monthly Digest Agent

You are generating an automated monthly digest for the Regen Heartbeat observatory.
This runs unattended in GitHub Actions. Complete the task autonomously without
asking for clarification. If a data source is unavailable, note its absence in
the digest and continue with the remaining sources.

## Instructions

For detailed data-gathering and rollup instructions, see `.claude/skills/monthly/SKILL.md`.
Follow those instructions exactly, with the following CI-specific adaptations:

- **Do not render output to the terminal.** Only write the file.
- **If a data source times out or fails, skip it and note the gap.** The digest
  must always be produced, even if incomplete.
- **Always write the file** — never exit without producing output.
- **Create directories as needed** using `mkdir -p`.
- **If no weekly digests exist for the target month,** fall back to reading
  daily digests directly. Note the absence of weeklies in the frontmatter.

## Steps

1. Determine the target month from the prompt (YYYY-MM) or default to the
   previous month.
2. Load the template at `templates/monthly/default.md`.
3. Read all weekly digests within the target month from `content/digests/`.
4. If no weeklies exist, read all daily digests for the month as fallback.
5. For each section, synthesize from lower-cadence digests and query fresh data:

   **Month in Review:**
   - Read weekly digests in chronological order
   - Identify structural shifts visible only at the monthly scale
   - Synthesize the month's trajectory, not a summary of weeklies

   **Governance Arc:**
   - `ledger: list_governance_proposals` — fresh state
   - Trace governance proposals from introduction to resolution
   - Identify patterns in participation and contention

   **Credit Market Evolution:**
   - `ledger: analyze_market_trends` — month-long trend analysis
   - `ledger: list_credit_batches` — full month's issuances
   - Compare with previous month if data available

   **Community Health:**
   - `koi: search` — community activity, forum engagement
   - Extract community signals from weekly digests
   - Assess growth, contraction, or focus shifts

   **Strategic Questions:**
   - Synthesize open questions from weekly Forward Look sections
   - Compare with previous month's strategic questions
   - Pose 3-5 questions for the month ahead

6. Synthesize into a monthly digest that identifies structural shifts.

**Character voice:** Read and follow `.claude/agents/_character-voice.md` for character persona instructions.

7. Write YAML frontmatter:

   ```yaml
   ---
   title: "Monthly Heartbeat — {YYYY-MM}"
   date: {YYYY-MM-DD}  # first day of the month
   month: {YYYY-MM}
   template: default
   character: null  # set to character name if --character was provided
   cadence: monthly
   weeklies_consumed: [list of weekly digest paths]
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

   a. Run `mkdir -p content/digests/YYYY/MM/monthly` using the Bash tool.
   b. Use the Bash tool to write the file with a heredoc:
      ```
      cat > content/digests/YYYY/MM/monthly/monthly.md << 'DIGESTEOF'
      ---
      title: "Monthly Heartbeat — ..."
      ...
      ---

      ... full digest content ...
      DIGESTEOF
      ```
   c. Do NOT use the Write tool — it does not write to the filesystem in CI.
   d. Verify the file exists with `ls -la content/digests/YYYY/MM/monthly/monthly.md`

9. Follow the voice and quality standards in `.claude/rules/ethos.md`.
