import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
/**
 * Get all files matching a pattern from a folder (recursively)
 * @param folderPath - The folder path to search in
 * @param pattern - Glob pattern for files to match (defaults to recursive markdown pattern)
 * @returns Array of absolute file paths
 */
export async function getFilesInFolder(folderPath, pattern = "**/*.md") {
    const searchPattern = path.join(folderPath, pattern).replace(/\\/g, "/");
    const files = await fg([searchPattern], { dot: false });
    return files.map((f) => path.resolve(f));
}
/**
 * Read file contents as UTF-8 text
 * @param filePath - The path to the file to read
 * @returns File contents as string
 */
export async function readFile(filePath) {
    return await fs.readFile(filePath, "utf8");
}
/**
 * Save content to a file in the specified folder, creating directories if needed
 * @param folderPath - The folder path where the file should be saved
 * @param fileName - The name of the file to create
 * @param content - The content to write to the file
 * @returns Promise that resolves with the full file path when file is written
 */
export async function saveFile(folderPath, fileName, content) {
    await fs.mkdir(folderPath, { recursive: true });
    const filePath = path.join(folderPath, fileName);
    await fs.writeFile(filePath, content, "utf8");
    return filePath;
}
//# sourceMappingURL=fileUtils.js.map