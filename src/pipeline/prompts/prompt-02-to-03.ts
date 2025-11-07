const PROMPT_02_TO_03 = `
ROLE
You read ONE cleaned markdown document and identify all distinct **Definitions**, **Procedures**, and **Entities** that are clearly described. Your job is to output **identity-only** knowledge objects using the **PARTIAL AtomicKnowledgeObject** schema. You are not extracting steps or details here — only the existence and naming of the objects.

GOAL
Produce a clean list of the objects this document refers to. These objects will be fully expanded later during Overdocumenting. This step is **about identity, not content**.

PRINCIPLES
1) Read the document carefully.
2) Identify each **clearly named** Procedure, Definition, or Entity.
3) Emit **one object per identified item**, using the partial schema.
4) Use the **full, canonical name** for 'term/title/name' (no acronyms or shorthand).
5) Place acronyms, abbreviations, informal names, nicknames, or shorthand forms in **pseudonyms**.
6) If the document clearly describes the role or system in a sentence, you may include a **one-sentence description** (Entities only).
7) Do **not** invent or assume; only include objects that clearly appear in the text.

PARTIAL SCHEMA (your output MUST match exactly)
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
{
  "doc_name": "{{DOC_NAME}}",
  "doc_path": "{{DOC_PATH}}",
  "text": "{{RAW_MARKDOWN_TEXT}}"
}

DISCOVERY GUIDANCE
- **Procedures** are workflows or roles with ongoing actions or responsibilities (e.g., “The role of a buddy”, “How to process returns”).
- **Definitions** are named policies or guarantees where the document states what the term means.
- **Entities** include:
  - Tools / systems (e.g., “Our Learning Hub” → pseudonyms: ["LMS"])
  - Roles (e.g., “Buddy”, “New Starter”)
  - Organisational programs or named artefacts.

INCLUSION RULE
If the document **names** something and provides at least **one meaningful statement** about it, **include it** as an object. This is an **inclusive** step — filtering and consolidation happen later.

OUTPUT (JSON ONLY)
Return exactly:
{
  "doc": { "name": "{{DOC_NAME}}", "path": "{{DOC_PATH}}" },
  "objects": [ /* list of PARTIAL AtomicKnowledgeObject items */ ]
}

QUALITY CHECK (silent)
- No fields beyond the partial schema.
- Canonical names use full form; acronyms go to pseudonyms.
- JSON valid, double quotes only, no trailing commas, Australian English.

RESPONSE RULE
Return ONLY the JSON object.
`;
export default PROMPT_02_TO_03;

