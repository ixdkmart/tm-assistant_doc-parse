import path from "node:path";
import fs from "node:fs/promises";
// @ts-ignore
import cliProgress from "cli-progress";
import { getFilesInFolder, readFile as readTextFile, saveFile } from "../lib/fileUtils.js";
import { processFileWithOpenAI } from "../lib/processor.js";
import PROMPT_03_TO_04 from "./prompts/prompt-03-to-04.js";
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

function isEmptyString(value: unknown): boolean {
    return typeof value !== "string" || value.trim().length === 0;
}

function isEmptyArray(value: unknown): boolean {
    return !Array.isArray(value) || value.length === 0;
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

function parseSingleAkoFromModel(raw: string): any {
    const jsonBlock = extractJsonObjectBlock(raw);
    return JSON.parse(jsonBlock);
}

function normalizeAko(input: any): AtomicKnowledgeObject {
    const type: AkoType = input?.type;
    if (type === "definition") {
        const out: Definition = {
            type: "definition",
            term: String(input?.term ?? ""),
            definition: String(input?.definition ?? ""),
            pseudonyms: Array.isArray(input?.pseudonyms) ? input.pseudonyms : [],
            keywords: Array.isArray(input?.keywords) ? input.keywords : [],
            examples: Array.isArray(input?.examples) ? input.examples : undefined,
            caveats: Array.isArray(input?.caveats) ? input.caveats : undefined,
        };
        return out;
    }
    if (type === "procedure") {
        const out: Procedure = {
            type: "procedure",
            title: String(input?.title ?? ""),
            pseudonyms: Array.isArray(input?.pseudonyms) ? input.pseudonyms : [],
            keywords: Array.isArray(input?.keywords) ? input.keywords : [],
            steps: Array.isArray(input?.steps) ? input.steps : [],
            examples: Array.isArray(input?.examples) ? input.examples : undefined,
            bestPractice: Array.isArray(input?.bestPractice) ? input.bestPractice : undefined,
            caveats: Array.isArray(input?.caveats) ? input.caveats : undefined,
            constraints: Array.isArray(input?.constraints) ? input.constraints : undefined,
            troubleshooting: Array.isArray(input?.troubleshooting) ? input.troubleshooting : undefined,
            metrics: Array.isArray(input?.metrics) ? input.metrics : undefined,
        };
        return out;
    }
    if (type === "entity") {
        const out: Entity = {
            type: "entity",
            name: String(input?.name ?? ""),
            description: typeof input?.description === "string" ? input.description : undefined,
            pseudonyms: Array.isArray(input?.pseudonyms) ? input.pseudonyms : [],
            keywords: Array.isArray(input?.keywords) ? input.keywords : [],
            troubleshooting: Array.isArray(input?.troubleshooting) ? input.troubleshooting : undefined,
            constraints: Array.isArray(input?.constraints) ? input.constraints : undefined,
            caveats: Array.isArray(input?.caveats) ? input.caveats : undefined,
            bestPractice: Array.isArray(input?.bestPractice) ? input.bestPractice : undefined,
        };
        return out;
    }
    throw new Error("Unsupported or missing AKO type");
}

function mergeAkoKeepExisting(curr: AtomicKnowledgeObject, next: AtomicKnowledgeObject): AtomicKnowledgeObject {
    if (curr.type !== next.type) return curr;
    if (curr.type === "definition") {
        const a = curr as Definition;
        const b = next as Definition;
        return {
            type: "definition",
            term: isEmptyString(a.term) ? b.term : a.term,
            definition: isEmptyString(a.definition) ? b.definition : a.definition,
            pseudonyms: isEmptyArray(a.pseudonyms) ? b.pseudonyms ?? [] : a.pseudonyms,
            keywords: isEmptyArray(a.keywords) ? b.keywords ?? [] : a.keywords,
            examples: isEmptyArray(a.examples) ? b.examples : a.examples,
            caveats: isEmptyArray(a.caveats) ? b.caveats : a.caveats,
        };
    }
    if (curr.type === "procedure") {
        const a = curr as Procedure;
        const b = next as Procedure;
        return {
            type: "procedure",
            title: isEmptyString(a.title) ? b.title : a.title,
            pseudonyms: isEmptyArray(a.pseudonyms) ? b.pseudonyms ?? [] : a.pseudonyms,
            keywords: isEmptyArray(a.keywords) ? b.keywords ?? [] : a.keywords,
            steps: isEmptyArray(a.steps) ? b.steps ?? [] : a.steps,
            examples: isEmptyArray(a.examples) ? b.examples : a.examples,
            bestPractice: isEmptyArray(a.bestPractice) ? b.bestPractice : a.bestPractice,
            caveats: isEmptyArray(a.caveats) ? b.caveats : a.caveats,
            constraints: isEmptyArray(a.constraints) ? b.constraints : a.constraints,
            troubleshooting: isEmptyArray(a.troubleshooting) ? b.troubleshooting : a.troubleshooting,
            metrics: isEmptyArray(a.metrics) ? b.metrics : a.metrics,
        };
    }
    if (curr.type === "entity") {
        const a = curr as Entity;
        const b = next as Entity;
        return {
            type: "entity",
            name: isEmptyString(a.name) ? b.name : a.name,
            description: isEmptyString(a.description) ? b.description : a.description,
            pseudonyms: isEmptyArray(a.pseudonyms) ? b.pseudonyms ?? [] : a.pseudonyms,
            keywords: isEmptyArray(a.keywords) ? b.keywords ?? [] : a.keywords,
            troubleshooting: isEmptyArray(a.troubleshooting) ? b.troubleshooting : a.troubleshooting,
            constraints: isEmptyArray(a.constraints) ? b.constraints : a.constraints,
            caveats: isEmptyArray(a.caveats) ? b.caveats : a.caveats,
            bestPractice: isEmptyArray(a.bestPractice) ? b.bestPractice : a.bestPractice,
        };
    }
    return curr;
}

function fillPrompt(locale: string, akoJson: string, cleanedMarkdown: string): string {
    return PROMPT_03_TO_04
        .replaceAll("{{LOCALE_HINT}}", locale)
        .replaceAll("{{AKO_JSON}}", akoJson)
        .replaceAll("{{CLEANED_MARKDOWN}}", cleanedMarkdown);
}

export async function runAko03to04(
    akosFolder: string,
    cleanedDocsFolder: string,
    outputFolder: string,
    localeHint: string = "AU"
): Promise<ProcessResult> {
    const akoFiles = await getFilesInFolder(akosFolder, "**/*.json");
    const docFiles = await getFilesInFolder(cleanedDocsFolder, "**/*.md");

    // Preload documents into memory to avoid re-reading
    const docs: Array<{ file: string; text: string }> = [];
    for (const f of docFiles) {
        try {
            const t = await readTextFile(f);
            if (t && t.trim()) {
                docs.push({ file: f, text: t });
            }
        } catch {
            // ignore unreadable docs
        }
    }

    const bar = new cliProgress.SingleBar(
        { format: "AKO 03→04 {bar} {value}/{total} | ETA: {eta_formatted} | File: {file}", hideCursor: true },
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
            const rawAko = JSON.parse(jsonText);
            let currentAko = normalizeAko(rawAko);

            // Enrich across all cleaned docs
            for (const doc of docs) {
                const prompt = fillPrompt(localeHint, JSON.stringify(currentAko), doc.text);
                const modelOut = await processFileWithOpenAI("", prompt);
                let parsed: any;
                try {
                    parsed = parseSingleAkoFromModel(modelOut);
                } catch {
                    // Skip this doc if parse fails; continue with others
                    continue;
                }
                if (!parsed || typeof parsed !== "object") continue;
                if (parsed.type !== currentAko.type) continue;
                const normalizedNext = normalizeAko(parsed);
                currentAko = mergeAkoKeepExisting(currentAko, normalizedNext);
            }

            await saveFile(outputFolder, fileName, JSON.stringify(currentAko, null, 2));
            processed += 1;
        } catch (e: any) {
            errors.push({ file: fileName, error: e?.message ?? String(e) });
        }
        bar.increment();
    }
    bar.stop();
    return { processed, skipped, errors };
}


