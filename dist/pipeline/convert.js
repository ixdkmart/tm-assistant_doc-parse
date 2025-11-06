import path from "node:path";
import fg from "fast-glob";
import pLimit from "p-limit";
import { extractWithOpenAI } from "../extractors/openai.js";
import { classifyText } from "./classify.js";
import { makeChunk } from "./makeChunk.js";
import { writeChunkMD, slugify } from "../lib/fs.js";
import { config } from "../config.js";
import { splitSectionsForChunking } from "./split.js";
// @ts-ignore
import cliProgress from "cli-progress";
const SUPPORTED = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".txt", ".rtf", ".png", ".jpg", ".jpeg"];
export async function convertFolder(inDir, outDir) {
    const files = await fg([`${inDir.replace(/\\/g, "/")}/**/*`], { dot: false });
    const targetFiles = files.filter((f) => SUPPORTED.includes(path.extname(f).toLowerCase()));
    const total = targetFiles.length;
    const bar = new cliProgress.SingleBar({ format: `Processing {bar} {value}/{total} | ETA: {eta_formatted} | File: {file}`, hideCursor: true }, cliProgress.Presets.shades_classic);
    bar.start(total, 0, { file: "" });
    const limit = pLimit(config.maxWorkers);
    const results = [];
    await Promise.all(targetFiles.map((file) => limit(async () => {
        try {
            bar.update({ file: path.basename(file) });
            const extracted = await extractWithOpenAI(file);
            if (!extracted.text || extracted.text.length < 50) {
                bar.increment();
                results.push({ file, status: "skipped:empty" });
                return;
            }
            const sections = splitSectionsForChunking(extracted.text);
            const baseId = `KMR-${slugify(path.basename(file, path.extname(file))).toUpperCase()}`;
            let idx = 1;
            for (const section of sections) {
                const meta = await classifyText(section.slice(0, 1500));
                const id = `${baseId}-${meta.doc_type.toUpperCase()}-${idx.toString().padStart(2, "0")}`;
                const chunk = await makeChunk(section, meta.doc_type, extracted.sourcePath, id);
                await writeChunkMD(outDir, chunk);
                idx++;
            }
            bar.increment();
            results.push({ file, status: "ok", chunks: sections.length });
        }
        catch (e) {
            bar.increment();
            results.push({ file, status: "error", error: e?.message });
        }
    })));
    bar.stop();
    const ok = results.filter((r) => r.status === "ok").length;
    const skipped = results.filter((r) => r.status?.startsWith("skipped")).length;
    const errors = results.filter((r) => r.status === "error");
    const totalChunks = results.reduce((sum, r) => sum + (r.chunks ?? 0), 0);
    console.log(`\n✅ Done! Processed: ${ok}/${total} | Chunks: ${totalChunks}`);
    if (skipped)
        console.log(`Skipped: ${skipped}`);
    if (errors.length)
        console.log(`Errors:`, errors);
    return { ok, skipped, totalChunks, errors };
}
//# sourceMappingURL=convert.js.map