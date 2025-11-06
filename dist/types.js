import { z } from "zod";
export const DocType = z.enum(["guidance", "policy", "procedure", "system"]);
export const Chunk = z.object({
    id: z.string(),
    doc_type: DocType,
    roles: z.array(z.string()).optional(),
    device: z.string().optional(),
    source: z.string(),
    version: z.string().default("0.1.0"),
    last_reviewed: z.string().optional(),
    question: z.string(),
    answer: z.string(),
    tip: z.string().optional(),
    why_when: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    // new: completeness helpers
    prerequisites: z.string().optional(),
    safety: z.string().optional(),
    troubleshooting: z.string().optional(),
    escalate_when: z.string().optional(),
});
//# sourceMappingURL=types.js.map