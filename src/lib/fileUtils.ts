import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

/**
 * Get all files matching a pattern from a folder (recursively)
 * @param folderPath - The folder path to search in
 * @param pattern - Glob pattern for files to match (defaults to recursive markdown pattern)
 * @returns Array of absolute file paths
 */
export async function getFilesInFolder(
    folderPath: string,
    pattern: string = "**/*.md"
): Promise<string[]> {
    const searchPattern = path.join(folderPath, pattern).replace(/\\/g, "/");
    const files = await fg([searchPattern], { dot: false });
    return files.map((f) => path.resolve(f));
}

/**
 * Read file contents as UTF-8 text
 * @param filePath - The path to the file to read
 * @returns File contents as string
 */
export async function readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, "utf8");
}

/**
 * Save content to a file in the specified folder, creating directories if needed
 * @param folderPath - The folder path where the file should be saved
 * @param fileName - The name of the file to create
 * @param content - The content to write to the file
 * @returns Promise that resolves with the full file path when file is written
 */
export async function saveFile(
    folderPath: string,
    fileName: string,
    content: string
): Promise<string> {
    await fs.mkdir(folderPath, { recursive: true });
    const filePath = path.join(folderPath, fileName);
    await fs.writeFile(filePath, content, "utf8");
    return filePath;
}

/**
 * Check if a file exists
 * @param filePath - The path to the file to check
 * @returns Promise that resolves to true if file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get checkpoint file path
 * @param folder - The folder path where checkpoint should be stored
 * @param name - The checkpoint file name
 * @returns Full path to checkpoint file
 */
export function getCheckpointPath(folder: string, name: string): string {
    return path.join(folder, name);
}

/**
 * Read checkpoint file to get set of processed files (NDJSON format)
 * @param checkpointPath - Path to checkpoint file
 * @returns Promise that resolves to Set of processed file names
 */
export async function readCheckpoint(checkpointPath: string): Promise<Set<string>> {
    try {
        const content = await fs.readFile(checkpointPath, "utf8");
        const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
        const processedFiles = new Set<string>();
        for (const line of lines) {
            try {
                const entry = JSON.parse(line);
                if (entry && typeof entry === "object" && entry.file) {
                    processedFiles.add(entry.file);
                }
            } catch {
                // Skip invalid lines
            }
        }
        return processedFiles;
    } catch {
        return new Set();
    }
}

/**
 * Append a processed file entry to checkpoint file (NDJSON format)
 * @param checkpointPath - Path to checkpoint file
 * @param fileName - Name of the processed file
 */
export async function appendCheckpointEntry(
    checkpointPath: string,
    fileName: string
): Promise<void> {
    const folder = path.dirname(checkpointPath);
    await fs.mkdir(folder, { recursive: true });
    const entry = {
        file: fileName,
        processedAt: new Date().toISOString(),
    };
    await fs.appendFile(checkpointPath, JSON.stringify(entry) + "\n", "utf8");
}

/**
 * Write checkpoint file with processed files (NDJSON format)
 * @param checkpointPath - Path to checkpoint file
 * @param processedFiles - Set of processed file names
 */
export async function writeCheckpoint(
    checkpointPath: string,
    processedFiles: Set<string>
): Promise<void> {
    const folder = path.dirname(checkpointPath);
    await fs.mkdir(folder, { recursive: true });
    
    // Read existing entries to preserve timestamps
    const existingEntries = new Map<string, string>();
    try {
        const content = await fs.readFile(checkpointPath, "utf8");
        const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
        for (const line of lines) {
            try {
                const entry = JSON.parse(line);
                if (entry && typeof entry === "object" && entry.file) {
                    existingEntries.set(entry.file, entry.processedAt || new Date().toISOString());
                }
            } catch {
                // Skip invalid lines
            }
        }
    } catch {
        // File doesn't exist or can't be read, start fresh
    }
    
    // Update timestamps for newly processed files
    const now = new Date().toISOString();
    for (const fileName of processedFiles) {
        if (!existingEntries.has(fileName)) {
            existingEntries.set(fileName, now);
        }
    }
    
    // Write all entries as NDJSON
    const lines: string[] = [];
    for (const [fileName, processedAt] of existingEntries.entries()) {
        lines.push(JSON.stringify({ file: fileName, processedAt }));
    }
    await fs.writeFile(checkpointPath, lines.join("\n") + "\n", "utf8");
}

/**
 * Append an error entry to error summary file (NDJSON format)
 * @param errorSummaryPath - Path to error summary file
 * @param fileName - Name of the file that had an error
 * @param errorMessage - Error message
 */
export async function appendErrorEntry(
    errorSummaryPath: string,
    fileName: string,
    errorMessage: string
): Promise<void> {
    const folder = path.dirname(errorSummaryPath);
    await fs.mkdir(folder, { recursive: true });
    const entry = {
        file: fileName,
        error: errorMessage,
        timestamp: new Date().toISOString(),
    };
    await fs.appendFile(errorSummaryPath, JSON.stringify(entry) + "\n", "utf8");
}

