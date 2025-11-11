const PROMPT_03_TO_04 = `
You are the MERGE step.

You receive a list of AKO occurrences that all refer to the SAME concept (already grouped by type and canonical identity). Your job is to produce ONE canonical, schema-pure AKO (pre-enrichment) that is safe for compliance review.

DO NOT hallucinate. DO NOT invent fields. DO NOT merge meanings from different concepts. If identity text is narrow/situational, prefer a broader identity or omit the optional description.

INPUT
- occurrences: an array of JSON objects (each is one AKO occurrence from atomisation) for this single concept only.

OUTPUT
- Exactly ONE JSON object (no arrays, no wrapper, no commentary).
- Use the expanded AKO schema below for the detected type.
- Enrichment fields MUST be present as empty arrays (enrichment happens later).
- Preserve original casing for chosen canonical identity fields and pseudonyms.

SCHEMAS (use exact keys only)

Definition:
{
  "type": "definition",
  "term": string,
  "definition": string,
  "pseudonyms": string[],
  "keywords": [],
  "examples": [],
  "caveats": []
}

Procedure:
{
  "type": "procedure",
  "title": string,
  "pseudonyms": string[],
  "keywords": [],
  "steps": string[],
  "examples": [],
  "bestPractice": [],
  "caveats": [],
  "constraints": [],
  "troubleshooting": [],
  "metrics": []
}

Entity:
{
  "type": "entity",
  "name": string,
  "description"?: string,
  "pseudonyms": string[],
  "keywords": [],
  "troubleshooting": [],
  "constraints": [],
  "caveats": [],
  "bestPractice": []
}

MERGE RULES (apply in order)

1) Identity selection (conservative)
- ENTITY.description: choose the most general, role/system-level description. If all candidates are narrow/situational, OMIT description (it is optional).
- DEFINITION.definition: choose the most authoritative phrasing (Legal/Policy/Glossary > Role/System profile > SOP/Guidance > Training/FAQ/Poster). Must explicitly define what the term is.
- PROCEDURE.steps: select one complete step set from the most authoritative occurrence; keep steps in the original order. DO NOT blend or invent steps.

2) Union lists
- Always union+dedupe "pseudonyms". Preserve original casing from the first seen valid variant.
- Leave all enrichment arrays as empty lists: keywords/examples/bestPractice/caveats/constraints/troubleshooting/metrics.

3) TITLE CONTEXT RULE (procedures only)
- If a title is generic (e.g., "What to do", "Next steps", "Procedure", "Process"), append the smallest explicit context phrase found verbatim in the occurrences to make the title uniquely meaningful.
- Example: "What to do" → "What to do when unsure about breastfeeding in store".
- Do NOT invent context or change meaning.

4) Pseudonym rules (strict)
Allowed:
- singular/plural variants
- plain-language equivalents that are naturally interchangeable
- commonly used role/job variants
- well-known existing abbreviations (e.g., "Sex Discrimination Act 1984" → "SDA 1984")
NOT allowed:
- slang, nicknames, invented acronyms, vague hierarchy terms ("upper management"), or synonyms that alter meaning
If none apply, use "pseudonyms": [].

5) Guardrails
- All occurrences are already the same type and canonical identity. If any occurrence clearly conflicts (e.g., different law year, different system altogether), ignore the conflicting identity text and favor the safest general identity; omit optional description if necessary.
- Do NOT create new meanings or combine distinct concepts.

6) Output constraints
- Output exactly ONE JSON object in the correct schema for its type.
- No extra fields. No commentary. No provenance inside the object.
- Enrichment fields must be present as empty arrays.

QUALITY CHECK BEFORE YOU RETURN
- Is the identity broad and compliant (non-situational)? If not, omit description (entities) or pick the authoritative phrasing (definitions).
- Are steps imperative, ordered, and taken directly from one occurrence (procedures)?
- Are pseudonyms valid per the rules and deduped?
- Are all enrichment arrays present and empty?

Now produce the single merged AKO object.

`;
export default PROMPT_03_TO_04;


