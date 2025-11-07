import path from "node:path";
import { getFilesInFolder, readFile as readTextFile, saveFile } from "../lib/fileUtils.js";
import { processFileWithOpenAI } from "../lib/processor.js";

export interface ProcessResult {
    processed: number;
    skipped: number;
    errors: Array<{ file: string; error: string }>;
}

/**
 * Process all markdown files from inputFolder through OpenAI and save to outputFolder.
 * Files are processed sequentially (one at a time).
 */
export async function processStep(inputFolder: string, outputFolder: string, prompt: string): Promise<ProcessResult> {
    const files = await getFilesInFolder(inputFolder, "**/*.md");
    let processed = 0;
    let skipped = 0;
    const errors: Array<{ file: string; error: string }> = [];

    for (const file of files) {
        const fileName = path.basename(file);
        try {
            const content = await readTextFile(file);
            if (!content || !content.trim()) {
                skipped += 1;
                continue;
            }
            const result = await processFileWithOpenAI(content, prompt);
            await saveFile(outputFolder, fileName, result);
            processed += 1;
        } catch (e: any) {
            errors.push({ file: fileName, error: e?.message ?? String(e) });
        }
    }

    return { processed, skipped, errors };
}


