import path from "node:path";
import fs from "node:fs/promises";
// @ts-ignore
import cliProgress from "cli-progress";
import { getFilesInFolder, readFile as readTextFile, saveFile } from "../lib/fileUtils.js";
import { processFileWithOpenAI } from "../lib/processor.js";
import PROMPT_04_TO_05 from "./prompts/prompt-04-to-05.js";
import type { ProcessResult } from "./processStep.js";

type AkoType = "definition" | "procedure" | "entity";

export interface Definition {
    type: "definition";
    term: string;
    definition: string;
    pseudonyms: string[];
    keywords: string[];
    examples?: string[];
    caveats?: string[];
}

export interface Procedure {
    type: "procedure";
    title: string;
    pseudonyms: string[];
    keywords: string[];
    steps: string[];
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
    troubleshooting?: string[];
    constraints?: string[];
    caveats?: string[];
    bestPractice?: string[];
}

export type AtomicKnowledgeObject = Definition | Procedure | Entity;

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

function extractJsonObjectBlock(text: string): string {
    const trimmed = text.trim();
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
        return fenceMatch[1].trim();
    }
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
        return trimmed.slice(first, last + 1);
    }
    return trimmed;
}

function fillPrompt(akoJson: string, cleanedMarkdown: string): string {
    return PROMPT_04_TO_05
        .replaceAll("{{AKO_JSON}}", akoJson)
        .replaceAll("{{CLEANED_MARKDOWN}}", cleanedMarkdown);
}

function coerceSchema(output: any, baseType: AkoType): AtomicKnowledgeObject | null {
    if (!output || typeof output !== "object") return null;
    if (output.type !== baseType) return null;
    if (baseType === "definition") {
        const obj: Definition = {
            type: "definition",
            term: String(output.term ?? ""),
            definition: String(output.definition ?? ""),
            pseudonyms: Array.isArray(output.pseudonyms) ? output.pseudonyms : [],
            keywords: Array.isArray(output.keywords) ? output.keywords : [],
            examples: Array.isArray(output.examples) ? output.examples : [],
            caveats: Array.isArray(output.caveats) ? output.caveats : [],
        };
        if (!obj.term) return null;
        return obj;
    }
    if (baseType === "procedure") {
        const obj: Procedure = {
            type: "procedure",
            title: String(output.title ?? ""),
            pseudonyms: Array.isArray(output.pseudonyms) ? output.pseudonyms : [],
            keywords: Array.isArray(output.keywords) ? output.keywords : [],
            steps: Array.isArray(output.steps) ? output.steps : [],
            examples: Array.isArray(output.examples) ? output.examples : [],
            bestPractice: Array.isArray(output.bestPractice) ? output.bestPractice : [],
            caveats: Array.isArray(output.caveats) ? output.caveats : [],
            constraints: Array.isArray(output.constraints) ? output.constraints : [],
            troubleshooting: Array.isArray(output.troubleshooting) ? output.troubleshooting : [],
            metrics: Array.isArray(output.metrics) ? output.metrics : [],
        };
        if (!obj.title) return null;
        return obj;
    }
    // entity
    const obj: Entity = {
        type: "entity",
        name: String(output.name ?? ""),
        description: typeof output.description === "string" ? output.description : undefined,
        pseudonyms: Array.isArray(output.pseudonyms) ? output.pseudonyms : [],
        keywords: Array.isArray(output.keywords) ? output.keywords : [],
        troubleshooting: Array.isArray(output.troubleshooting) ? output.troubleshooting : [],
        constraints: Array.isArray(output.constraints) ? output.constraints : [],
        caveats: Array.isArray(output.caveats) ? output.caveats : [],
        bestPractice: Array.isArray(output.bestPractice) ? output.bestPractice : [],
    };
    if (!obj.name) return null;
    return obj;
}

