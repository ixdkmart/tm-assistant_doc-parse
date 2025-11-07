const PROMPT_04_TO_05 = `
ROLE
You receive ONE full JSON object (already in the full Atomic Knowledge Object schema). Your job is to remove redundant information and merge near-duplicates **within that single object only** while preserving meaning, order, and canonical phrasing. Do not invent facts. Do not add new content.

INPUT
Provide exactly one object in the FULL schema (Definition | Procedure | Entity). Example keys:
- Definition: { type, term, definition, pseudonyms, keywords, examples?, caveats? }
- Procedure: { type, title, pseudonyms, keywords, steps, examples?, bestPractice?, caveats?, constraints?, troubleshooting?, metrics? }
- Entity: { type, name, description?, pseudonyms, keywords, troubleshooting?, constraints?, caveats?, bestPractice? }

GOAL
Return the **same object type** with duplicates removed and near-duplicates merged, plus a concise report of what changed.

DEDUPLICATION RULES (apply silently)
1) **Exact duplicates**: case-insensitive + trimmed string equality → keep one.
2) **Near-duplicates**: if Levenshtein distance ≤ 2 OR one string is a strict prefix of the other OR they differ only by punctuation/plurals → keep the clearer, longer one.
3) **Boilerplate repeats** (e.g., repeated pop-up confirmations / success messages in steps): merge into a single representative step or remove repetitions if they add no execution detail.
4) **Ordering**:
   - Preserve the original order of \`steps\`.
   - When merging step-like near-duplicates, replace the earliest duplicate with the chosen canonical phrasing and remove the later duplicates.
5) **Field-specific guidance**:
   - \`keywords\`: lowercase, trim, singularise when sensible, and dedupe.
   - \`pseudonyms\`: keep distinct, meaningful variants only (drop casing-only differences).
   - \`metrics\`: merge identical values; keep units inline; retain distinct limits/benchmarks.
   - \`bestPractice\`, \`caveats\`, \`constraints\`, \`troubleshooting\`: dedupe per rules (1)–(2); do **not** collapse distinct safety/compliance statements.
6) If a list becomes empty after dedupe, keep it as an empty array (do not remove required keys).
7) Do not cross-check with other objects or documents; scope is **within this one object**.

OUTPUT (JSON ONLY)
{
  "object": { /* the deduped full AKO object, same type as input */ },
  "dedupe_report": {
    "removed_exact": [ { "field": "keywords", "value": "..." } ],
    "merged_similar": [ { "field": "steps", "from": ["A", "A."], "to": "A" } ],
    "notes": [ "Lowercased and trimmed keywords; unified punctuation." ]
  }
}

QUALITY CHECK (perform silently)
- The returned object still conforms to the full AKO schema.
- No meaning lost; procedure steps remain executable and in order.
- No new content introduced; only deduping/merging performed.
- JSON is valid; double quotes; no trailing commas or comments.

RESPONSE RULE
Return ONLY the JSON described in OUTPUT.
`;
export default PROMPT_04_TO_05;


