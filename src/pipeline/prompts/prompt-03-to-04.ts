const PROMPT_03_TO_04 = `
ROLE
You produce ONE fully-populated **full-schema Atomic Knowledge Object** for a single focus item (Definition, Procedure, or Entity). Your job is to **gather** and **aggregate** all grounded information related to this item from the provided inputs. Do **not** remove duplicates or resolve conflicts — that occurs later in the deduplication stage.

SCOPE
- You are expanding a **partial identity object** into a **full Atomic Knowledge Object**.
- You may only use information that is **explicitly present** in the provided slices.
- You must not invent, infer, assume, reword meaning, or add new claims.

INPUT
FOCUS_OBJECT (identity only):
- Definition: { "type": "definition", "term": string }
- Procedure: { "type": "procedure", "title": string }
- Entity: { "type": "entity", "name": string }

AGGREGATES:
{
  "cleaning_slices": [ /* zero or more per-doc extracted content blocks */ ],
  "partial_objects": [ /* zero or more partial schema identity objects */ ]
}

TASK
1. Determine whether the focus item is a **definition**, **procedure**, or **entity**.
2. Collect all relevant content about this item from:
   - cleaning_slices
   - partial_objects
3. Populate the appropriate **full-schema fields** for the item type.
4. **Include duplicates if they appear** (deduping will happen later).
5. **Do not summarise or rewrite** — use natural phrasing from the source content, lightly normalised for clarity and full sentences.
6. If no information exists for a field:
   - Required arrays → return an empty array
   - Optional fields → omit them entirely

FULL-SCHEMA OUTPUT (you MUST output exactly one of these shapes)

Definition:
{
  "type": "definition",
  "term": string,
  "definition": string,
  "pseudonyms": string[],
  "keywords": string[],
  "examples"?: string[],
  "caveats"?: string[]
}

Procedure:
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

Entity:
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

NORMALISATION RULES (apply silently)
- Canonical fields (term/title/name): full form, no acronyms.
- Acronyms / alternate labels → go to **pseudonyms**.
- Maintain ordering of **steps** exactly as they appear in the most complete slice.
- If multiple slices contain steps, append additional unique steps **after** the baseline list.
- **Do not** remove repeated phrasing, repeated steps, or conflicting statements.

KEYWORD GENERATION
- Extract 3–12 **grounded** terms that reflect the core subject.
- Lowercase.
- No filler words (e.g., "the", "and", "process").
- Do not guess or create keywords not present in the document language.

STYLE & POLICY
- Australian English.
- Deterministic.
- No hallucination.
- Use only grounded information.
- Do not include provenance or evidence quotes in the final object.

OUTPUT (JSON ONLY)
Return exactly **one** completed full-schema object.
No explanation. No commentary. No surrounding text.
`;
export default PROMPT_03_TO_04;


