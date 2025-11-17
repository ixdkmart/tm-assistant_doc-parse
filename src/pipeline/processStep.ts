import path from "node:path";
import fs from "node:fs/promises";
// @ts-ignore
import cliProgress from "cli-progress";
import { getFilesInFolder, readFile as readTextFile, saveFile } from "../lib/fileUtils.js";
import { processFileWithOpenAI } from "../lib/processor.js";

export interface ProcessResult {
    processed: number;
    skipped: number;
    errors: Array<{ file: string; error: string }>;
}

type OutputMode = "single" | "objects";

function slugify(input: string): string {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function jsonEscape(value: string): string {
    // Return JSON-escaped content without surrounding quotes
    const escaped = JSON.stringify(value);
    return escaped.slice(1, escaped.length - 1);
}

function fillPromptTemplate(
    template: string,
    data: { docName: string; docPath: string; text: string }
): string {
    return template
        .replaceAll("{{DOC_NAME}}", jsonEscape(data.docName))
        .replaceAll("{{DOC_PATH}}", jsonEscape(data.docPath))
        .replaceAll("{{RAW_MARKDOWN_TEXT}}", jsonEscape(data.text));
}

function extractJsonObjectBlock(text: string): string {
    const trimmed = text.trim();
    // Handle fenced code blocks ```json ... ```
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
        return fenceMatch[1].trim();
    }
    // Fallback: take substring from first { to last }
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
        return trimmed.slice(first, last + 1);
    }
    // As a last resort, return original (will fail parse upstream with helpful error)
    return trimmed;
}

async function generateUniqueFileName(
    folderPath: string,
    baseName: string
): Promise<string> {
    let name = baseName;
    let counter = 2;
    while (true) {
        try {
            await fs.access(path.join(folderPath, name));
            // exists → try next suffix
            const parts = baseName.split(".json");
            const stem = parts[0] ?? baseName.replace(/\.json$/i, "");
            name = `${stem}-${counter}.json`;
            counter += 1;
        } catch {
            // does not exist → good to use
            return name;
        }
    }
}

/**
 * Process all markdown files from inputFolder through OpenAI and save to outputFolder.
 * Files are processed sequentially (one at a time).
 */
export async function processStep(
    inputFolder: string,
    outputFolder: string,
    prompt: string,
    options?: { outputMode?: OutputMode }
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
    // Prepare NDJSON file if emitting objects mode
    let ndjsonPath: string | undefined;
    if (options?.outputMode === "objects") {
        await fs.mkdir(outputFolder, { recursive: true });
        ndjsonPath = path.join(outputFolder, "akos.ndjson");
        // Truncate or create fresh file at start
        await fs.writeFile(ndjsonPath, "", "utf8");
    }

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
            let result: string;
            if (options?.outputMode === "objects") {
                const fileBaseName = path.basename(file, path.extname(file));
                const filled = fillPromptTemplate(prompt, {
                    docName: fileBaseName,
                    docPath: file,
                    text: content,
                });
                // We already embedded the text into the prompt; pass empty content to avoid duplication.
                result = await processFileWithOpenAI("", filled);
            } else {
                result = await processFileWithOpenAI(content, prompt);
            }
            if (options?.outputMode === "objects") {
                // Accept NDJSON (one JSON object per line), JSON array, or { objects: [...] }
                const objects: any[] = [];
                const raw = result.trim();
                let parsedSuccessfully = false;
                // Try NDJSON
                const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
                if (lines.length > 1) {
                    try {
                        for (const line of lines) {
                            const obj = JSON.parse(line);
                            if (obj && typeof obj === "object") {
                                objects.push(obj);
                            }
                        }
                        if (objects.length > 0) parsedSuccessfully = true;
                    } catch {
                        // fall through
                        objects.length = 0;
                    }
                }
                // Try fenced/wrapper parse if NDJSON didn't work
                if (!parsedSuccessfully) {
                    try {
                        const jsonBlock = extractJsonObjectBlock(raw);
                        const parsed = JSON.parse(jsonBlock);
                        if (Array.isArray(parsed)) {
                            objects.push(...parsed);
                            parsedSuccessfully = true;
                        } else if (parsed && Array.isArray(parsed.objects)) {
                            objects.push(...parsed.objects);
                            parsedSuccessfully = true;
                        } else if (parsed && typeof parsed === "object") {
                            objects.push(parsed);
                            parsedSuccessfully = true;
                        }
                    } catch {
                        // ignore; handled below
                    }
                }
                if (!parsedSuccessfully || objects.length === 0) {
                    // Save raw output for debugging
                    const base = path.basename(file, path.extname(file));
                    const errorName = await generateUniqueFileName(path.join(outputFolder, "_errors"), `${base}--raw.txt`);
                    await saveFile(path.join(outputFolder, "_errors"), errorName, raw);
                    throw new Error("Failed to parse model output into objects (saved raw to _errors).");
                }
                for (let i = 0; i < objects.length; i++) {
                    const obj = objects[i];
                    // Append exact JSON (no pretty print) as single line (NDJSON)
                    if (!ndjsonPath) {
                        throw new Error("NDJSON output path not initialized");
                    }
                    await fs.appendFile(ndjsonPath, JSON.stringify(obj) + "\n", "utf8");
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


