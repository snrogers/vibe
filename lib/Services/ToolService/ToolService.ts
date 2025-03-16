import type { ChatCompletionMessageToolCall } from 'openai/resources';

import { ALL_TOOLS }                     from '.';
import { handleBashToolCall }            from './BashTool';
import { CurlTool }            from './CurlTool';
import { handleProjectOverviewToolCall } from './ProjectOverviewTool';
import { ReadFileTool }        from './ReadFileTool/ReadFileTool';
import { handleReplaceToolCall }         from './ReplaceTool/ReplaceTool';
import { handleWriteFileToolCall }       from './WriteFileTool';
import { ZodError } from 'zod';
import { ENV } from '@/lib/Constants';
import { exhaustiveCheck } from '@/lib/Utils';
import { withStandardErrorHandling } from './withStandardErrorHandling';

export const ToolService = {
  getTools: () => ALL_TOOLS,
  /** @deprecated use executeToolCall instead */
  getToolHandler,
  executeToolCall: async (toolCall: ChatCompletionMessageToolCall) => {
    const { name, arguments: args } = toolCall.function;

    const toolHandler = withStandardErrorHandling(getToolHandler(name));

    return await toolHandler(toolCall);
  }
};

type ToolName = (typeof ALL_TOOLS)[number]['function']['name']
function getToolHandler (name: string) {
  switch (name) {
    case 'bash':
      return handleBashToolCall;
    case 'curl':
      return CurlTool.handler;
    case 'project_overview':
      return handleProjectOverviewToolCall;
    case 'read_file':
      return ReadFileTool.handler;
    case 'write_file':
      return handleWriteFileToolCall;
    case 'replace':
      return handleReplaceToolCall;
    default:
      throw new ToolNotFoundError(`Unknown tool: ${name}`);
  }
}

export class ToolNotFoundError extends Error {
  constructor(toolName: string) {
    super(`Tool not found: ${toolName}`);
  }
}
