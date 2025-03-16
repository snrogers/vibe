import { zu } from "zod_utilz";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";
import { ReplaceToolSchema } from "./Schema";
import { logger } from "@/lib/Services/LogService";
import { z } from "zod";
import fs from "fs/promises";

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
  file_path: z.string(),
  search_string: z.string(),
  replace_string: z.string(),
});

const StringifiedArgumentsSchema = zu.stringToJSON().pipe(
  ReplaceArgumentsSchema,
);

export const handleReplaceToolCall = async (
  toolCall: ChatCompletionMessageToolCall
): Promise<ToolMessage> => {
  try {
    const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
    const args = StringifiedArgumentsSchema.parse(argsJson);
    const { file_path, search_string, replace_string } = args;

    logger.log('info', 'Handling ReplaceToolCall', {
      file_path,
      search_string: search_string.substring(0, 100),
      replace_string: replace_string.substring(0, 100)
    });

    try {
      const content = await fs.readFile(file_path, 'utf-8');

      // Check if the search string exists in the file
      if (!content.includes(search_string)) {
        return {
          role: 'tool',
          tool_call_id,
          content: `Error: The search string was not found in the file.`,
        };
      }

      // Perform the replacement
      const newContent = content.replace(new RegExp(search_string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace_string);

      // Write the new content back to the file
      await fs.writeFile(file_path, newContent);

      logger.log('info', 'Handled ReplaceToolCall successfully', {
        file_path,
        occurrences: (content.match(new RegExp(search_string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
      });

      return {
        role: 'tool',
        tool_call_id,
        content: `Successfully replaced occurrences of the search string in ${file_path}.`,
      };
    } catch (fileError) {
      logger.log('error', 'File operation error in ReplaceToolCall', fileError);

      if (fileError instanceof Error) {
        return {
          role: 'tool',
          tool_call_id,
          content: `Error performing file operation: ${fileError.message}`,
        };
      }

      throw fileError;
    }
  } catch (error) {
    logger.log('error', 'Error handling ReplaceToolCall', error);

    if (error instanceof z.ZodError) {
      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: `Error parsing arguments: ${error.message}`,
      };
    }

    if (error instanceof Error) {
      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: `Error handling ReplaceToolCall: ${error.message}`,
      };
    }

    throw error;
  }
};

export const replaceInFile = async (file_path: string, search_string: string, replace_string: string): Promise<string> => {
  try {
    const content = await fs.readFile(file_path, 'utf-8');

    // Escape special regex characters in the search string
    const escapedSearchString = search_string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Check if the search string exists in the file
    if (!content.match(new RegExp(escapedSearchString, 'g'))) {
      return `Error: The search string was not found in the file.`;
    }

    const newContent = content.replace(new RegExp(escapedSearchString, 'g'), replace_string);
    await fs.writeFile(file_path, newContent);

    return 'File modified successfully.';
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return `Error: An unknown error occurred.`;
  }
};
