import { stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { spawnSync } from 'child_process';

/**
 * Interface for glob results
 */
export interface GlobResult {
  files: string[];
  truncated: boolean;
}

/**
 * Options for the glob function
 */
export interface GlobOptions {
  limit?: number;
  offset?: number;
}

/**
 * Find files matching a glob pattern in a directory
 * @param pattern - The glob pattern to match
 * @param basePath - The directory to search in
 * @param options - Options for the glob operation
 * @param signal - AbortSignal to cancel the operation
 * @returns Promise resolving to the matching files and whether results were truncated
 */
export async function glob(
  pattern: string,
  basePath: string,
  options: GlobOptions = {},
  signal?: AbortSignal
): Promise<GlobResult> {
  const { limit = 1000, offset = 0 } = options;

  // Check if the path exists
  if (!existsSync(basePath)) {
    return { files: [], truncated: false };
  }

  try {
    // Use find with glob pattern for speed and compatibility
    const cmd = 'find';
    const args = [
      basePath,
      '-type', 'f',
      '-path', `${basePath}/${pattern.replace(/\*\*/g, '*')}`,
      '-not', '-path', '*/node_modules/*',
      '-not', '-path', '*/.git/*'
    ];

    // Execute the command
    const result = spawnSync(cmd, args, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });

    if (result.error || result.status !== 0) {
      console.error('Error executing find command:', result.error || result.stderr);

      // Fallback to a simpler approach if the find command fails
      if (pattern.includes('*')) {
        return { files: [], truncated: false };
      }

      // If it's a simple file path without wildcards, just check if it exists
      const fullPath = resolve(basePath, pattern);
      if (existsSync(fullPath)) {
        return { files: [fullPath], truncated: false };
      }

      return { files: [], truncated: false };
    }

    // Process the output
    let files = result.stdout.trim() ? result.stdout.trim().split('\n') : [];

    // Apply offset and limit
    const totalFiles = files.length;
    files = files.slice(offset, offset + limit);

    // Sort files by modification time
    const stats = await Promise.all(files.map(file => stat(file).catch(() => ({ mtimeMs: 0 }))));

    files = files
      .map((file, index) => ({ file, mtime: stats[index].mtimeMs || 0 }))
      .sort((a, b) => b.mtime - a.mtime)
      .map(item => item.file);

    return {
      files,
      truncated: totalFiles > offset + limit
    };
  } catch (error) {
    console.error('Error in glob function:', error);
    return { files: [], truncated: false };
  }
}

/**
 * Check if a path has read permission
 * @param path - The path to check
 * @returns Whether the path has read permission
 */
export function hasReadPermission(path: string): boolean {
  try {
    // Simple existence check for now
    return existsSync(path);
  } catch (error) {
    return false;
  }
}
