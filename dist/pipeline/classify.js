import { makeLLM } from "../lib/llm.js";
import { CLASSIFY_PROMPT } from "../prompts.js";
import { DocType } from "../types.js";
export async function classifyText(sample) {
    // quick heuristic to reduce mistakes before LLM confirmation
    const lower = sample.toLowerCase();
    let guess = { doc_type: "procedure" };
    if (/policy|eligibility|compliance|must|required|if.*then/.test(lower))
        guess = { doc_type: "policy" };
    if (/welcome|buddy|culture|values|behaviou?r|tone/.test(lower))
        guess = { doc_type: "guidance" };
    if (/screen|register|pos|handheld|ui|click|select|tap/.test(lower))
        guess = { doc_type: "system" };
    const llm = makeLLM();
    const json = await llm(CLASSIFY_PROMPT(sample));
    const doc_type = json?.doc_type ? DocType.parse(json.doc_type) : guess.doc_type;
    return { doc_type };
}
//# sourceMappingURL=classify.js.map