import path from "node:path";
import { processStep } from "./processStep.js";
import PROMPT_01_TO_02 from "./prompts/prompt-01-to-02.js";
import PROMPT_02_TO_03 from "./prompts/prompt-02-to-03.js";
import PROMPT_03_TO_04 from "./prompts/prompt-03-to-04.js";
import PROMPT_04_TO_05 from "./prompts/prompt-04-to-05.js";
import PROMPT_05_TO_06 from "./prompts/prompt-05-to-06.js";

export interface PipelineResult {
    steps: Array<{
        step: number;
        input: string;
        output: string;
        processed: number;
        skipped: number;
        errors: Array<{ file: string; error: string }>;
    }>;
}

export async function runPipeline(basePath: string = "processing"): Promise<PipelineResult> {
    const stepsConfig = [
        { step: 1, input: "01-source", output: "02-clean-out", prompt: PROMPT_01_TO_02 },
        { step: 2, input: "02-clean-out", output: "03-atomisation-out", prompt: PROMPT_02_TO_03 },
        { step: 3, input: "03-atomisation-out", output: "04-document-out", prompt: PROMPT_03_TO_04 },
        { step: 4, input: "04-document-out", output: "05-dedupe-out", prompt: PROMPT_04_TO_05 },
        ///{ step: 5, input: "05-dedupe-out", output: "06-remove-contradictions-out", prompt: PROMPT_05_TO_06 },
    ];

    const results: PipelineResult = { steps: [] };

    for (const cfg of stepsConfig) {
        const inputFolder = path.resolve(basePath, cfg.input);
        const outputFolder = path.resolve(basePath, cfg.output);
        console.log(`\n▶️  Step ${cfg.step}: ${cfg.input} → ${cfg.output}`);
        const res = await processStep(inputFolder, outputFolder, cfg.prompt);
        console.log(`   - Processed: ${res.processed} | Skipped: ${res.skipped} | Errors: ${res.errors.length}`);
        results.steps.push({
            step: cfg.step,
            input: inputFolder,
            output: outputFolder,
            processed: res.processed,
            skipped: res.skipped,
            errors: res.errors,
        });
    }

    return results;
}


