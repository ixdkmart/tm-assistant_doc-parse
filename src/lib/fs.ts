import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import { Chunk } from "../types.js";

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function writeChunkMD(outDir: string, data: Chunk) {
  const yaml = YAML.stringify({
    id: data.id,
    doc_type: data.doc_type,
    roles: data.roles ?? [],
    device: data.device ?? undefined,
    source: data.source,
    version: data.version,
    last_reviewed: data.last_reviewed,
    tags: data.keywords ?? [],
  });

  const h1 = `# ${data.question}`;
  const lines = [h1, "", "Answer:", data.answer.trim()];
  if (data.tip) lines.push("", `Tip: ${data.tip.trim()}`);
  if (data.why_when) lines.push("", `Why/When: ${data.why_when.trim()}`);
  if (data.keywords?.length) lines.push("", `Keywords: ${data.keywords.join(", ")}`);

  const body = lines.join("\n");
  const md = `---\n${yaml}---\n\n${body}\n`;

  const folder = path.join(outDir, data.doc_type);
  await ensureDir(folder);
  const file = path.join(folder, `${data.id}-${slugify(data.question).slice(0, 80)}.md`);
  await fs.writeFile(file, md, "utf8");
  return file;
}
