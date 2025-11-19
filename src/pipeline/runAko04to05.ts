import path from "node:path";
import fs from "node:fs/promises";
// @ts-ignore
import cliProgress from "cli-progress";
import { getFilesInFolder, readFile as readTextFile, saveFile, fileExists, getCheckpointPath, readCheckpoint, writeCheckpoint, appendErrorEntry } from "../lib/fileUtils.js";
import { processFileWithOpenAI } from "../lib/processor.js";
import { config } from "../config.js";
import PROMPT_04_TO_05, { FIELD_GUIDANCE } from "./prompts/prompt-04-to-05.js";
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

function dedupePreserveOrder<T extends string>(values: T[]): T[] {
    const seen = new Set<string>();
    const out: T[] = [];
    for (const v of values) {
        const k = v.trim();
        if (!k) continue;
        const lc = k.toLowerCase();
        if (seen.has(lc)) continue;
        seen.add(lc);
        out.push(v);
    }
    return out;
}

function extractJsonArray(text: string): string[] {
    try {
        const trimmed = text.trim();
        // Try to extract from code fences
        const fenceMatch = trimmed.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/i);
        if (fenceMatch && fenceMatch[1]) {
            const parsed = JSON.parse(fenceMatch[1]);
            if (Array.isArray(parsed)) {
                return parsed.filter((item): item is string => typeof item === "string");
            }
        }
        // Try to find JSON array directly
        const firstBracket = trimmed.indexOf("[");
        const lastBracket = trimmed.lastIndexOf("]");
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            const jsonStr = trimmed.slice(firstBracket, lastBracket + 1);
            const parsed = JSON.parse(jsonStr);
            if (Array.isArray(parsed)) {
                return parsed.filter((item): item is string => typeof item === "string");
            }
        }
        // Try parsing the whole thing
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            return parsed.filter((item): item is string => typeof item === "string");
        }
    } catch {
        // If parsing fails, return empty array
    }
    return [];
}

function fillPrompt(akoJson: string, additionalSource: string, fieldName: string): string {
    const fieldGuidance = FIELD_GUIDANCE[fieldName] || `Extract relevant information for the "${fieldName}" field.`;
    return PROMPT_04_TO_05
        .replaceAll("{{AKO_JSON}}", akoJson)
        .replaceAll("{{ADDITIONAL_SOURCE}}", additionalSource)
        .replaceAll("{{FIELD_NAME}}", fieldName)
        .replaceAll("{{FIELD_GUIDANCE}}", fieldGuidance);
}

// Define enrichable fields per AKO type (exclude type, term, definition, keywords)
const ENRICHABLE_FIELDS: Record<AkoType, string[]> = {
    concept: ["pseudonyms", "additionalInfo", "examples", "caveats"],
    procedure: ["pseudonyms", "additionalInfo", "examples", "bestPractice", "caveats", "constraints", "troubleshooting", "metrics"],
    entity: ["pseudonyms", "additionalInfo", "bestPractice", "troubleshooting", "constraints", "caveats"],
};

function mergeFieldArrays(base: string[], newValues: string[]): string[] {
    return dedupePreserveOrder([...base, ...newValues]);
}

async function enrichAkoWithDocument(
    ako: AtomicKnowledgeObject,
    docText: string,
    enrichableFields: string[]
): Promise<Partial<Record<string, string[]>>> {
    const fieldResults: Record<string, string[]> = {};
    const akoJson = JSON.stringify(ako, null, 2);

    for (const fieldName of enrichableFields) {
        try {
            const prompt = fillPrompt(akoJson, docText, fieldName);
            const modelOut = await processFileWithOpenAI("", prompt, undefined, config.modelComplex);
            const snippets = extractJsonArray(modelOut);
            // Filter out empty strings and trim
            const filtered = snippets
                .map(s => s.trim())
                .filter(s => s.length > 0);
            fieldResults[fieldName] = filtered;
        } catch (e) {
            // On error for a field, just use empty array
            fieldResults[fieldName] = [];
        }
    }

    return fieldResults;
}

