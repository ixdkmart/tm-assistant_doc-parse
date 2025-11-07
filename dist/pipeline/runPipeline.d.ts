export interface PipelineResult {
    steps: Array<{
        step: number;
        input: string;
        output: string;
        processed: number;
        skipped: number;
        errors: Array<{
            file: string;
            error: string;
        }>;
    }>;
}
export declare function runPipeline(basePath?: string): Promise<PipelineResult>;
//# sourceMappingURL=runPipeline.d.ts.map