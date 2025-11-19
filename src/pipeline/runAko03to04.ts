import path from "node:path";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
// @ts-ignore
import cliProgress from "cli-progress";
import readline from "node:readline";
import { saveFile, fileExists, getCheckpointPath, readCheckpoint, writeCheckpoint, appendErrorEntry } from "../lib/fileUtils.js";
import type { ProcessResult } from "./processStep.js";

type AkoType = "concept" | "procedure" | "entity";

export interface Concept {
    type: "concept";
    term: string;
    definition: string;
    pseudonyms: string[];
    keywords: string[];
    additionalInfo?: string[];
    examples?: string[];
    caveats?: string[];
}

export interface Procedure {
    type: "procedure";
    title: string;
    pseudonyms: string[];
    keywords: string[];
    steps: string[];
    additionalInfo?: string[];
    examples?: string[];
    bestPractice?: string[];
    caveats?: string[];
    constraints?: string[];
    troubleshooting?: string[];
    metrics?: string[];
}

export interface Entity {
    type: "entity";
    name: string;
    description?: string;
    pseudonyms: string[];
    keywords: string[];
    additionalInfo?: string[];
    bestPractice?: string[];
    troubleshooting?: string[];
    constraints?: string[];
    caveats?: string[];
}

export type AtomicKnowledgeObject = Concept | Procedure | Entity;

function slugify(input: string): string {
    return String(input)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function canonicalIdentity(obj: AtomicKnowledgeObject): string {
    if (obj.type === "concept") {
        return String(obj.term ?? "").trim().toLowerCase();
    }
    if (obj.type === "entity") {
        return String(obj.name ?? "").trim().toLowerCase();
    }
    // procedure
    return String(obj.title ?? "").trim().toLowerCase();
}

function convertToExpandedSchema(obj: any): AtomicKnowledgeObject | null {
    if (!obj || typeof obj !== "object" || !obj.type) return null;
    
    const type = obj.type;
    
    if (type === "concept") {
        if (!obj.term || !obj.definition) return null;
        return {
            type: "concept",
            term: String(obj.term),
            definition: String(obj.definition),
            pseudonyms: Array.isArray(obj.pseudonyms) ? obj.pseudonyms : [],
            keywords: [],
            additionalInfo: Array.isArray(obj.additionalInfo) ? obj.additionalInfo : [],
            examples: [],
            caveats: [],
        };
    }
    
    if (type === "procedure") {
        if (!obj.title) return null;
        return {
            type: "procedure",
            title: String(obj.title),
            pseudonyms: Array.isArray(obj.pseudonyms) ? obj.pseudonyms : [],
            keywords: [],
            steps: Array.isArray(obj.steps) ? obj.steps : [],
            additionalInfo: Array.isArray(obj.additionalInfo) ? obj.additionalInfo : [],
            examples: [],
            bestPractice: [],
            caveats: [],
            constraints: [],
            troubleshooting: [],
            metrics: [],
        };
    }
    
    if (type === "entity") {
        if (!obj.name) return null;
        return {
            type: "entity",
            name: String(obj.name),
            description: typeof obj.description === "string" ? obj.description : undefined,
            pseudonyms: Array.isArray(obj.pseudonyms) ? obj.pseudonyms : [],
            keywords: [],
            additionalInfo: Array.isArray(obj.additionalInfo) ? obj.additionalInfo : [],
            bestPractice: [],
            troubleshooting: [],
            constraints: [],
            caveats: [],
        };
    }
    
    return null;
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

export async function runAko03to04(
    akosFolder: string,
    _cleanedDocsFolder: string,
    outputFolder: string,
    _localeHint: string = "AU"
): Promise<ProcessResult> {
    const ndjsonPath = path.join(akosFolder, "akos.ndjson");
    const outFolder = outputFolder;
    await fs.mkdir(outFolder, { recursive: true });
    
    // Checkpoint tracking
    const checkpointPath = getCheckpointPath(outFolder, "_processed-summary.ndjson");
    let processedFiles: Set<string> = await readCheckpoint(checkpointPath);
    
    // Error summary file path
    const errorSummaryPath = path.join(outFolder, "_error-summary.ndjson");
    
    // Read NDJSON stream
    const stream = createReadStream(ndjsonPath, { encoding: "utf8" });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    
    let processed = 0;
    let skipped = 0;
    const errors: Array<{ file: string; error: string }> = [];
    
    const bar = new cliProgress.SingleBar(
        { format: "FORMAT 03→04 {bar} {value} lines | ETA: {eta_formatted}", hideCursor: true },
        cliProgress.Presets.shades_classic
    );
    bar.start(0, 0);
    
    let lineNumber = 0;
    for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) {
            bar.increment();
            continue;
        }
        lineNumber += 1;
        
        try {
            const parsed = JSON.parse(trimmed);
            const converted = convertToExpandedSchema(parsed);
            
            if (!converted) {
                skipped += 1;
                bar.increment();
                continue;
            }
            
            // Generate filename based on type and canonical identity
            const canonical = canonicalIdentity(converted);
            const baseFileName = `${converted.type}_${slugify(canonical)}.json`;
            const fileName = await generateUniqueFileName(outFolder, baseFileName);
            
            // Checkpoint: Skip already processed files
            if (processedFiles.has(fileName)) {
                const outputFilePath = path.join(outFolder, fileName);
                if (await fileExists(outputFilePath)) {
                    try {
                        const existingContent = await fs.readFile(outputFilePath, "utf8");
                        if (existingContent && existingContent.trim()) {
                            skipped += 1;
                            bar.increment();
                            continue;
                        }
                    } catch {
                        // File exists but can't read it, reprocess
                    }
                }
            }
            
            // Save the converted AKO
            await saveFile(outFolder, fileName, JSON.stringify(converted, null, 2));
            processed += 1;
            
            // Mark file as processed in checkpoint
            processedFiles.add(fileName);
            await writeCheckpoint(checkpointPath, processedFiles);
            
        } catch (e: any) {
            // Dump full error object for diagnostics
            console.error('[runAko03to04] Error processing line', lineNumber, ':', e);
            const errorMessage = e?.message ?? String(e);
            errors.push({ file: `line-${lineNumber}`, error: errorMessage });
            // Write error to error summary file
            await appendErrorEntry(errorSummaryPath, `line-${lineNumber}`, errorMessage);
        }
        
        bar.increment();
    }
    
    bar.stop();
    
    // Final log
    console.log(JSON.stringify({ stage: "format", input_lines: lineNumber, outputs_written: processed, skipped, errors: errors.length }));
    
    return { processed, skipped, errors };
}