function applyEnrichmentToAko(
    base: AtomicKnowledgeObject,
    enrichment: Partial<Record<string, string[]>>
): AtomicKnowledgeObject {
    if (base.type === "concept") {
        const ako = base as Concept;
        return {
            ...ako,
            pseudonyms: mergeFieldArrays(ako.pseudonyms ?? [], enrichment.pseudonyms ?? []),
            keywords: mergeFieldArrays(ako.keywords ?? [], enrichment.keywords ?? []),
            additionalInfo: mergeFieldArrays(ako.additionalInfo ?? [], enrichment.additionalInfo ?? []),
            examples: mergeFieldArrays(ako.examples ?? [], enrichment.examples ?? []),
            caveats: mergeFieldArrays(ako.caveats ?? [], enrichment.caveats ?? []),
        };
    }
    if (base.type === "procedure") {
        const ako = base as Procedure;
        return {
            ...ako,
            pseudonyms: mergeFieldArrays(ako.pseudonyms ?? [], enrichment.pseudonyms ?? []),
            keywords: mergeFieldArrays(ako.keywords ?? [], enrichment.keywords ?? []),
            additionalInfo: mergeFieldArrays(ako.additionalInfo ?? [], enrichment.additionalInfo ?? []),
            examples: mergeFieldArrays(ako.examples ?? [], enrichment.examples ?? []),
            bestPractice: mergeFieldArrays(ako.bestPractice ?? [], enrichment.bestPractice ?? []),
            caveats: mergeFieldArrays(ako.caveats ?? [], enrichment.caveats ?? []),
            constraints: mergeFieldArrays(ako.constraints ?? [], enrichment.constraints ?? []),
            troubleshooting: mergeFieldArrays(ako.troubleshooting ?? [], enrichment.troubleshooting ?? []),
            metrics: mergeFieldArrays(ako.metrics ?? [], enrichment.metrics ?? []),
        };
    }
    // entity
    const ako = base as Entity;
    return {
        ...ako,
        pseudonyms: mergeFieldArrays(ako.pseudonyms ?? [], enrichment.pseudonyms ?? []),
        keywords: mergeFieldArrays(ako.keywords ?? [], enrichment.keywords ?? []),
        additionalInfo: mergeFieldArrays(ako.additionalInfo ?? [], enrichment.additionalInfo ?? []),
        bestPractice: mergeFieldArrays(ako.bestPractice ?? [], enrichment.bestPractice ?? []),
        troubleshooting: mergeFieldArrays(ako.troubleshooting ?? [], enrichment.troubleshooting ?? []),
        constraints: mergeFieldArrays(ako.constraints ?? [], enrichment.constraints ?? []),
        caveats: mergeFieldArrays(ako.caveats ?? [], enrichment.caveats ?? []),
    };
}

export async function runAko04to05(
    akosFolder: string,
    cleanedDocsFolder: string,
    outputFolder: string
): Promise<ProcessResult> {
    if (!config.modelComplex) {
        throw new Error("LLM_MODEL_COMPLEX environment variable is required for enrichment step.");
    }
    const akoFiles = await getFilesInFolder(akosFolder, "**/*.json");
    const docFiles = await getFilesInFolder(cleanedDocsFolder, "**/*.md");

    // Preload documents
    const docs: Array<{ file: string; text: string }> = [];
    for (const f of docFiles) {
        try {
            const t = await readTextFile(f);
            if (t && t.trim()) {
                docs.push({ file: f, text: t });
            }
        } catch {
            // ignore
        }
    }

    await fs.mkdir(outputFolder, { recursive: true });
    
    // Checkpoint tracking
    const checkpointPath = getCheckpointPath(outputFolder, "_processed-summary.ndjson");
    let processedFiles: Set<string> = await readCheckpoint(checkpointPath);
    
    // Error summary file path
    const errorSummaryPath = path.join(outputFolder, "_error-summary.ndjson");
    
    const bar = new cliProgress.SingleBar(
        { format: "ENRICH 04→05 {bar} {value}/{total} | ETA: {eta_formatted} | File: {file}", hideCursor: true },
        cliProgress.Presets.shades_classic
    );
    bar.start(akoFiles.length, 0, { file: "" });

    let processed = 0;
    let skipped = 0;
    const errors: Array<{ file: string; error: string }> = [];

    for (const akoPath of akoFiles) {
        const fileName = path.basename(akoPath);
        try {
            bar.update({ file: fileName });
            
            // Checkpoint: Skip already processed AKO files
            if (processedFiles.has(fileName)) {
                const outputFilePath = path.join(outputFolder, fileName);
                if (await fileExists(outputFilePath)) {
                    // Check if file has content
                    try {
                        const existingContent = await fs.readFile(outputFilePath, "utf8");
                        if (existingContent && existingContent.trim()) {
                            console.log(`[checkpoint] Skipping already enriched: ${fileName}`);
                            skipped += 1;
                            bar.increment();
                            continue;
                        }
                    } catch {
                        // File exists but can't read it, reprocess
                    }
                }
            }
            
            const jsonText = await fs.readFile(akoPath, "utf8");
            const base: AtomicKnowledgeObject = JSON.parse(jsonText);
            const baseType: AkoType = base.type;
            if (baseType !== "concept" && baseType !== "procedure" && baseType !== "entity") {
                skipped += 1;
                bar.increment();
                continue;
            }

            // Get enrichable fields for this AKO type
            const enrichableFields = ENRICHABLE_FIELDS[baseType];
            let current = base;

            // For each document, enrich all fields
            for (const doc of docs) {
                try {
                    const fieldResults = await enrichAkoWithDocument(current, doc.text, enrichableFields);
                    current = applyEnrichmentToAko(current, fieldResults);
                } catch (e) {
                    // skip doc on error, continue with next document
                    continue;
                }
            }

            await saveFile(outputFolder, fileName, JSON.stringify(current, null, 2));
            processed += 1;
            // Mark file as processed in checkpoint
            processedFiles.add(fileName);
            await writeCheckpoint(checkpointPath, processedFiles);
        } catch (e: any) {
            // Dump full error object for diagnostics
            console.error('[runAko04to05] Error processing', fileName, ':', e);
            const errorMessage = e?.message ?? String(e);
            errors.push({ file: fileName, error: errorMessage });
            // Write error to error summary file
            await appendErrorEntry(errorSummaryPath, fileName, errorMessage);
        }
        bar.increment();
    }
    bar.stop();
    return { processed, skipped, errors };
}
