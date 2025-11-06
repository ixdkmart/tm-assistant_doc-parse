export const CLASSIFY_PROMPT = (sample: string) => `
You are classifying Kmart store documents into:
- guidance
- policy
- procedure
- system (UI/screen)

Return only JSON:
{ "doc_type": "guidance|policy|procedure|system" }

TEXT:
${sample.slice(0, 1500)}
`;

export const CHUNK_PROMPT = (docType: string, source: string) => `
Rewrite the following into ONE atomic, self-contained Q&A chunk for a Kmart team member.

Doc type: ${docType}

Rules:
- One question → one complete answer.
- AU spelling. Sentences ≤ 18 words.
- Templates by type:
  * procedure: "No worries — here’s how:" then 1–6 numbered steps.
  * policy: IF <condition> → <action> lines with thresholds.
  * guidance: short supportive statements.
  * system: "On the <screen/device>:" then steps that match on-screen labels.
- Include ALL fields (use empty string if truly N/A):
  question, answer, tip, why_when, keywords[],
  prerequisites, safety, troubleshooting, escalate_when
- Store-floor friendly language. No corporate jargon.
- DO NOT reference or quote the source in your answer.

Return STRICT JSON with exactly those keys.

SOURCE (context only): ${source}
`;
