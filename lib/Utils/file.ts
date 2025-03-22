import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename, dirname, extname } from 'path';

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

/**
 * Finds a similar file name in the same directory.
 * @param filePath - The path to the file.
 * @returns The path to a similar file, or null if none is found.
 */
export function findSimilarFile(filePath: string): string | null {
  try {
    const dir = dirname(filePath);
    const base = basename(filePath);
    const ext = extname(filePath);

    // If the directory doesn't exist, we can't find similar files
    if (!existsSync(dir)) {
      return null;
    }

    // Read all files in the directory
    const files = readdirSync(dir, { withFileTypes: true });

    // Find files with the same extension
    const sameExtFiles = files
      .filter(file => file.isFile() && extname(file.name) === ext)
      .map(file => file.name);

    if (sameExtFiles.length === 0) {
      return null;
    }

    // Simple string similarity (Levenshtein distance would be better but this is simpler)
    let mostSimilar = '';
    let highestSimilarity = 0;

    for (const fileName of sameExtFiles) {
      let similarity = 0;
      const minLength = Math.min(base.length, fileName.length);

      // Count matching characters
      for (let i = 0; i < minLength; i++) {
        if (base[i] === fileName[i]) {
          similarity++;
        }
      }

      // Adjust for length difference
      similarity = similarity / Math.max(base.length, fileName.length);

      if (similarity > highestSimilarity) {
        highestSimilarity = similarity;
        mostSimilar = fileName;
      }
    }

    return highestSimilarity > 0.6 ? join(dir, mostSimilar) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Applies an edit to a file.
 * @param filePath - The path to the file.
 * @param oldString - The string to replace.
 * @param newString - The string to replace it with.
 * @returns An object containing the updated file content and the patch.
 */
export function applyEdit(
  filePath: string,
  oldString: string,
  newString: string
): { updatedFile: string; patch: string } {
  // If creating a new file (empty oldString)
  if (oldString === '') {
    return {
      updatedFile: newString,
      patch: `--- ${filePath} (new file)\n+++ ${filePath}\n@@ -0,0 +1,${newString.split('\n').length} @@\n${newString.split('\n').map(line => `+${line}`).join('\n')}`
    };
  }

  // For existing files
  const fileContent = readFileSync(filePath, 'utf-8');

  // Check if the oldString exists
  if (!fileContent.includes(oldString)) {
    throw new Error(`String to replace not found in file: ${filePath}`);
  }

  // Ensure only one occurrence of oldString
  const matches = fileContent.split(oldString).length - 1;
  if (matches > 1) {
    throw new Error(`Found ${matches} matches of the string to replace. Add more context to your edit and try again.`);
  }

  // Calculate line numbers of the edit
  const beforeEdit = fileContent.split(oldString)[0];
  const startLine = beforeEdit.split('\n').length;
  const endLine = startLine + oldString.split('\n').length - 1;

  // Create a simple patch-like diff
  const patch = `--- ${filePath}\n+++ ${filePath}\n@@ -${startLine},${endLine - startLine + 1} +${startLine},${newString.split('\n').length} @@\n-${oldString.split('\n').join('\n-')}\n+${newString.split('\n').join('\n+')}`;

  // Apply the edit
  const updatedFile = fileContent.replace(oldString, newString);

  return { updatedFile, patch };
}

/**
 * Gets a snippet of a file around an edit.
 * @param fileContent - The content of the file.
 * @param oldString - The string that was replaced.
 * @param newString - The string that replaced it.
 * @param contextLines - The number of context lines to include.
 * @returns An object containing the snippet and the start line.
 */
export function getSnippet(
  fileContent: string,
  oldString: string,
  newString: string,
  contextLines: number = 3
): { snippet: string; startLine: number } {
  if (oldString === '') {
    // For new files, show the beginning of the file
    const lines = newString.split('\n');
    const endLine = Math.min(lines.length, 10);
    return {
      snippet: lines.slice(0, endLine).join('\n'),
      startLine: 1
    };
  }

  // For edits to existing files
  const beforeEdit = fileContent.split(oldString)[0];
  const startLine = beforeEdit.split('\n').length;

  // Get lines before the edit for context
  const allLines = fileContent.split('\n');
  const beforeContextStart = Math.max(0, startLine - 1 - contextLines);
  const beforeContext = allLines.slice(beforeContextStart, startLine - 1);

  // Get the edited content
  const editedContent = newString.split('\n');

  // Get lines after the edit for context
  const afterStart = startLine - 1 + oldString.split('\n').length;
  const afterContextEnd = Math.min(allLines.length, afterStart + contextLines);
  const afterContext = allLines.slice(afterStart, afterContextEnd);

  // Combine everything into a snippet
  const snippet = [
    ...beforeContext,
    ...editedContent,
    ...afterContext
  ].join('\n');

  return {
    snippet,
    startLine: beforeContextStart + 1
  };
}
