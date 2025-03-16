import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { ZodError } from 'zod';

import { ALL_TOOLS, ReplaceTool }                     from '.';
import { CurlTool }                      from './CurlTool';
import { ENV }                           from '@/lib/Constants';
import { ReadFileTool }                  from './ReadFileTool/ReadFileTool';
import { exhaustiveCheck }               from '@/lib/Utils';
import { handleBashToolCall }            from './BashTool';
import { handleProjectOverviewToolCall } from './ProjectOverviewTool';
import { handleWriteFileToolCall }       from './WriteFileTool';
import { withStandardErrorHandling }     from './withStandardErrorHandling';

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
      return ReplaceTool.handler;
    default:
      throw new ToolNotFoundError(`Unknown tool: ${name}`);
  }
}

export class ToolNotFoundError extends Error {
  constructor(toolName: string) {
    super(`Tool not found: ${toolName}`);
  }
}
