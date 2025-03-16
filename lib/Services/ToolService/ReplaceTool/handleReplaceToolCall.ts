import type { ToolMessage } from '@/lib/Domain/ChatSession';
import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { logger } from '../../LogService';
import { StringifiedReplaceArgumentsSchema } from './Schema';

/**
 * Creates a safe regex from a string by escaping special characters
 * @param str The string to escape for regex
 * @returns A RegExp object with the escaped string
 */
const createSafeRegex = (str: string): RegExp => {
  const escapedString = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(escapedString, 'g');
};

export const handleReplaceToolCall = async (
  toolCall: ChatCompletionMessageToolCall
): Promise<ToolMessage> => {
  const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
  const args = StringifiedReplaceArgumentsSchema.parse(argsJson);
  const { file_path, search_string, replace_string } = args;

  logger.log('info', 'Handling ReplaceToolCall', {
    file_path,
    search_string:  search_string.substring(0, 100),
    replace_string: replace_string.substring(0, 100)
  });

  const fileContent    = await Bun.file(file_path).text();
  const newFileContent = await replaceInText(file_path, search_string, replace_string);

  await Bun.write(file_path, newFileContent);

  logger.log('info', 'Handled ReplaceToolCall', {
    file_path,
    newFileContent
  });

  return {
    role: 'tool',
    tool_call_id,
    content: newFileContent,
  };
};

// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //
// FIXME: IMPORTANT: REPLACE ONLY THE FIRST OCCURRENCE OF THE SEARCH STRING
// FIXME: IMPORTANT: RETURN THE DIFF
const replaceInText = async (content: string, search_string: string, replace_string: string): Promise<string> => {
  const safeRegex = createSafeRegex(search_string);

  // Check if the search string exists in the file using regex
  const matches = content.match(safeRegex);
  if (!matches) {
    return `Error: The search string was not found in the file.`;
  }

  // Perform the replacement
  const newContent = content.replace(safeRegex, replace_string);

  return newContent
};
