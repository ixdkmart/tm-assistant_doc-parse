import * as fs from "node:fs";
import path from "node:path";
import * as mammoth from "mammoth";
import * as textract from "textract";
import { cleanText } from "../lib/text.js";
function isWeak(text) {
    const t = (text || "").replace(/\s+/g, " ");
    if (t.length < 300)
        return true;
    const alpha = (t.match(/[A-Za-z]/g) || []).length;
    return alpha / Math.max(t.length, 1) < 0.2;
}
async function extractTxt(filePath) {
    return cleanText(await fs.promises.readFile(filePath, "utf8"));
}
async function extractDocx(filePath) {
    const { value } = await mammoth.extractRawText({ path: filePath });
    return cleanText(value || "");
}
async function extractPptx(filePath) {
    return new Promise((resolve) => {
        textract.fromFileWithPath(filePath, (err, text) => {
            if (err)
                return resolve("");
            resolve(cleanText(text || ""));
        });
    });
}
async function extractPdf(filePath) {
    const buf = await fs.promises.readFile(filePath);
    // Dynamic import works for both CJS and ESM builds of pdf-parse
    const mod = await import("pdf-parse");
    const parse = (mod && mod.default) ? mod.default : mod;
    const data = await parse(buf);
    return cleanText(data.text || "");
}
async function ocrImage(filePath) {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker();
    const { data } = await worker.recognize(filePath);
    await worker.terminate();
    return cleanText(data.text || "");
}
/**
 * NPM-ONLY extractor. No OpenAI usage. Fast + free.
 */
export async function extractWithOpenAI(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const abs = path.resolve(filePath);
    if (ext === ".txt")
        return { text: await extractTxt(abs), sourcePath: abs };
    if (ext === ".docx")
        return { text: await extractDocx(abs), sourcePath: abs };
    if (ext === ".pptx")
        return { text: await extractPptx(abs), sourcePath: abs };
    if (ext === ".pdf") {
        const text = await extractPdf(abs);
        if (isWeak(text)) {
            console.log(`⚠️  Scanned PDF detected (low text content):`, filePath);
            console.log(`    OCR recommended → export to PNG/JPG first for best result.`);
            return { text, sourcePath: abs };
        }
        return { text, sourcePath: abs };
    }
    if ([".png", ".jpg", ".jpeg"].includes(ext)) {
        const text = await ocrImage(abs);
        return { text, sourcePath: abs };
    }
    throw new Error(`Unsupported file: ${ext}. Convert to PDF/DOCX/TXT first.`);
}
//# sourceMappingURL=openai.js.map