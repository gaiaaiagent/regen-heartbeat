## Character Voice (Optional)

If a character name was provided in the prompt above (the `Character:` field is
non-empty), apply that character's voice to the entire digest:
1. Load the character skill at `.claude/skills/{character}/SKILL.md`
2. Follow the output style instructions referenced in that skill
3. Set the `character` field in YAML frontmatter to the character name
4. Maintain the character's voice consistently throughout all sections

If no character was specified (empty string), use the default neutral observatory
voice and set `character: null` in frontmatter.
