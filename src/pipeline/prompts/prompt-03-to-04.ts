const PROMPT_03_TO_04 = `
You are an Atomic Knowledge Enricher. Expand a single Atomic Knowledge Object (AKO) using ONLY the provided cleaned document. Do NOT invent new policy, steps, rights, or legal interpretations. If the document does not support any additions, return the original AKO unchanged.

INPUTS
AKO (existing, minimal or partially enriched):
{{AKO_JSON}}

CLEANED_DOCUMENT (the full cleaned markdown for this AKO’s source or a related doc):
---
{{CLEANED_MARKDOWN}}
---

SCHEMA (what you may output — pick exactly the matching type)
Definition {
  type: "definition";
  term: string;
  definition: string;
  pseudonyms: string[];
  keywords: string[];
  examples?: string[];
  caveats?: string[];
}

Procedure {
  type: "procedure";
  title: string;
  pseudonyms: string[];
  keywords: string[];
  steps: string[];
  examples?: string[];
  bestPractice?: string[];
  caveats?: string[];
  constraints?: string[];
  troubleshooting?: string[];
  metrics?: string[];
}

Entity {
  type: "entity";
  name: string;
  description?: string;
  pseudonyms: string[];
  keywords: string[];
  troubleshooting?: string[];
  constraints?: string[];
  caveats?: string[];
  bestPractice?: string[];
}

ENRICHMENT RULES
- Use ONLY content present in CLEANED_DOCUMENT. No outside knowledge. No invention.
- Preserve explicit legal/procedural wording verbatim when present.
- Keep AU/NZ spelling found in the document (e.g., behaviour, organisation).
- Do not change the AKO’s core identity (term/title/name).
- **For Entity.description and Definition.definition: keep meaning at the identity level. Do NOT narrow the meaning to a single context or task. If the document only presents a task-specific responsibility, add it to bestPractice, caveats, examples, or constraints instead.**
- Fill optional fields ONLY when the document explicitly supports them.

PSEUDONYMS
- Add only naturally interchangeable phrases already used in workplace/legal contexts:
  • word-form variants, plain-language equivalents, recognised abbreviations (e.g., “Sex Discrimination Act 1984” → “SDA 1984”)
- Do NOT add slang, nicknames, hierarchy implications, or invented acronyms.
- If none apply, keep [].

KEYWORDS
- 8–15 concise search terms drawn from the document (actors, objects, actions, locations, laws, thresholds).
- Respect locale spelling. No slang or invented terms.

PROCEDURE STEP HYGIENE
- Keep the original order of steps from the AKO.
- Remove tautologies that only restate the title.
- Remove meta/filler lines (“Follow this procedure.”).
- Keep concrete, imperative actions. Do NOT add new steps.

OPTIONAL FIELDS (only if explicitly supported by the document)
- examples: short, realistic examples mentioned or clearly shown.
- bestPractice: explicit recommendations.
- caveats: explicit warnings/exceptions.
- constraints: explicit requirements/eligibility/limits.
- troubleshooting: explicit issues + remedies.
- metrics: explicit numeric thresholds/limits with units (e.g., “BAC > 0.00%”).

OUTPUT
- Return ONE JSON object only (the enriched AKO), exactly matching the corresponding schema above.
- Do NOT include arrays/wrappers beyond the AKO. No commentary. No code fences.
- If nothing can be enriched, return the input AKO unchanged.

`;
export default PROMPT_03_TO_04;


