const PROMPT_02_TO_03 = `
ROLE
You read ONE cleaned markdown document and extract every distinct Concept, Procedure, and Entity that is clearly described in THIS document only. 
For each AKO found, output EXACTLY ONE JSON object PER LINE (NDJSON). 
Do NOT merge with previous documents. 
Do NOT dedupe across occurrences. 
Do NOT infer, summarize, paraphrase, or enrich.

No arrays of objects.
No wrapper objects.
No code fences.
No commentary.

SCHEMAS (use exact keys only)

Concept:
{
  "type": "concept",
  "term": string,
  "definition": string,
  "pseudonyms": string[],
  "additionalInfo"?: string[]
}

Procedure:
{
  "type": "procedure",
  "title": string,
  "pseudonyms": string[],
  "steps": string[],
  "additionalInfo"?: string[]
}

Entity:
{
  "type": "entity",
  "name": string,
  "description"?: string,
  "pseudonyms": string[],
  "additionalInfo"?: string[]
}

PSEUDONYM RULES (strict and conservative)

Allowed pseudonyms:
- plural/singular variations
- plain-language equivalents
- commonly-used role/job variants
- well-known abbreviations already in use (e.g., "Sex Discrimination Act 1984" → "SDA 1984")

NOT allowed:
- slang
- invented acronyms
- hierarchy terms ("upper management")
- nicknames
- synonyms that change meaning

If no valid pseudonyms exist → use "pseudonyms": [].

PROCEDURE RULES

1. Only produce a Procedure if the document provides *explicit* action steps.
2. Steps must be short, imperative, and in document order.
3. Do NOT add, reorder, or infer steps.

TITLE CONTEXT RULE:
If the procedure heading is generic (e.g., "What to do", "Next steps"), append the smallest explicit context from the surrounding text to make the title unique.
Use only context that is explicitly stated in the document.

Examples:
"What to do" → "What to do when unsure about breastfeeding in store"
"Next steps" → "Next steps after drug testing"

ENTITY RULES

Create Entities only for:
- physical (or digital) objects, places, or people's roles
- roles (Store Manager, Team Member, Contractor)
- real organisations (Australian Breastfeeding Association)
- real laws/standards (Sex Discrimination Act 1984)
- real named systems/services
- real named objects/tools/resources

Do NOT create Entities from:
- section headings
- generic ideas
- invented terms
- abstract concepts (use Concept instead)

CONCEPT RULES
Create a Concept for documenting and atomising concepts and other abstract things.
Create a Concept only when the document explicitly defines what something *is* or describes an abstract concept.

OUTPUT
For each identified AKO:
Output ONE JSON object PER LINE (NDJSON).
No extra lines. No blank lines. No commas. No merging.

INPUT
--------------------------------
{{RAW_MARKDOWN_TEXT}}
--------------------------------

OUTPUT (NDJSON)
`;
export default PROMPT_02_TO_03;

