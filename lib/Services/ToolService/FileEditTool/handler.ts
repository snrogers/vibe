import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import path from 'path';
import { existsSync, statSync, mkdirSync } from 'fs';

import { stringifiedParametersSchema } from "./Parameters";
import type { ToolMessage, SystemMessage } from "@/lib/Domain";
import { FileContext } from "../FileContext";
import {
  detectFileEncoding,
  detectLineEndings,
  findSimilarFile,
  writeTextContent,
  addLineNumbers,
  applyEdit,
  getSnippet
} from '@/lib/Utils/file';
import { getCwd } from '@/lib/Utils/state';

export const handler = async (toolCall: ChatCompletionMessageToolCall): Promise<(ToolMessage|SystemMessage)[]> => {
  const { function: { arguments: argsStr }, id: tool_call_id } = toolCall;
  const args = stringifiedParametersSchema.parse(argsStr);
  const { file_path, old_string, new_string } = args;

  try {
    // Resolve file path
    const fullFilePath = path.isAbsolute(file_path) ? file_path : path.resolve(getCwd(), file_path);

    // Validation
    if (old_string === new_string) {
      return [{
        role: 'tool',
        tool_call_id,
        content: 'No changes to make: old_string and new_string are exactly the same.'
      }];
    }

    if (old_string === '' && existsSync(fullFilePath)) {
      return [{
        role: 'tool',
        tool_call_id,
        content: 'Cannot create new file - file already exists.'
      }];
    }

    if (!existsSync(fullFilePath) && old_string !== '') {
      const similarFilename = findSimilarFile(fullFilePath);
      let message = `File does not exist: ${file_path}`;
      if (similarFilename) {
        message += ` Did you mean ${similarFilename}?`;
      }
      return [{
        role: 'tool',
        tool_call_id,
        content: message
      }];
    }

    if (fullFilePath.endsWith('.ipynb')) {
      return [{
        role: 'tool',
        tool_call_id,
        content: 'File is a Jupyter Notebook. Use the NotebookEditCell tool to edit this file.'
      }];
    }

    // Check if file has been read first (for existing files)
    if (old_string !== '' && !FileContext.fileAccessTimestamps[fullFilePath]) {
      return [
        {
          role: 'tool',
          tool_call_id,
          content: 'File has not been read yet. Read it first before editing it.'
        },
        {
          role: 'system',
          content: 'Always use the file_read tool to read files before attempting to edit them.'
        }
      ];
    }

    // Check for concurrent modifications (for existing files)
    if (old_string !== '' && existsSync(fullFilePath)) {
      const stats = statSync(fullFilePath);
      const lastWriteTime = stats.mtimeMs;
      if (lastWriteTime > FileContext.fileAccessTimestamps[fullFilePath]) {
        return [{
          role: 'tool',
          tool_call_id,
          content: 'File has been modified since read, either by the user or by a linter. Read it again before attempting to edit it.'
        }];
      }
    }

    // Apply the edit
    const enc = existsSync(fullFilePath) ? detectFileEncoding(fullFilePath) : 'utf-8';
    const fileContent = existsSync(fullFilePath) ? await Bun.file(fullFilePath).text() : '';

    // For existing files, check if old_string exists in the file
    if (old_string !== '' && !fileContent.includes(old_string)) {
      return [{
        role: 'tool',
        tool_call_id,
        content: 'String to replace not found in file.'
      }];
    }

    // For existing files, check if old_string is unique
    if (old_string !== '') {
      const matches = fileContent.split(old_string).length - 1;
      if (matches > 1) {
        return [{
          role: 'tool',
          tool_call_id,
          content: `Found ${matches} matches of the string to replace. For safety, this tool only supports replacing exactly one occurrence at a time. Add more lines of context to your edit and try again.`
        }];
      }
    }

    // Apply the edit
    const { updatedFile, patch: _patch } = applyEdit(file_path, old_string, new_string);

    // Create directory if needed (for new files)
    const dir = path.dirname(fullFilePath);
    mkdirSync(dir, { recursive: true });

    // Detect line endings (for existing files) or use system default for new files
    const endings = existsSync(fullFilePath) ? detectLineEndings(fullFilePath) : '\n';

    // Write the file
    writeTextContent(fullFilePath, updatedFile, enc, endings);

    // Update the file access timestamp
    FileContext.fileAccessTimestamps[fullFilePath] = Date.now();

    // Generate a snippet of the edited file to show the user
    const { snippet, startLine } = getSnippet(fileContent, old_string, new_string);

    // Generate the result message
    const resultMessage = `The file ${file_path} has been updated. Here's the result of running \`cat -n\` on a snippet of the edited file:\n${addLineNumbers({ content: snippet, startLine })}`;

    return [{
      role: 'tool',
      tool_call_id,
      content: resultMessage
    }];
  } catch (error) {
    // Handle errors
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return [{
      role: 'tool',
      tool_call_id,
      content: `Error editing file: ${errorMessage}`
    }];
  }
};
