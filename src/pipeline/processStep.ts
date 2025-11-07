import path from "node:path";
// @ts-ignore
import cliProgress from "cli-progress";
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
    const bar = new cliProgress.SingleBar(
        { format: "Step {bar} {value}/{total} | ETA: {eta_formatted} | File: {file}", hideCursor: true },
        cliProgress.Presets.shades_classic
    );
    bar.start(files.length, 0, { file: "" });
    let processed = 0;
    let skipped = 0;
    const errors: Array<{ file: string; error: string }> = [];

    for (const file of files) {
        const fileName = path.basename(file);
        try {
            bar.update({ file: fileName });
            const content = await readTextFile(file);
            if (!content || !content.trim()) {
                skipped += 1;
                bar.increment();
                continue;
            }
            const result = await processFileWithOpenAI(content, prompt);
            await saveFile(outputFolder, fileName, result);
            processed += 1;
        } catch (e: any) {
            errors.push({ file: fileName, error: e?.message ?? String(e) });
        }
        bar.increment();
    }
    bar.stop();
    return { processed, skipped, errors };
}


