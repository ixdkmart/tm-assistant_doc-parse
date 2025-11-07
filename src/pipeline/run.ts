import "dotenv/config";
import { runPipeline } from "./runPipeline.js";

async function main() {
    try {
        const result = await runPipeline("processing");
        // Print a concise summary and full JSON for debugging if needed
        for (const s of result.steps) {
            console.log(
                `Step ${s.step}: processed=${s.processed}, skipped=${s.skipped}, errors=${s.errors.length}`
            );
        }
        if (result.steps.some(s => s.errors.length)) {
            console.log("\nErrors:");
            for (const s of result.steps) {
                for (const e of s.errors) {
                    console.log(` - [step ${s.step}] ${e.file}: ${e.error}`);
                }
            }
        }
        // Uncomment to dump the full result
        // console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();


