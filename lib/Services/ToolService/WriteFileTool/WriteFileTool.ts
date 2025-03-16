import { zu } from 'zod_utilz';
import * as path from 'path';
import * as fs from 'fs-extra';
import type { ToolMessage } from '@/lib/Domain/ChatSession';
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from 'openai/resources';
import { WriteFileArgumentsSchema } from './Args';
import { logger } from '@/lib/Services/LogService';
import { z } from 'zod';
import type { Tool } from '../Types';
import { StringifiedWriteFileArgumentsSchema } from './Args';
import { handleWriteFileToolCall } from './handleWriteFileToolCall';

const description = `
  Write content to a file given its path.
  Returns the path of the file written to.

  <example>
    {
      "file_path": "/Users/someDude/hisProject/thatFile.txt",
      "content": "This is the content to write to the file."
    }
  </example>
`

export const WriteFileTool = {
  name: 'write_file',
  description,
  argsSchema: WriteFileArgumentsSchema,
  handler: handleWriteFileToolCall,
} as const satisfies Tool


