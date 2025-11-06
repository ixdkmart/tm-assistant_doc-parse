import { z } from "zod";
export declare const DocType: z.ZodEnum<["guidance", "policy", "procedure", "system"]>;
export type DocType = z.infer<typeof DocType>;
export declare const Chunk: z.ZodObject<{
    id: z.ZodString;
    doc_type: z.ZodEnum<["guidance", "policy", "procedure", "system"]>;
    roles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    device: z.ZodOptional<z.ZodString>;
    source: z.ZodString;
    version: z.ZodDefault<z.ZodString>;
    last_reviewed: z.ZodOptional<z.ZodString>;
    question: z.ZodString;
    answer: z.ZodString;
    tip: z.ZodOptional<z.ZodString>;
    why_when: z.ZodOptional<z.ZodString>;
    keywords: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    prerequisites: z.ZodOptional<z.ZodString>;
    safety: z.ZodOptional<z.ZodString>;
    troubleshooting: z.ZodOptional<z.ZodString>;
    escalate_when: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    doc_type: "guidance" | "policy" | "procedure" | "system";
    source: string;
    version: string;
    question: string;
    answer: string;
    keywords: string[];
    roles?: string[] | undefined;
    device?: string | undefined;
    last_reviewed?: string | undefined;
    tip?: string | undefined;
    why_when?: string | undefined;
    prerequisites?: string | undefined;
    safety?: string | undefined;
    troubleshooting?: string | undefined;
    escalate_when?: string | undefined;
}, {
    id: string;
    doc_type: "guidance" | "policy" | "procedure" | "system";
    source: string;
    question: string;
    answer: string;
    roles?: string[] | undefined;
    device?: string | undefined;
    version?: string | undefined;
    last_reviewed?: string | undefined;
    tip?: string | undefined;
    why_when?: string | undefined;
    keywords?: string[] | undefined;
    prerequisites?: string | undefined;
    safety?: string | undefined;
    troubleshooting?: string | undefined;
    escalate_when?: string | undefined;
}>;
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
//# sourceMappingURL=types.d.ts.map