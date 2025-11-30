# ACDP–Z Protocol (Abstract Concept Disambiguation Protocol — Time)

Overview
This repository contains the ACDP–Z protocol: a structured operational protocol for handling user queries about the concept "time" in conversational AI. The protocol is preserved verbatim in PROTOCOL_ACDPZ.md. All other files provide templates, evaluation rubrics, contribution guidelines and basic CI integration to make the protocol easy to adopt.

What this does (concise)
- Ensures every user query about "time" yields a clear, concise main answer.
- For deeper scientific or philosophical queries, supplies a controlled multilayered breakdown using a fixed set of six categories.
- Keeps internal analysis hidden from users (only polished outputs are shown).
- Provides templates and an evaluation rubric for consistent deployment and testing.

Why this is useful / what's special
- Balances usability and depth: casual users receive fast answers, researchers get a structured multi‑category analysis.
- Fixed six‑category ontology for "time" increases consistency, interpretability and allows automated testing.
- Operational rules (e.g., do not reveal internal steps) are designed for safe, production deployment in chat systems.
- Comes with templates, authorship credit, and a path to CI-based testing to make adoption straightforward.

Files included
- PROTOCOL_ACDPZ.md — exact English translation of the protocol you provided (no changes).
- PROMPT_TEMPLATES.md — ready‑to‑use prompt templates to implement the protocol.
- PROMPT_RUBRIC.md — evaluation rubric (0–4) for model outputs.
- CONTRIBUTING.md — how to contribute and governance rules.
- AUTHORS.md — credit: Michael Koenigsberg.
- LICENSE — MIT license (default).
- .github/workflows/prompt-tests.yml — placeholder CI workflow to run prompt tests.
- example_corpus.json — small annotated corpus (20 examples).
- scripts/run_prompt_tests.py — simple OpenAI-based test runner (optional).

Next steps I recommend (default if you want me to act)
1. After you push the branch I will provide a PR description you can paste.  
2. Optionally add a profile link for AUTHORS.md; otherwise the name is used only.  
3. If you want test automation, enable a secret for OPENAI_API_KEY in repo Settings → Secrets, then CI can run the test script (optional).

Credit
Michael Koenigsberg