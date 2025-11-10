const PROMPT_02_TO_03 = `
ROLE
You read ONE cleaned markdown document and identify all distinct Definitions, Procedures, and Entities that are clearly described. Output ONE JSON object per line (NDJSON). No arrays. No wrapper objects. No code fences. No commentary.

SCHEMAS (exact keys only)

Definition:
{
  "type": "definition",
  "term": string,
  "definition": string
}

Procedure:
{
  "type": "procedure",
  "title": string,
  "pseudonyms": string[],
  "steps": string[]
}

Entity:
{
  "type": "entity",
  "name": string,
  "description"?: string,
  "pseudonyms": string[]
}

PSEUDONYM RULES (critical)
For both Procedures & Entities:
- Generate only **naturally interchangeable workplace language**, NOT new meanings.
- Allowed pseudonyms:
  • singular/plural variations
  • plain-language equivalents
  • commonly used alternative job/role titles
  • abbreviations that are already widely recognized (e.g., "Sex Discrimination Act 1984" → "SDA 1984")
- Do NOT create:
  • slang
  • internal org hierarchy
  • made-up acronyms
  • nicknames
  • synonyms that change meaning
If no true synonyms exist → use: "pseudonyms": [].

Examples of correct pseudonyms:
- "Store Manager" → ["Manager", "Supervisor in charge"]
- "Sex Discrimination Act 1984" → ["SDA 1984"]
- "What to do if you receive a complaint" → ["Responding to a complaint", "Handling breastfeeding complaints"]

Examples of INVALID pseudonyms:
- "Store Manager" → ["Boss", "Leader", "Upper management"]   ← too vague
- "Breastfeeding Rights" → ["Mom power"]                       ← slang (reject)
- "What to do" → ["Procedure A"]                               ← invented label

PROCEDURE RULES
1) Only create a Procedure if **the text provides real action steps**.
2) Steps must be short, imperative, ordered, and taken directly from the document.
3) Do not add, infer, reorder, or interpret steps.

ENTITY RULES
Create Entities *only* for:
- people roles (Store Manager, Team Member, Contractor)
- real organisations (Australian Breastfeeding Association)
- real laws/standards (Sex Discrimination Act 1984)
- real systems or named service providers
Do NOT create Entities for section headings ("What to do", "Introduction").

DEFINITION RULES
Create Definitions only when the document **defines what something is**.

GOOD OUTPUT EXAMPLES

{
  "type": "procedure",
  "title": "What to do",
  "pseudonyms": ["Responding when unsure"],
  "steps": [
    "Seek help from the Store Manager if you are unsure.",
    "Do not ask the person to stop breastfeeding.",
    "Do not ask them to cover themselves.",
    "Do not ask them to move."
  ]
}

{
  "type": "entity",
  "name": "Store Manager",
  "description": "Responsible for providing guidance when team members are uncertain.",
  "pseudonyms": ["Manager", "Supervisor in charge"]
}

{
  "type": "definition",
  "term": "Breastfeeding Rights",
  "definition": "The legal right to breastfeed or express milk anywhere under the Sex Discrimination Act 1984."
}

BAD OUTPUT EXAMPLES (DO NOT PRODUCE)

{"type":"entity","name":"What to do"}   ← heading, not an entity
{"type":"procedure","title":"What to do"}   ← no steps = reject
{"type":"entity","name":"General Safety Policy"}   ← invented
{"type":"definition","term":"Breastfeeding","definition":"Feeding a baby with care"}   ← paraphrased = wrong

INPUT
--------------------------------
{{RAW_MARKDOWN_TEXT}}
--------------------------------

OUTPUT FORMAT
- NDJSON: one JSON object per line
- No code fences
- No commentary
`;
export default PROMPT_02_TO_03;

