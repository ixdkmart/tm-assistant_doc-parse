const PROMPT_01_TO_02 = `

this works

ROLE
You extract ONLY content related to one focus object (a Definition, Procedure, or Entity) from ONE markdown file, and emit a JSON slice shaped like the full schema. You do not merge across documents.

PRINCIPLE (must follow exactly)
1) For each input definition/process/entity, import it and store the item we're assessing (the "focus object").
2) For each input markdown file, read it and extract everything that relates to the focus object.
3) Process files one at a time.
4) Output a new JSON file using the full-schema fields with all content found for this doc+focus.
5) Fill keywords and other fields as available.
6) Repeat for the next definition/process/entity.

INPUT
FOCUS_OBJECT_JSON — exactly one of:
{ "type": "definition", "term": "{{TERM}}" }
{ "type": "procedure", "title": "{{TITLE}}" }
{ "type": "entity", "name": "{{NAME}}" }

SOURCE_DOC:
{
  "doc_name": "{{DOC_NAME}}",
  "doc_path": "{{DOC_PATH}}",
  "text": "{{RAW_MARKDOWN_TEXT}}"
}

EXTRACTION RULES
- Use the canonical full term/title/name for the focus (no acronyms in the canonical field). Acronyms/aliases go into pseudonyms.
- Find relevant spans by case-insensitive match of the canonical string and simple variants (pluralisation, hyphenation). Allow small typos (Levenshtein ≤2).
- Classify matched content into the appropriate full-schema fields:
  Definition → definition, pseudonyms, keywords, examples?, caveats?
  Procedure → steps (ordered, imperative), pseudonyms, keywords, examples?, bestPractice?, caveats?, constraints?, troubleshooting?, metrics?
  Entity → description, pseudonyms, keywords, troubleshooting?, constraints?, caveats?, bestPractice?
- Convert obviously listed instructions under “How to…/Return/Steps/Checklist” into procedure steps where applicable.
- Turn explicit limits/times into metrics (natural language, units inline).
- Prefer empty over guessing. Do not invent facts.

KEYWORDS
- 3–12 concise, lowercase, deduped terms drawn from extracted content.

EVIDENCE
- Include an array of short verbatim quotes that support populated fields.
- Shape: { "doc": "{{DOC_NAME}}", "quote": "..." }.
- Quotes must be substrings of SOURCE_DOC.text.

OUTPUT (JSON ONLY)
{
  "focus": { "type": "...", "id": "{{TERM|TITLE|NAME}}" },
  "doc":   { "name": "{{DOC_NAME}}", "path": "{{DOC_PATH}}" },
  "slice": {
    "type": "definition|procedure|entity",
    "term|title|name": "...",
    "definition|description": "",
    "pseudonyms": [],
    "keywords": [],
    "steps": [],
    "examples": [],
    "bestPractice": [],
    "caveats": [],
    "constraints": [],
    "troubleshooting": [],
    "metrics": []
  },
  "evidence": [
    { "doc": "{{DOC_NAME}}", "quote": "..." }
  ]
}

QUALITY CHECK (do silently before emitting)
- All non-empty fields have supporting evidence quotes.
- Steps are imperative and ordered.
- Canonical name is full form; acronyms in pseudonyms.
- Keywords 3–12, lowercase, deduped.
- Valid JSON; no comments or trailing commas.

RESPONSE RULE
Return ONLY the final JSON object.

`;
export default PROMPT_01_TO_02;


