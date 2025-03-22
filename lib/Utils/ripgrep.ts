import { spawnSync } from 'child_process';
import path from 'path';

/**
 * Execute ripgrep with the given arguments in the specified directory
 * @param args - Arguments to pass to ripgrep
 * @param cwd - Directory to search in
 * @returns Array of matching file paths
 */
export async function ripGrep(args: string[], cwd: string): Promise<string[]> {
  try {
    // Check if ripgrep is available
    const rgPath = getRipgrepPath();

    // Execute ripgrep
    const result = spawnSync(rgPath, args, {
      cwd,
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });

    if (result.error) {
      console.error(`Error executing ripgrep: ${result.error.message}`);
      return [];
    }

    if (result.status !== 0 && result.status !== 1) {
      // Status 1 is normal for "no matches found"
      console.error(`Ripgrep error (status ${result.status}): ${result.stderr}`);
      return [];
    }

    // Split output by lines and filter out empty lines
    const output = result.stdout.trim();
    return output ? output.split('\n') : [];
  } catch (error) {
    console.error(`Error executing ripgrep: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/**
 * Get the path to the ripgrep executable
 * @returns Path to ripgrep executable
 */
function getRipgrepPath(): string {
  // When running in Bun, look for ripgrep in the PATH
  return 'rg';
}

/**
 * Helper function to convert a possibly relative path to an absolute path
 * @param filePath - Path to convert
 * @returns Absolute path
 */
export function getAbsolutePath(filePath?: string): string | undefined {
  if (!filePath) return undefined;
  return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
}
