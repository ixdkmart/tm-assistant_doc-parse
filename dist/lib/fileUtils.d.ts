/**
 * Get all files matching a pattern from a folder (recursively)
 * @param folderPath - The folder path to search in
 * @param pattern - Glob pattern for files to match (defaults to recursive markdown pattern)
 * @returns Array of absolute file paths
 */
export declare function getFilesInFolder(folderPath: string, pattern?: string): Promise<string[]>;
/**
 * Read file contents as UTF-8 text
 * @param filePath - The path to the file to read
 * @returns File contents as string
 */
export declare function readFile(filePath: string): Promise<string>;
/**
 * Save content to a file in the specified folder, creating directories if needed
 * @param folderPath - The folder path where the file should be saved
 * @param fileName - The name of the file to create
 * @param content - The content to write to the file
 * @returns Promise that resolves with the full file path when file is written
 */
export declare function saveFile(folderPath: string, fileName: string, content: string): Promise<string>;
//# sourceMappingURL=fileUtils.d.ts.map