import { resolve } from 'path';

/**
 * Returns the current working directory for the application.
 * @returns The current working directory as an absolute path.
 */
export function getCwd(): string {
  // For now, we're just returning the current working directory of the process
  return process.cwd();
}