import { CHUNK_PROMPT } from "../prompts.js";
import { makeLLM } from "../lib/llm.js";
import { Chunk } from "../types.js";

export async function makeChunk(
  text: string,
  docType: string,
  source: string,
  id: string
): Promise<Chunk> {
  const llm = makeLLM();
  const json = await llm<{
    question: string;
    answer: string;
    tip?: string;
    why_when?: string;
    keywords?: string[];
    prerequisites?: string;
    safety?: string;
    troubleshooting?: string;
    escalate_when?: string;
  }>(CHUNK_PROMPT(docType, source) + "\n\n---\n" + text.slice(0, 6000));

  const chunk: Chunk = {
    id,
    doc_type: docType as any,
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
