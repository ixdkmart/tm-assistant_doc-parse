import OpenAI from "openai";
import { config } from "../config.js";
import { enforceRateAndBudget, DailyLimitError, MonthlyBudgetError, handleHardLimitError } from "./rate.js";

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
    
    // Default system prompt if not provided
    const defaultSystemPrompt = systemPrompt ?? "You are a helpful assistant that processes and transforms content according to user instructions.";
    
    // Retry loop for LLM errors
    let lastError: any = null;
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            // Enforce rate limiting and budget constraints
            // This may throw DailyLimitError or MonthlyBudgetError which stop the process
            await enforceRateAndBudget({ approxTokens });
            
            // Call OpenAI API (gpt-5: do not send temperature; defaults are enforced)
            const resp = await client.chat.completions.create({
                model,
                messages: [
                    { role: "system", content: defaultSystemPrompt },
                    { role: "user", content: fullPrompt },
                ],
            });
            
            const processedContent = resp.choices[0]?.message?.content ?? "";
            return processedContent;
            
        } catch (err: any) {
            // Handle hard limits (daily/monthly) - these stop the process
            if (err instanceof DailyLimitError || err instanceof MonthlyBudgetError) {
                handleHardLimitError(err);
            }
            
            // Store error for retry or final throw
            lastError = err;
            
            // If this was the last attempt, throw the error
            if (attempt >= config.maxRetries) {
                const msg = err?.message ?? String(err);
                if (typeof msg === "string" && (msg.includes("Unsupported value") || msg.toLowerCase().includes("temperature"))) {
                    throw new Error(`${msg} Hint: This model enforces default sampling and does not accept 'temperature'.`);
                }
                throw err;
            }
            
            // Calculate delay with exponential backoff
            const delayMs = config.retryDelayMs * Math.pow(config.retryBackoffMultiplier, attempt);
            console.error(`[processor] OpenAI API error (attempt ${attempt + 1}/${config.maxRetries + 1}):`, err?.message ?? String(err));
            console.log(`[processor] Retrying in ${delayMs.toFixed(0)}ms...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    
    // This should never be reached, but TypeScript needs it
    throw lastError;
}