function mergeEnrichment(base: AtomicKnowledgeObject, add: AtomicKnowledgeObject): AtomicKnowledgeObject {
    if (base.type !== add.type) return base;
    if (base.type === "definition") {
        const a = base as Definition;
        const b = add as Definition;
        return {
            type: "definition",
            term: a.term, // preserve identity
            definition: a.definition && a.definition.trim().length > 0 ? a.definition : b.definition ?? "",
            pseudonyms: dedupePreserveOrder([...(a.pseudonyms ?? []), ...(b.pseudonyms ?? [])]),
            keywords: dedupePreserveOrder([...(a.keywords ?? []), ...(b.keywords ?? [])]),
            examples: dedupePreserveOrder([...(a.examples ?? []), ...(b.examples ?? [])]),
            caveats: dedupePreserveOrder([...(a.caveats ?? []), ...(b.caveats ?? [])]),
        };
    }
    if (base.type === "procedure") {
        const a = base as Procedure;
        const b = add as Procedure;
        return {
            type: "procedure",
            title: a.title, // preserve identity
            pseudonyms: dedupePreserveOrder([...(a.pseudonyms ?? []), ...(b.pseudonyms ?? [])]),
            keywords: dedupePreserveOrder([...(a.keywords ?? []), ...(b.keywords ?? [])]),
            // Keep original steps; do not blend
            steps: a.steps ?? [],
            examples: dedupePreserveOrder([...(a.examples ?? []), ...(b.examples ?? [])]),
            bestPractice: dedupePreserveOrder([...(a.bestPractice ?? []), ...(b.bestPractice ?? [])]),
            caveats: dedupePreserveOrder([...(a.caveats ?? []), ...(b.caveats ?? [])]),
            constraints: dedupePreserveOrder([...(a.constraints ?? []), ...(b.constraints ?? [])]),
            troubleshooting: dedupePreserveOrder([...(a.troubleshooting ?? []), ...(b.troubleshooting ?? [])]),
            metrics: dedupePreserveOrder([...(a.metrics ?? []), ...(b.metrics ?? [])]),
        };
    }
    // entity
    const a = base as Entity;
    const b = add as Entity;
    return {
        type: "entity",
        name: a.name, // preserve identity
        description: a.description && a.description.trim().length > 0 ? a.description : b.description,
        pseudonyms: dedupePreserveOrder([...(a.pseudonyms ?? []), ...(b.pseudonyms ?? [])]),
        keywords: dedupePreserveOrder([...(a.keywords ?? []), ...(b.keywords ?? [])]),
        troubleshooting: dedupePreserveOrder([...(a.troubleshooting ?? []), ...(b.troubleshooting ?? [])]),
        constraints: dedupePreserveOrder([...(a.constraints ?? []), ...(b.constraints ?? [])]),
        caveats: dedupePreserveOrder([...(a.caveats ?? []), ...(b.caveats ?? [])]),
        bestPractice: dedupePreserveOrder([...(a.bestPractice ?? []), ...(b.bestPractice ?? [])]),
    };
}

export async function runAko04to05(
    akosFolder: string,
    cleanedDocsFolder: string,
    outputFolder: string
): Promise<ProcessResult> {
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
            const jsonText = await fs.readFile(akoPath, "utf8");
            const base: AtomicKnowledgeObject = JSON.parse(jsonText);
            const baseType: AkoType = base.type;
            if (baseType !== "definition" && baseType !== "procedure" && baseType !== "entity") {
                skipped += 1;
                bar.increment();
                continue;
            }

            let current = coerceSchema(base, baseType)!;

            for (const doc of docs) {
                try {
                    const prompt = fillPrompt(JSON.stringify(current), doc.text);
                    const modelOut = await processFileWithOpenAI("", prompt);
                    const jsonBlock = extractJsonObjectBlock(modelOut);
                    const parsed = JSON.parse(jsonBlock);
                    const coerced = coerceSchema(parsed, baseType);
                    if (!coerced) continue;
                    // Preserve identity keys from base (narrow by type)
                    if (baseType === "definition") {
                        (coerced as Definition).term = (current as Definition).term;
                    } else if (baseType === "procedure") {
                        (coerced as Procedure).title = (current as Procedure).title;
                    } else {
                        (coerced as Entity).name = (current as Entity).name;
                    }
                    // Merge into current (union arrays, keep identity)
                    current = mergeEnrichment(current, coerced);
                } catch {
                    // skip doc on parse/model error
                    continue;
                }
            }

            await saveFile(outputFolder, fileName, JSON.stringify(current, null, 2));
            processed += 1;
        } catch (e: any) {
            errors.push({ file: fileName, error: e?.message ?? String(e) });
        }
        bar.increment();
    }
    bar.stop();
    return { processed, skipped, errors };
}


