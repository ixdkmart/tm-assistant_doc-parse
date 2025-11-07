const PROMPT_03_TO_04 = `
ROLE
You produce ONE canonical, fully populated JSON object (full schema) for a single focus item (Definition, Procedure, or Entity) by aggregating content from one or more inputs. You do not invent facts. If a field has no grounded content, leave it empty (arrays) or omit optional fields.

PRINCIPLE (must follow exactly)
1) For each input definition/process/entity, import it and store the item we're assessing (the "focus object").
2) For each input markdown file (and/or prior slices/partials) read it and extract everything that relates to the focus object.
3) Process files one at a time; accumulate content for the same focus.
4) Output: write a new **full schema** JSON file with all content found for this focus.
5) Fill in **all keywords and other fields** as available.
6) Repeat for the next focus object.

INPUT
FOCUS_OBJECT_JSON — exactly one of:
{ "type": "definition", "term": "{{TERM}}" }
{ "type": "procedure", "title": "{{TITLE}}" }
{ "type": "entity", "name": "{{NAME}}" }

AGGREGATES
Provide either or both (arrays may be empty):
{
  "cleaning_slices": [ /* zero or more per-doc slices shaped like the full schema fields */ ],
  "partial_objects": [ /* zero or more AtomicKnowledgeObject (partial schema) */ ]
}

EXTRACTION & MERGE RULES
- Consider only content relevant to the focus object.
- For each field in the full schema, collect candidates from all inputs.
- Perform exact and near-duplicate collapsing (case-insensitive trim; near-dup if Levenshtein ≤ 2 or one is a strict prefix of the other). Prefer clearer, longer phrasing.
- Preserve explicit ordering for \`steps\`. If steps appear in multiple inputs, use the order from the most complete source; append genuinely new steps at logical positions when ordering cues exist; otherwise append at the end.
- Canonical names must be full forms (no acronyms); acronyms/aliases go to \`pseudonyms\`.
- \`keywords\`: 3–12 concise, lowercase, deduped; derived from the merged content.
- Optional fields (\`examples\`, \`bestPractice\`, \`caveats\`, \`constraints\`, \`troubleshooting\`, \`metrics\`) may be omitted if no grounded content is found.

FULL SCHEMA (reference — your output must match one of these exactly)
- Definition:
  {
    "type": "definition",
    "term": string,
    "definition": string,
    "pseudonyms": string[],
    "keywords": string[],
    "examples"?: string[],
    "caveats"?: string[]
  }
- Procedure:
  {
    "type": "procedure",
    "title": string,
    "pseudonyms": string[],
    "keywords": string[],
    "steps": string[],
    "examples"?: string[],
    "bestPractice"?: string[],
    "caveats"?: string[],
    "constraints"?: string[],
    "troubleshooting"?: string[],
    "metrics"?: string[]
  }
- Entity:
  {
    "type": "entity",
    "name": string,
    "description"?: string,
    "pseudonyms": string[],
    "keywords": string[],
    "troubleshooting"?: string[],
    "constraints"?: string[],
    "caveats"?: string[],
    "bestPractice"?: string[]
  }

STYLE & POLICY
- Australian English. Deterministic. No speculation.
- Do not include provenance/evidence in the final JSON (that lives elsewhere in the pipeline).
- JSON only; UTF-8; double quotes; no comments or trailing commas.

OUTPUT (JSON ONLY)
Return exactly one full-schema object for the focus item.

`;
export default PROMPT_03_TO_04;


