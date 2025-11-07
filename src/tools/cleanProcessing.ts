import fs from "node:fs/promises";
import path from "node:path";

type CleanOptions = {
    basePath: string;
    preserve: string[];
    dryRun: boolean;
    confirm: boolean;
};

export async function cleanProcessing(options: CleanOptions): Promise<void> {
    const base = path.resolve(options.basePath);
    const entries = await fs.readdir(base, { withFileTypes: true });

    const preserved = new Set(options.preserve);

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const dirName = entry.name;
        if (preserved.has(dirName)) {
            console.log(`Preserve: ${dirName}`);
            continue;
        }
        const dirPath = path.join(base, dirName);
        const contents = await fs.readdir(dirPath, { withFileTypes: true }).catch(() => []);
        if (!contents.length) {
            console.log(`Empty: ${dirName}`);
            continue;
        }

        console.log(`Cleaning: ${dirName}`);
        for (const item of contents) {
            const target = path.join(dirPath, item.name);
            if (options.dryRun) {
                console.log(`  - would remove: ${path.relative(base, target)}`);
                continue;
            }
            if (!options.confirm) {
                throw new Error("Refusing to delete without --confirm. Use --dry-run to preview.");
            }
            await fs.rm(target, { recursive: true, force: true });
        }
    }
}

function parseArgs(argv: string[]) {
    const args = { basePath: "processing", preserve: ["01-backup-source"], dryRun: false, confirm: false } as CleanOptions;
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--dry-run") args.dryRun = true;
        else if (a === "--confirm") args.confirm = true;
        else if (a === "--base-path") { args.basePath = argv[++i] ?? args.basePath; }
        else if (a === "--preserve") { args.preserve.push(argv[++i] ?? ""); }
        else {
            console.log(`Unknown arg: ${a}`);
        }
    }
    // Clean any empty preserve values (in case of missing value)
    args.preserve = args.preserve.filter(Boolean);
    return args;
}

// Allow running as a CLI: node dist/tools/cleanProcessing.js [flags]
if (import.meta.url === `file://${process.argv[1]}`) {
    (async () => {
        try {
            const opts = parseArgs(process.argv);
            console.log(`Base: ${path.resolve(opts.basePath)}`);
            console.log(`Preserve: ${opts.preserve.join(", ")}`);
            console.log(opts.dryRun ? "Mode: DRY RUN" : "Mode: ACTIVE");
            await cleanProcessing(opts);
            console.log("Done.");
        } catch (err) {
            console.error(err instanceof Error ? err.message : err);
            process.exit(1);
        }
    })();
}


