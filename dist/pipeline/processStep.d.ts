export interface ProcessResult {
    processed: number;
    skipped: number;
    errors: Array<{
        file: string;
        error: string;
    }>;
}
type OutputMode = "single" | "objects";
/**
 * Process all markdown files from inputFolder through OpenAI and save to outputFolder.
 * Files are processed sequentially (one at a time).
 */
export declare function processStep(inputFolder: string, outputFolder: string, prompt: string, options?: {
    outputMode?: OutputMode;
}): Promise<ProcessResult>;
export {};
//# sourceMappingURL=processStep.d.ts.map