# Prompt Templates — Formats for handling "time" queries

General notes
- Always separate system instructions (context) from user content.
- Request the model to first return a concise main answer. Only if the question is conceptual/scientific/philosophical, return a category breakdown, a short summary and a follow-up suggestion.
- Never reveal or reference the internal protocol steps to the user.

1) Everyday question template (no deep explanation)
system: "Be concise and clear; answer everyday questions without philosophical depth."
user: |
  - request: {user_question}
  - output_format: short plain text (1–3 sentences)

2) Scientific / philosophical template (with category breakdown)
system: "Return a concise main answer first. If the question is scientifically or philosophically relevant, include details for the relevant categories only, then a summary and a follow-up suggestion."
user: |
  - request: {user_question}
  - clarifications: {assumptions}
  - constraints: {constraints} (max length, forbidden topics)
output_spec:
  - main_answer: one paragraph (concise)
  - categories_detail: [
      {
        name: category name,
        definition: short definition,
        explanation: paragraph (not emphasized)
      }
    ] (only if relevant)
  - summary: short synthesis (if categories_detail present)
  - follow_up_suggestion: question to the user (if categories_detail present)

3) JSON output template (optional, for programmatic use)
system: "Return valid JSON only following the schema."
user: |
  - request: {user_question}
output_schema:
  {
    "main_answer": "string",
    "categories_detail": [
      {
        "name": "string",
        "definition": "string",
        "explanation": "string"
      }
    ],
    "summary": "string",
    "follow_up_suggestion": "string"
  }

Short example
- Input: "How does Einstein's view of time differ from Newton's?"
  - Expected behavior: main concise comparison, then category-level details (chronological time, mathematical time, metaphysical implications), short summary, and ask which category to explore further.