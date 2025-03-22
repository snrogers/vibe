import type { ChatCompletionMessageToolCall } from 'openai/resources/index.mjs';
import { existsSync, mkdirSync, statSync } from 'fs';
import { dirname, isAbsolute, resolve, sep } from 'path';

import { stringifiedParametersSchema } from './Parameters';
import type { ToolMessage, SystemMessage } from '@/lib/Domain';
import { 
  detectFileEncoding, 
  detectLineEndings, 
  detectRepoLineEndings, 
  writeTextContent, 
  addLineNumbers 
} from '@/lib/Utils/file';
import { getCwd } from '@/lib/Utils/state';

// Set a context object to track file timestamps
const context = { readFileTimestamps: {} as Record<string, number> };

// Constants
const MAX_LINES_TO_RENDER_FOR_ASSISTANT = 16000;
const TRUNCATED_MESSAGE =
  '<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with Grep in order to find the line numbers of what you are looking for.</NOTE>';

export const handler = async (toolCall: ChatCompletionMessageToolCall): Promise<(ToolMessage|SystemMessage)[]> => {
  const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
  const args = stringifiedParametersSchema.parse(JSON.parse(argsJson));
  const { file_path, content } = args;

  try {
    // Resolve file path
    const fullFilePath = isAbsolute(file_path) ? file_path : resolve(getCwd(), file_path);
    
    // Validate if file has been read first when it exists
    if (existsSync(fullFilePath)) {
      const readTimestamp = context.readFileTimestamps[fullFilePath];
      if (!readTimestamp) {
        return [
          { role: 'system', content: 'File has not been read yet. Read it first before writing to it.' }
        ];
      }
      
      const stats = statSync(fullFilePath);
      const lastWriteTime = stats.mtimeMs;
      if (lastWriteTime > readTimestamp) {
        return [
          { role: 'system', content: 'File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.' }
        ];
      }
    }

    // Create directory if it doesn't exist
    const dir = dirname(fullFilePath);
    mkdirSync(dir, { recursive: true });
    
    // Determine file encoding and line endings
    const oldFileExists = existsSync(fullFilePath);
    const enc = oldFileExists ? detectFileEncoding(fullFilePath) as BufferEncoding : 'utf-8';
    const endings = oldFileExists ? detectLineEndings(fullFilePath) : await detectRepoLineEndings(getCwd());
    
    // Write the file
    writeTextContent(fullFilePath, content, enc, endings!);
    
    // Update timestamp
    context.readFileTimestamps[fullFilePath] = statSync(fullFilePath).mtimeMs;
    
    // Generate result based on whether this was a create or update operation
    const type = oldFileExists ? 'update' : 'create';
    let resultForAssistant;
    
    if (type === 'create') {
      resultForAssistant = `File created successfully at: ${file_path}`;
    } else {
      // For updates, show the file with line numbers
      const lines = content.split(/\r?\n/);
      const snippet = lines.length > MAX_LINES_TO_RENDER_FOR_ASSISTANT
        ? lines.slice(0, MAX_LINES_TO_RENDER_FOR_ASSISTANT).join('\n') + TRUNCATED_MESSAGE
        : content;
        
      resultForAssistant = `The file ${file_path} has been updated. Here's the result of running \`cat -n\` on a snippet of the edited file:\n${addLineNumbers({ content: snippet, startLine: 1 })}`;
    }
    
    return [{ role: 'tool', content: resultForAssistant, tool_call_id }];
  } catch (error: any) {
    return [
      { role: 'system', content: `Error writing file: ${error.message}` },
    ];
  }
};