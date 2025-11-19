import path from "node:path";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
// @ts-ignore
import cliProgress from "cli-progress";
import readline from "node:readline";
import { saveFile } from "../lib/fileUtils.js";
import { processFileWithOpenAI } from "../lib/processor.js";
import { config } from "../config.js";
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

function slugify(input: string): string {
    return String(input)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

type Namespace = "role" | "system" | "law" | "organisation" | "document" | "program";

function applyCanonicalMap(identity: string): string {
    const canonMap: Record<string, string> = {
        "team members": "Team Member",
        "store managers": "Store Manager",
        "kmart": "Kmart",
    };
    const key = identity.trim().toLowerCase();
    return canonMap[key] ?? identity.trim();
}

function detectNamespace(type: AkoType, identity: string, candidate?: AtomicKnowledgeObject): Namespace {
    const s = identity.toLowerCase();
    if (type === "entity") {
        if (/\bact\s*\d{4}\b/.test(s) || /\bregulation\b/.test(s)) return "law";
        if (/\bmanager\b|\bteam member\b|\bstaff\b|\brole\b/.test(s)) return "role";
        if (/\bkmart\b|\bpty\b|\binc\b|\bltd\b|\bassociation\b/.test(s)) return "organisation";
        if (/\bportal\b|\bapp\b|\bsystem\b|\bwallet\b|\bpay\b/.test(s)) return "system";
    }
    if (type === "definition") {
        if (/\bact\s*\d{4}\b|\bpolicy\b|\bglossary\b/.test(s)) return "law";
        return "document";
    }
    if (type === "procedure") {
        return "document";
    }
    return "document";
}

function canonicalIdentity(obj: AtomicKnowledgeObject): { canonical: string; original: string; namespace: Namespace } {
    if (obj.type === "definition") {
        const original = String(obj.term ?? "").trim();
        const canonical = applyCanonicalMap(original).toLowerCase().trim();
        return { canonical, original, namespace: detectNamespace("definition", original, obj) };
    }
    if (obj.type === "entity") {
        const original = String(obj.name ?? "").trim();
        const canonical = applyCanonicalMap(original).toLowerCase().trim();
        return { canonical, original, namespace: detectNamespace("entity", original, obj) };
    }
    // procedure
    const original = String(obj.title ?? "").trim();
    const canonical = applyCanonicalMap(original).toLowerCase().trim();
    return { canonical, original, namespace: detectNamespace("procedure", original, obj) };
}

function makeKey(obj: AtomicKnowledgeObject): { key: string; namespace: Namespace; canonical: string; original: string } {
    const { canonical, original, namespace } = canonicalIdentity(obj);
    return { key: `${obj.type}::${namespace}::${canonical}`, namespace, canonical, original };
}

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

function authorityScore(obj: AtomicKnowledgeObject): number {
    // Higher is more authoritative
    if (obj.type === "definition") {
        const d = (obj.definition ?? "").toLowerCase();
        let score = 0;
        if (/\bact\s*\d{4}\b/.test(d)) score += 3;
        if (/\bpolicy\b|\bglossary\b|\bdefined\b/.test(d)) score += 2;
        if (/\bmust\b|\bshall\b/.test(d)) score += 1;
        return score;
    }
    if (obj.type === "entity") {
        const n = (obj.name ?? "").toLowerCase();
        let score = 0;
        if (/\bmanager\b|\bsystem\b|\bact\s*\d{4}\b/.test(n)) score += 2;
        return score;
    }
    // procedure
    const t = (obj.title ?? "").toLowerCase();
    let score = 0;
    if (/\bpolicy\b|\bsop\b|\bguidance\b/.test(t)) score += 2;
    return score;
}

function materiallyDisagree(a?: string, b?: string): boolean {
    if (!a || !b) return false;
    const sa = a.trim().toLowerCase();
    const sb = b.trim().toLowerCase();
    if (sa === sb) return false;
    // crude token overlap
    const toksA = new Set(sa.split(/\W+/).filter(Boolean));
    const toksB = new Set(sb.split(/\W+/).filter(Boolean));
    let inter = 0;
    for (const t of toksA) if (toksB.has(t)) inter += 1;
    const jaccard = inter / Math.max(1, toksA.size + toksB.size - inter);
    return jaccard < 0.3;
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

function coerceSchemaPure(output: any, groupType: AkoType): AtomicKnowledgeObject | null {
    if (!output || typeof output !== "object") return null;
    if (output.type !== groupType) return null;
    if (groupType === "definition") {
        const obj: Definition = {
            type: "definition",
            term: String(output.term ?? ""),
            definition: String(output.definition ?? ""),
            pseudonyms: Array.isArray(output.pseudonyms) ? dedupePreserveOrder(output.pseudonyms) : [],
            keywords: [],
            examples: [],
            caveats: [],
        };
        if (!obj.term || !obj.definition) return null;
        return obj;
    }
    if (groupType === "procedure") {
        const obj: Procedure = {
            type: "procedure",
            title: String(output.title ?? ""),
            pseudonyms: Array.isArray(output.pseudonyms) ? dedupePreserveOrder(output.pseudonyms) : [],
            keywords: [],
            steps: Array.isArray(output.steps) ? output.steps : [],
            examples: [],
            bestPractice: [],
            caveats: [],
            constraints: [],
            troubleshooting: [],
            metrics: [],
        };
        if (!obj.title) return null;
        return obj;
    }
    // entity
    const desc = typeof output.description === "string" ? output.description : undefined;
    const obj: Entity = {
        type: "entity",
        name: String(output.name ?? ""),
        description: desc,
        pseudonyms: Array.isArray(output.pseudonyms) ? dedupePreserveOrder(output.pseudonyms) : [],
        keywords: [],
        troubleshooting: [],
        constraints: [],
        caveats: [],
        bestPractice: [],
    };
    if (!obj.name) return null;
    return obj;
}

export async function runAko03to04(
    akosFolder: string,
    _cleanedDocsFolder: string,
    outputFolder: string,
    _localeHint: string = "AU"
): Promise<ProcessResult> {
    const ndjsonPath = path.join(akosFolder, "akos.ndjson");
    const outFolder = outputFolder; // now 04-merge-out via pipeline
    await fs.mkdir(outFolder, { recursive: true });
    const indexPath = path.join(outFolder, "_merge-summary.ndjson");
    await fs.writeFile(indexPath, "", "utf8"); // truncate index

    type GroupItem = { obj: AtomicKnowledgeObject; line: number };
    const groups = new Map<
        string,
        { type: AkoType; namespace: Namespace; canonical: string; originals: string[]; items: GroupItem[] }
    >();

    // Read NDJSON stream
    const stream = createReadStream(ndjsonPath, { encoding: "utf8" });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    let inputLines = 0;
    const bar = new cliProgress.SingleBar(
        { format: "MERGE 03→04 {bar} {value} lines | Group: {groups}", hideCursor: true },
        cliProgress.Presets.shades_classic
    );
    bar.start(0, 0, { groups: 0 });
    for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        inputLines += 1;
        try {
            const parsed = JSON.parse(trimmed);
            const type: AkoType = parsed?.type;
            if (type !== "definition" && type !== "procedure" && type !== "entity") continue;
            const obj = parsed as AtomicKnowledgeObject;
            const { key, namespace, canonical, original } = makeKey(obj);
            const g =
                groups.get(key) ??
                { type, namespace, canonical, originals: [], items: [] };
            g.items.push({ obj, line: inputLines });
            g.originals.push(original);
            groups.set(key, g);
        } catch {
            // skip invalid line
        }
        bar.increment(1, { groups: groups.size });
    }
    bar.stop();

    // Guardrails helpers
    const vetoPairs: Array<[string, string]> = [
        ["mod", "store manager"],
        ["apple wallet", "apple pay"],
    ];
    function veto(a: string, b: string): boolean {
        const la = a.toLowerCase(), lb = b.toLowerCase();
        return vetoPairs.some(([x, y]) => (la.includes(x) && lb.includes(y)) || (la.includes(y) && lb.includes(x)));
    }

    let outputsWritten = 0;
    let conflicts = 0;
    // For each group, merge and write outputs and index
    for (const [, group] of groups) {
        const { type, namespace, canonical } = group;
        // Apply guardrails: ensure no obvious veto within group identities
        let hasVeto = false;
        for (let i = 0; i < group.originals.length && !hasVeto; i++) {
            for (let j = i + 1; j < group.originals.length && !hasVeto; j++) {
                if (veto(group.originals[i], group.originals[j])) hasVeto = true;
            }
        }
        // Choose identity text and core fields
        let conflict = false;

        // Attempt LLM-assisted merge using MERGE prompt with retries
        let merged: AtomicKnowledgeObject | null = null;
        let signals: string[] = [];
        
        // Retry LLM merge before falling back to deterministic
        let lastError: any = null;
        for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
            try {
                const occurrences = group.items.map(i => i.obj);
                const llmOut = await processFileWithOpenAI(JSON.stringify({ occurrences }), PROMPT_03_TO_04);
                const jsonBlock = extractJsonObjectBlock(llmOut);
                const parsed = JSON.parse(jsonBlock);
                const coerced = coerceSchemaPure(parsed, type);
                if (coerced) {
                    merged = coerced;
                    signals.push("llm-merge");
                    if (attempt > 0) {
                        console.log(`[runAko03to04] LLM merge succeeded on retry ${attempt + 1} for ${group.canonical}`);
                    }
                    break; // Success, exit retry loop
                } else {
                    // Schema validation failed, try again
                    throw new Error("Schema validation failed for LLM merge output");
                }
            } catch (err: any) {
                lastError = err;
                // If this was the last attempt, fall through to deterministic merge
                if (attempt >= config.maxRetries) {
                    console.log(`[runAko03to04] LLM merge failed after ${config.maxRetries + 1} attempts for ${group.canonical}, falling back to deterministic merge`);
                    break;
                }
                // Calculate delay with exponential backoff
                const delayMs = config.retryDelayMs * Math.pow(config.retryBackoffMultiplier, attempt);
                console.log(`[runAko03to04] LLM merge attempt ${attempt + 1}/${config.maxRetries + 1} failed for ${group.canonical}, retrying in ${delayMs.toFixed(0)}ms...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }

        // If LLM output invalid or failed, deterministic fallback (previous logic)
        if (!merged) {
            // Merge pseudonyms/keywords union (if present)
            const allPseudos: string[] = [];
            const allKeywords: string[] = [];
            const sorted = [...group.items].sort((a, b) => authorityScore(b.obj) - authorityScore(a.obj));
            const representative = sorted[0]?.obj;
            if (type === "entity") {
                const descriptions = group.items
                    .map(i => (i.obj as Entity).description)
                    .filter((d): d is string => typeof d === "string" && d.trim().length > 0);
                let chosenDesc: string | undefined = descriptions[0];
                for (const d of descriptions.slice(1)) {
                    if (materiallyDisagree(chosenDesc, d)) {
                        conflict = true;
                        chosenDesc = (chosenDesc && chosenDesc.length <= d.length) ? chosenDesc : d;
                    }
                }
                for (const gi of group.items) {
                    const e = gi.obj as Entity;
                    if (Array.isArray(e.pseudonyms)) allPseudos.push(...e.pseudonyms);
                    if (Array.isArray(e.keywords)) allKeywords.push(...e.keywords);
                }
                merged = {
                    type: "entity",
                    name: group.originals[0] ?? representative && (representative as Entity).name ?? canonical,
                    description: chosenDesc,
                    pseudonyms: dedupePreserveOrder(allPseudos),
                    keywords: dedupePreserveOrder(allKeywords),
                    troubleshooting: [],
                    constraints: [],
                    caveats: [],
                    bestPractice: [],
                };
            } else if (type === "procedure") {
                let chosenSteps: string[] = [];
                for (const gi of sorted) {
                    const p = gi.obj as Procedure;
                    if (Array.isArray(p.steps) && p.steps.length > 0) {
                        chosenSteps = p.steps;
                        break;
                    }
                }
                for (const gi of group.items) {
                    const p = gi.obj as Procedure;
                    if (Array.isArray(p.pseudonyms)) allPseudos.push(...p.pseudonyms);
                    if (Array.isArray(p.keywords)) allKeywords.push(...p.keywords);
                }
                merged = {
                    type: "procedure",
                    title: group.originals[0] ?? representative && (representative as Procedure).title ?? canonical,
                    pseudonyms: dedupePreserveOrder(allPseudos),
                    keywords: dedupePreserveOrder(allKeywords),
                    steps: chosenSteps,
                    examples: [],
                    bestPractice: [],
                    caveats: [],
                    constraints: [],
                    troubleshooting: [],
                    metrics: [],
                };
            } else {
                const defs = group.items.map(i => (i.obj as Definition).definition).filter((d): d is string => !!d);
                let chosenDef = defs[0] ?? "";
                for (const d of defs.slice(1)) {
                    if (materiallyDisagree(chosenDef, d)) {
                        conflict = true;
                        const aLaw = /\bact\s*\d{4}\b|\bpolicy\b|\bglossary\b/.test(chosenDef.toLowerCase());
                        const bLaw = /\bact\s*\d{4}\b|\bpolicy\b|\bglossary\b/.test(d.toLowerCase());
                        if (!aLaw && bLaw) chosenDef = d;
                        else if (aLaw && !bLaw) chosenDef = chosenDef;
                        else chosenDef = d.length >= chosenDef.length ? d : chosenDef;
                    }
                }
                for (const gi of group.items) {
                    const d = gi.obj as Definition;
                    if (Array.isArray(d.pseudonyms)) allPseudos.push(...d.pseudonyms);
                    if (Array.isArray(d.keywords)) allKeywords.push(...d.keywords);
                }
                merged = {
                    type: "definition",
                    term: group.originals[0] ?? (representative as Definition | undefined)?.term ?? canonical,
                    definition: chosenDef,
                    pseudonyms: dedupePreserveOrder(allPseudos),
                    keywords: dedupePreserveOrder(allKeywords),
                    examples: [],
                    caveats: [],
                };
            }
            signals.push("fallback-deterministic");
        }

        // Laws must match year: if within group there are multiple years implied, mark conflict
        if (namespace === "law") {
            const years = new Set<number>();
            for (const o of group.originals) {
                const m = o.match(/\b(\d{4})\b/);
                if (m) years.add(Number(m[1]));
            }
            if (years.size > 1) conflict = true;
        }

        if (hasVeto) conflict = true;
        if (conflict) conflicts += 1;

        const id = `${merged.type}_${slugify(group.canonical)}`;
        const fileName = `${id}.json`;
        await saveFile(outFolder, fileName, JSON.stringify(merged, null, 2));
        outputsWritten += 1;

        // provenance index line
        const indexEntry = {
            id,
            type: merged.type,
            namespace,
            sources: group.items.map(i => ({ line: i.line })), // use NDJSON line numbers as provenance
            merged_from_count: group.items.length,
            merge: { confidence: 1.0, signals, vetoes: hasVeto ? ["do-not-merge-pair"] : [] as string[] },
            conflict,
        };
        await fs.appendFile(indexPath, JSON.stringify(indexEntry) + "\n", "utf8");
    }

    // Filter summary file into separate files based on signals, conflicts, and vetoes
    const successEntries: any[] = [];
    const partialSuccessEntries: any[] = [];
    const conflictEntries: any[] = [];
    const vetoEntries: any[] = [];

    const summaryStream = createReadStream(indexPath, { encoding: "utf8" });
    const summaryRl = readline.createInterface({ input: summaryStream, crlfDelay: Infinity });
    
    for await (const line of summaryRl) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
            const entry = JSON.parse(trimmed);
            
            // Check for llm-merge signal
            if (Array.isArray(entry.merge?.signals) && entry.merge.signals.includes("llm-merge")) {
                successEntries.push(entry);
            }
            
            // Check for fallback-deterministic signal
            if (Array.isArray(entry.merge?.signals) && entry.merge.signals.includes("fallback-deterministic")) {
                partialSuccessEntries.push(entry);
            }
            
            // Check for conflict
            if (entry.conflict === true) {
                conflictEntries.push(entry);
            }
            
            // Check for vetoes
            if (Array.isArray(entry.merge?.vetoes) && entry.merge.vetoes.length > 0) {
                vetoEntries.push(entry);
            }
        } catch {
            // skip invalid line
        }
    }

    // Write filtered files
    const successPath = path.join(outFolder, "_merge-success.ndjson");
    const partialSuccessPath = path.join(outFolder, "_merge-partial-success.ndjson");
    const conflictPath = path.join(outFolder, "_merge-conflicts.ndjson");
    const vetoPath = path.join(outFolder, "_merge-vetoes.ndjson");

    await fs.writeFile(successPath, successEntries.map(e => JSON.stringify(e)).join("\n") + "\n", "utf8");
    await fs.writeFile(partialSuccessPath, partialSuccessEntries.map(e => JSON.stringify(e)).join("\n") + "\n", "utf8");
    await fs.writeFile(conflictPath, conflictEntries.map(e => JSON.stringify(e)).join("\n") + "\n", "utf8");
    await fs.writeFile(vetoPath, vetoEntries.map(e => JSON.stringify(e)).join("\n") + "\n", "utf8");

    // Final log
    console.log(JSON.stringify({ stage: "merge", input_lines: inputLines, groups: groups.size, outputs_written: outputsWritten, conflicts }));

    return { processed: outputsWritten, skipped: 0, errors: [] };
}


