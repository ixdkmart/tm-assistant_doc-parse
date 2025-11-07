const PROMPT_02_TO_03 = `
ROLE
You read ONE cleaned markdown document and identify all distinct **Definitions**, **Procedures**, and **Entities** it meaningfully describes. For each identified object, you must emit a JSON object that conforms **exactly** to the AtomicKnowledgeObject interface.

PRINCIPLE (must follow exactly)
1) Read each document in the input folder.
2) Identify Definitions, Procedures, and Entities contained in the document.
3) For each identified object, if a file does not already exist, create it using the required schema.
4) Naming rules (the runner will use these, but your canonical fields must make them possible):
   - Definitions: \`term\` is the **full term** (no acronyms).
   - Procedures: \`title\` is the **formal name** of the procedure.
   - Entities: \`name\` is the **full canonical name** (no acronyms).
5) Files are \`.json\` text files. **The output MUST be like this AtomicKnowledgeObject Below**.
6) If a file already exists (runner concern), ignore and continue.

REFERENCE SCHEMA (you MUST shape each object exactly like one of these)
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

INPUT
SOURCE_DOC:
{
  "doc_name": "{{DOC_NAME}}",
  "doc_path": "{{DOC_PATH}}",
  "text": "{{RAW_MARKDOWN_TEXT}}"
}

DISCOVERY RULES
- **Procedures**: look for imperative “how to / to make a claim / steps / return process” phrasing or checklists.
- **Definitions**: named guarantees/policies/warranties with explicit meaning/scope.
- **Entities**: suppliers, carriers, systems, platforms, or named artefacts (e.g., “Proof of Purchase” as a required document).
- Canonical field (term/title/name) must be **full form (no acronyms)**. Put acronyms/shortenings in \`pseudonyms\`.
- Be conservative: emit an object only if the document provides clear support. Optional fields may be omitted; required arrays must exist (can be empty if truly unknown).

KEYWORDS
- Provide **3–12 concise, lowercase, deduped** keywords per object, derived from the document’s language.
- Prefer noun phrases; include brand/system names when central.

OUTPUT (JSON ONLY)
Return a single JSON object:
{
  "doc": { "name": "{{DOC_NAME}}", "path": "{{DOC_PATH}}" },
  "objects": [ /* array of AtomicKnowledgeObject items exactly matching the reference schema */ ]
}

QUALITY CHECK (perform silently)
- All objects strictly match one of the three interfaces.
- Canonical fields are full-form; acronyms/shortenings are in \`pseudonyms\`.
- Required arrays exist (may be empty if needed).
- Keywords 3–12, lowercase, deduped.
- JSON is valid; no comments/trailing commas; UTF-8 safe.

RESPONSE RULE
Return ONLY the final JSON object specified in OUTPUT.
`;
export default PROMPT_02_TO_03;

