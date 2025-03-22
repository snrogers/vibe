import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Detects the encoding of a file.
 * @param filePath - The path to the file.
 * @returns The detected encoding.
 */
export function detectFileEncoding(filePath: string): BufferEncoding {
  // For simplicity, we'll always return utf-8 for now
  return 'utf-8';
}

/**
 * Detects the line endings used in a file.
 * @param filePath - The path to the file.
 * @returns The line ending used in the file ('\n' or '\r\n').
 */
export function detectLineEndings(filePath: string): string {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return content.includes('\r\n') ? '\r\n' : '\n';
  } catch (error) {
    return '\n'; // Default to Unix line endings if an error occurs
  }
}

/**
 * Detects the predominant line endings used in the repository.
 * @param cwd - The current working directory (repository root).
 * @returns A promise that resolves to the line ending ('\n' or '\r\n') or null if it can't be determined.
 */
export async function detectRepoLineEndings(cwd: string): Promise<string | null> {
  // Check for common files that might indicate the repo's line ending preference
  const commonFiles = ['package.json', 'tsconfig.json', '.eslintrc.js', '.gitignore'];
  
  for (const file of commonFiles) {
    const filePath = join(cwd, file);
    if (existsSync(filePath)) {
      return detectLineEndings(filePath);
    }
  }
  
  // Default to Unix line endings if no files are found
  return '\n';
}

/**
 * Writes text content to a file with the specified encoding and line endings.
 * @param filePath - The path to the file.
 * @param content - The content to write.
 * @param encoding - The encoding to use.
 * @param lineEndings - The line endings to use.
 */
export function writeTextContent(
  filePath: string,
  content: string,
  encoding: BufferEncoding = 'utf-8',
  lineEndings: string = '\n'
): void {
  // Normalize line endings in the content
  const normalizedContent = content.replace(/\r\n|\n/g, lineEndings);
  writeFileSync(filePath, normalizedContent, { encoding });
}

/**
 * Adds line numbers to text content.
 * @param options - The options for adding line numbers.
 * @param options.content - The content to add line numbers to.
 * @param options.startLine - The line number to start with.
 * @returns The content with line numbers.
 */
export function addLineNumbers({ 
  content, 
  startLine = 1 
}: { 
  content: string; 
  startLine?: number 
}): string {
  return content
    .split(/\r?\n/)
    .map((line, index) => `${startLine + index}:\t${line}`)
    .join('\n');
}