import OpenAI from "openai";
import { config } from "../config.js";
import { enforceRateAndBudget } from "./rate.js";
/**
 * Process file content through OpenAI with customizable prompt
 * @param content - The file content to process
 * @param prompt - The user prompt/instruction for processing
 * @param systemPrompt - Optional system prompt (defaults to a generic instruction)
 * @returns Processed content as string
 */
export async function processFileWithOpenAI(content, prompt, systemPrompt) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = config.model;
    // Combine the prompt with the content
    const fullPrompt = `${prompt}\n\n---\n\n${content}`;
    // Estimate tokens for rate limiting (rough estimate)
    const approxTokens = Math.min(6000, Math.max(800, Math.floor(fullPrompt.length / 3)));
    // Enforce rate limiting and budget constraints
    await enforceRateAndBudget({ approxTokens });
    // Default system prompt if not provided
    const defaultSystemPrompt = systemPrompt ?? "You are a helpful assistant that processes and transforms content according to user instructions.";
    // Call OpenAI API
    const resp = await client.chat.completions.create({
        model,
        messages: [
            { role: "system", content: defaultSystemPrompt },
            { role: "user", content: fullPrompt },
        ],
        temperature: 0.2,
    });
    const processedContent = resp.choices[0]?.message?.content ?? "";
    return processedContent;
}
//# sourceMappingURL=processor.js.map