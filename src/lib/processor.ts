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
export async function processFileWithOpenAI(
    content: string,
    prompt: string,
    systemPrompt?: string
): Promise<string> {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = config.model;
    
    // Validate model name (common invalid models)
    if (model === "gpt-5") {
        console.warn(`[processor] Warning: "gpt-5" is not a valid OpenAI model. Common valid models: gpt-4o, gpt-4-turbo, gpt-3.5-turbo`);
    }
    
    // Combine the prompt with the content
    const fullPrompt = `${prompt}\n\n---\n\n${content}`;
    
    // Estimate tokens for rate limiting (rough estimate)
    const approxTokens = Math.min(6000, Math.max(800, Math.floor(fullPrompt.length / 3)));
    
    // Enforce rate limiting and budget constraints
    await enforceRateAndBudget({ approxTokens });
    
    // Default system prompt if not provided
    const defaultSystemPrompt = systemPrompt ?? "You are a helpful assistant that processes and transforms content according to user instructions.";
    
    // Call OpenAI API (gpt-5: do not send temperature; defaults are enforced)
    let resp;
    try {
        resp = await client.chat.completions.create({
            model,
            messages: [
                { role: "system", content: defaultSystemPrompt },
                { role: "user", content: fullPrompt },
            ],
        });
    } catch (err: any) {
        // Dump full error object for diagnostics
        console.error('[processor] OpenAI API error:', err);
        
        const msg = err?.message ?? String(err);
        if (typeof msg === "string" && (msg.includes("Unsupported value") || msg.toLowerCase().includes("temperature"))) {
            throw new Error(`${msg} Hint: This model enforces default sampling and does not accept 'temperature'.`);
        }
        
        // Re-throw the original error to preserve all details
        throw err;
    }
    
    const processedContent = resp.choices[0]?.message?.content ?? "";
    return processedContent;
}

