import { zu } from 'zod_utilz';
import type { ToolMessage } from '@/lib/Domain/ChatSession';
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from 'openai/resources';
import { WriteFileArgumentsSchema } from './Schema';
import { logger } from '@/lib/Services/LogService';
import { z } from 'zod';

export const WriteFileTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'write_file',
    description: 'Write content to a file given its path.',
    parameters: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'The path to the file to write.',
        },
        content: {
          type: 'string',
          description: 'The content to write to the file.',
        },
      },
      required: ['file_path', 'content'],
    },
  },
};

const StringifiedArgumentsSchema = zu.stringToJSON().pipe(WriteFileArgumentsSchema);

export const handleWriteFileToolCall = async (
  toolCall: ChatCompletionMessageToolCall
): Promise<ToolMessage> => {
  const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
  const args = StringifiedArgumentsSchema.parse(argsJson);
  const { file_path, content } = args;

  logger.log('info', 'Handling WriteFileToolCall', { file_path });

  const file = Bun.file(file_path);
  await Bun.write(file, content);

  logger.log('info', 'Handled WriteFileToolCall', {
    file_path,
    content: content.substring(0, 100),
  });

  return {
    role: 'tool',
    tool_call_id,
    content: 'File written successfully.',
  };
};
