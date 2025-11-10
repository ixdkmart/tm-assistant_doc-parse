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

export interface ProcessStepOptions {
    outputMode?: "single" | "objects";
    perDocSubfolder?: boolean;
}

/**
 * Process all markdown files from inputFolder through OpenAI and save to outputFolder.
 * Files are processed sequentially (one at a time).
 */
export async function processStep(
    inputFolder: string,
    outputFolder: string,
    prompt: string,
    options?: ProcessStepOptions
): Promise<ProcessResult> {
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
            if (options?.outputMode === "objects") {
                const jsonText = extractJsonText(result);
                let parsed: any;
                try {
                    parsed = JSON.parse(jsonText);
                } catch (err: any) {
                    throw new Error(`Invalid JSON from model for ${fileName}: ${err?.message ?? String(err)}`);
                }
                if (!parsed || !Array.isArray(parsed.objects)) {
                    throw new Error(`Model output missing 'objects' array for ${fileName}.`);
                }
                for (const [idx, obj] of (parsed.objects as any[]).entries()) {
                    const fileBase = makeObjectFilenameBase(obj);
                    const outName = `${fileBase}.json`;
                    await saveFile(outputFolder, outName, JSON.stringify(obj, null, 2));
                    processed += 1;
                }
            } else {
                await saveFile(outputFolder, fileName, result);
                processed += 1;
            }
        } catch (e: any) {
            errors.push({ file: fileName, error: e?.message ?? String(e) });
        }
        bar.increment();
    }
    bar.stop();
    return { processed, skipped, errors };
}

function extractJsonText(s: string): string {
    const trimmed = s.trim();
    if (trimmed.startsWith("```")) {
        const first = trimmed.indexOf("```");
        const last = trimmed.lastIndexOf("```");
        if (last > first) {
            // remove optional language hint after opening fence
            const inner = trimmed.slice(first + 3, last).replace(/^[a-zA-Z0-9_-]*\n/, "");
            return inner.trim();
        }
    }
    return trimmed;
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .replace(/_+/g, "_");
}

function makeObjectFilenameBase(obj: any): string {
    const type = typeof obj?.type === "string" ? obj.type.toLowerCase() : "object";
    let nameSource = "";
    if (type === "definition") nameSource = obj?.term ?? "";
    else if (type === "procedure") nameSource = obj?.title ?? "";
    else if (type === "entity") nameSource = obj?.name ?? "";
    const slug = slugify(String(nameSource || "item"));
    return `${type}_${slug}`;
}


