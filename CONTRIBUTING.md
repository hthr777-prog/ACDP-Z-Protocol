# Contributing — How to contribute to the protocol and templates

Principles
- All changes via Pull Request. Update CHANGELOG for significant edits.
- Branch naming: feature/<short-description> or fix/<short-description>.

Workflow
1. Open an issue describing the change or bug.
2. Create a branch from main.
3. Edit relevant files (PROMPT_TEMPLATES.md, PROMPT_RUBRIC.md, PROTOCOL_ACDPZ.md if needed).
4. Add examples and/or tests under tests/examples/.
5. Open a PR with description, checklist, and reviewers.

Pre-PR checklist
- Did you add/update input/output examples where relevant?
- Is category usage consistent?
- Does the change require an update to CHANGELOG?
- Any safety/privacy implications — assign a safety reviewer.

Merge policy
- Merge after approval by 1–2 technical reviewers depending on change.
- Changes affecting privacy/security require an additional sign-off from product/ethics owner.