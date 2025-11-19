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
 * Read checkpoint file to get set of processed files
 * @param checkpointPath - Path to checkpoint file
 * @returns Promise that resolves to Set of processed file names
 */
export async function readCheckpoint(checkpointPath: string): Promise<Set<string>> {
    try {
        const content = await fs.readFile(checkpointPath, "utf8");
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.processedFiles)) {
            return new Set(parsed.processedFiles);
        }
        return new Set();
    } catch {
        return new Set();
    }
}

/**
 * Write checkpoint file with processed files
 * @param checkpointPath - Path to checkpoint file
 * @param processedFiles - Set of processed file names
 */
export async function writeCheckpoint(
    checkpointPath: string,
    processedFiles: Set<string>
): Promise<void> {
    const folder = path.dirname(checkpointPath);
    await fs.mkdir(folder, { recursive: true });
    const content = JSON.stringify({
        processedFiles: Array.from(processedFiles),
        lastUpdated: new Date().toISOString(),
    }, null, 2);
    await fs.writeFile(checkpointPath, content, "utf8");
}

