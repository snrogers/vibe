import { zu } from "zod_utilz";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";
import { ReplaceToolSchema } from "./Schema";
import { logger } from "@/lib/Services/LogService";
import { z } from "zod";

export const ReplaceTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'replace',
    description: 'Replace occurrences of a search string with a replacement string in a file.',
    parameters: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'The path to the file to modify.',
        },
        search_string: {
          type: 'string',
          description: 'The string to search for in the file.',
        },
        replace_string: {
          type: 'string',
          description: 'The string to replace the search string with.',
        },
      },
      required: ['file_path', 'search_string', 'replace_string'],
    },
  },
};

// Create a Zod schema for validating the replacement arguments
const ReplaceArgumentsSchema = z.object({
  file_path:      z.string(),
  replace_string: z.string(),
  search_string:  z.string(),
});

const StringifiedArgumentsSchema = zu.stringToJSON().pipe(
  ReplaceArgumentsSchema,
);

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
  const args = StringifiedArgumentsSchema.parse(argsJson);
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
