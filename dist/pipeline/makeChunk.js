import { CHUNK_PROMPT } from "../prompts.js";
import { makeLLM } from "../lib/llm.js";
export async function makeChunk(text, docType, source, id) {
    const llm = makeLLM();
    const json = await llm(CHUNK_PROMPT(docType, source) + "\n\n---\n" + text.slice(0, 6000));
    const chunk = {
        id,
        doc_type: docType,
        source,
        version: "0.1.0",
        last_reviewed: new Date().toISOString().slice(0, 10),
        question: json.question?.trim() ?? "",
        answer: json.answer?.trim() ?? "",
        tip: json.tip?.trim() || "",
        why_when: json.why_when?.trim() || "",
        keywords: Array.isArray(json.keywords) ? json.keywords : [],
        prerequisites: json.prerequisites?.trim() || "",
        safety: json.safety?.trim() || "",
        troubleshooting: json.troubleshooting?.trim() || "",
        escalate_when: json.escalate_when?.trim() || "",
    };
    return chunk;
}
//# sourceMappingURL=makeChunk.js.map