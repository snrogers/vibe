import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import { existsSync } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

import { stringifiedParametersSchema } from './Parameters';
import type { ToolMessage, SystemMessage } from '@/lib/Domain';
import { ripGrep, getAbsolutePath } from '@/lib/Utils/ripgrep';
import { getCwd } from '@/lib/Utils/state';

// Maximum number of results to return
const MAX_RESULTS = 100;

export const handler = async (toolCall: ChatCompletionMessageToolCall): Promise<(ToolMessage|SystemMessage)[]> => {
  const { function: { arguments: argsStr }, id: tool_call_id } = toolCall;
  const args = stringifiedParametersSchema.parse(argsStr);
  const { pattern, path: searchPath, include } = args;

  try {
    // Start timing the operation
    const start = Date.now();

    // Determine the search path
    const absolutePath = getAbsolutePath(searchPath) || getCwd();

    // Check if the path exists
    if (!existsSync(absolutePath)) {
      return [{
        role: 'tool',
        tool_call_id,
        content: `Directory does not exist: ${absolutePath}`
      }];
    }

    // Construct ripgrep arguments
    const rgArgs = ['-li', pattern];
    if (include) {
      rgArgs.push('--glob', include);
    }

    // Perform the search
    const results = await ripGrep(rgArgs, absolutePath);

    // Get file stats for sorting (if results found)
    let sortedMatches = results;
    
    if (results.length > 0) {
      try {
        const stats = await Promise.all(results.map(file => stat(file)));
        
        // Sort files by modification time (newest first)
        sortedMatches = results
          .map((file, i) => ({ file, mtime: stats[i].mtimeMs }))
          .sort((a, b) => (b.mtime ?? 0) - (a.mtime ?? 0))
          .map(item => item.file);
      } catch (error) {
        console.error('Error getting file stats:', error);
        // Continue with unsorted results if stats cannot be obtained
      }
    }

    // Format the response
    if (sortedMatches.length === 0) {
      return [{
        role: 'tool',
        tool_call_id,
        content: 'No files found'
      }];
    }

    // Format the results
    let resultContent = `Found ${sortedMatches.length} file${sortedMatches.length === 1 ? '' : 's'}\n${sortedMatches.slice(0, MAX_RESULTS).join('\n')}`;
    
    // Add a note if results were truncated
    if (sortedMatches.length > MAX_RESULTS) {
      resultContent += `\n(Results are truncated. ${sortedMatches.length - MAX_RESULTS} more files matched. Consider using a more specific path or pattern.)`;
    }
    
    // Add duration information
    const durationMs = Date.now() - start;
    resultContent += `\n\nSearch completed in ${durationMs}ms`;

    return [{
      role: 'tool',
      tool_call_id,
      content: resultContent
    }];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return [{
      role: 'tool',
      tool_call_id,
      content: `Error searching files: ${errorMessage}`
    }];
  }
};