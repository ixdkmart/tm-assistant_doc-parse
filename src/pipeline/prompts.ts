import fs from "node:fs/promises";
import path from "node:path";

const PROMPTS_DIR = path.resolve("src/pipeline/prompts");

async function readPromptFile(fileName: string): Promise<string> {
    const p = path.join(PROMPTS_DIR, fileName);
    return fs.readFile(p, "utf8");
}

export async function loadStepPrompt(step: number): Promise<string> {
    switch (step) {
        case 1:
            return readPromptFile("step01.txt");
        case 2:
            return readPromptFile("step02.txt");
        case 3:
            return readPromptFile("step03.txt");
        case 4:
            return readPromptFile("step04.txt");
        case 5:
            return readPromptFile("step05.txt");
        default:
            throw new Error(`Unsupported step: ${step}`);
    }
}


