const PROMPT_02_TO_03 = `
ROLE
You read ONE cleaned markdown document and identify all distinct **Definitions**, **Procedures**, and **Entities** it meaningfully describes. For each identified object, you must emit a JSON object that conforms **exactly** to the PARTIAL AtomicKnowledgeObject interface.

PRINCIPLE (must follow exactly)
1) Read each document in the input folder.
2) Identify Definitions, Procedures, and Entities contained in the document.
3) For each identified object, if a file does not already exist, create it using the required schema.
4) Naming rules (runner handles filenames, but your canonical fields must make them possible):
   - Definitions: \`term\` is the **full term** (no acronyms).
   - Procedures: \`title\` is the **formal name** of the procedure.
   - Entities: \`name\` is the **full canonical name** (no acronyms).
5) Files are \`.json\` text files. **The output MUST be like this AtomicKnowledgeObject Below**.
6) If a file already exists (runner concern), ignore and continue.

REFERENCE SCHEMA (PARTIAL ONLY — you MUST shape each object exactly like one of these)
- Definition:
  {
    "type": "definition",
    "term": string,
    "definition": string
  }
- Procedure:
  {
    "type": "procedure",
    "title": string,
    "pseudonyms": string[]
  }
- Entity:
  {
    "type": "entity",
    "name": string,
    "description"?: string,
    "pseudonyms": string[]
  }

INPUT
SOURCE_DOC:
{
  "doc_name": "{{DOC_NAME}}",
  "doc_path": "{{DOC_PATH}}",
  "text": "{{RAW_MARKDOWN_TEXT}}"
}

DISCOVERY RULES
- **Procedures**: imperative phrasing (“how to…”, “to make a claim…”, “steps…”), checklists, or clearly described operational flows.
- **Definitions**: named guarantees/policies/warranties with explicit meaning/scope sentences (“X is…”, “X means…”).
- **Entities**: suppliers, systems, platforms, roles, or named artefacts (e.g., “Proof of Purchase”).
- Canonical field (term/title/name) must be **full form (no acronyms)**. Put acronyms/shortenings into \`pseudonyms\`.
- Be conservative: emit an object only if the document provides clear support.

STRICT SCHEMA LIMITS (do NOT exceed)
- Do NOT output \`keywords\`, \`steps\`, \`caveats\`, \`constraints\`, \`troubleshooting\`, \`metrics\`, \`bestPractice\`, or \`examples\` in this step.
- Required arrays (\`pseudonyms\` for Procedure/Entity) must exist; can be empty if nothing is grounded.

OUTPUT (JSON ONLY)
Return a single JSON object:
{
  "doc": { "name": "{{DOC_NAME}}", "path": "{{DOC_PATH}}" },
  "objects": [ /* array of PARTIAL AtomicKnowledgeObject items exactly matching the reference schema */ ]
}

QUALITY CHECK (perform silently)
- All objects strictly match the **partial** interfaces above.
- Canonical fields are full-form; acronyms/shortenings live in \`pseudonyms\`.
- No extra fields beyond the partial schema.
- JSON is valid; no comments/trailing commas; UTF-8 safe; Australian English.

RESPONSE RULE
Return ONLY the final JSON object specified in OUTPUT.
`;
export default PROMPT_02_TO_03;

