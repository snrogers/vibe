import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { ZodError } from 'zod';

import { ENV }                           from '@/lib/Constants';
import { exhaustiveCheck }               from '@/lib/Utils';

import { ALL_TOOLS }                     from '.';
import { CurlTool }                      from './CurlTool';
import { ReadFileTool }                  from './ReadFileTool/ReadFileTool';
import { ProjectOverviewTool }           from './ProjectOverviewTool';
import { ReplaceTool }                   from './ReplaceTool/ReplaceTool';
import { BashTool }                      from './BashTool';
import { WriteFileTool }                 from './WriteFileTool';
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
      return BashTool.handler;
    case 'curl':
      return CurlTool.handler;
    case 'project_overview':
      return ProjectOverviewTool.handler;
    case 'read_file':
      return ReadFileTool.handler;
    case 'write_file':
      return WriteFileTool.handler;
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
