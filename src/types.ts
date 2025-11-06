import { z } from "zod";

export const DocType = z.enum(["guidance", "policy", "procedure", "system"]);
export type DocType = z.infer<typeof DocType>;

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
export type Chunk = z.infer<typeof Chunk>;

export type Classified = {
  doc_type: DocType;
  roles?: string[];
  device?: string;
  tags?: string[];
};

export type ExtractedDoc = {
  text: string;
  sourcePath: string;
};
