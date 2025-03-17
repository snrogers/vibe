import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { ZodError } from 'zod';

import { ENV }                           from '@/lib/Constants';
import { exhaustiveCheck }               from '@/lib/Utils';

import { ALL_COMPLETION_TOOLS }          from '.';
import { CurlTool }                      from './CurlTool';
import { ReadFileTool }                  from './ReadFileTool/ReadFileTool';
import { ProjectOverviewTool }           from './ProjectOverviewTool';
import { ReplaceTool }                   from './ReplaceTool/ReplaceTool';
import { BashTool }                      from './BashTool';
import { WriteFileTool }                 from './WriteFileTool';
import { withStandardErrorHandling }     from './withStandardErrorHandling';
import { GithubTool } from './GithubTool';
import type { AppTool } from './AppTool';
import { McpService } from '../McpService/McpService';

export const ToolService = {
  getTools: () => ALL_COMPLETION_TOOLS,
  /** @deprecated use executeToolCall instead */
  getToolHandler,
  executeToolCall: async (toolCall: ChatCompletionMessageToolCall) => {
    const { name, arguments: args } = toolCall.function;

    const toolHandler = withStandardErrorHandling(getToolHandler(name as ToolName));

    return await toolHandler(toolCall);
  }
};

type ToolName = AppTool['name'];
function getToolHandler (name: ToolName) {
  switch (name) {
    case 'bash':
      return BashTool.handler;
    case 'curl':
      return CurlTool.handler;
    case 'github':
      return GithubTool.handler;
    case 'project_overview':
      return ProjectOverviewTool.handler;
    case 'read_file':
      return ReadFileTool.handler;
    case 'write_file':
      return WriteFileTool.handler;
    case 'replace':
      return ReplaceTool.handler;
    default:
      exhaustiveCheck(name);
      return McpService.fetchMcpToolHandler(name)

  }
}

export class ToolNotFoundError extends Error {
  constructor(toolName: string) {
    super(`Tool not found: ${toolName}`);
  }
}
