import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import { existsSync } from 'fs';
import path from 'path';

import { stringifiedParametersSchema } from './Parameters';
import type { ToolMessage, SystemMessage } from '@/lib/Domain';
import { glob, hasReadPermission } from '@/lib/Utils/glob';
import { getCwd } from '@/lib/Utils/state';

// Maximum number of results to return
const MAX_RESULTS = 100;

export const handler = async (toolCall: ChatCompletionMessageToolCall): Promise<(ToolMessage|SystemMessage)[]> => {
  const { function: { arguments: argsStr }, id: tool_call_id } = toolCall;
  const args = stringifiedParametersSchema.parse(argsStr);
  const { pattern, path: searchPath } = args;

  try {
    // Start timing the operation
    const start = Date.now();

    // Determine the search path
    const absolutePath = searchPath ? path.resolve(searchPath) : getCwd();

    // Check if the path exists
    if (!existsSync(absolutePath)) {
      return [{
        role: 'tool',
        tool_call_id,
        content: `Directory does not exist: ${absolutePath}`
      }];
    }

    // Check permissions
    if (!hasReadPermission(absolutePath)) {
      return [{
        role: 'tool',
        tool_call_id,
        content: 'Permission denied: Cannot read from the specified path.'
      }];
    }

    // Perform the glob operation
    const { files, truncated } = await glob(
      pattern,
      absolutePath,
      { limit: MAX_RESULTS },
      undefined // No signal for now
    );

    // Format the response
    if (files.length === 0) {
      return [{
        role: 'tool',
        tool_call_id,
        content: 'No files found'
      }];
    }

    // Format the results
    let resultContent = files.join('\n');
    
    // Add a note if results were truncated
    if (truncated) {
      resultContent += `\n(Results are truncated. Consider using a more specific path or pattern.)`;
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