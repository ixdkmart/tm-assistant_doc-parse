import OpenAI from "openai";
import { config } from "../config.js";
import { enforceRateAndBudget } from "./rate.js";

export type LLMJson = <T = any>(prompt: string, system?: string) => Promise<T>;

export function makeLLM(): LLMJson {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = config.model;

  return async <T>(prompt: string, system = "You output ONLY strict JSON. No prose."): Promise<T> => {
    // very rough token estimate for budget guard
    const approxTokens = Math.min(6000, Math.max(800, Math.floor(prompt.length / 3)));
    await enforceRateAndBudget({ approxTokens });

    const resp = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = resp.choices[0]?.message?.content ?? "{}";
    return JSON.parse(content) as T;
  };
}
