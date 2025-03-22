import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { exhaustiveCheck }               from '@/lib/Utils';

import { ALL_COMPLETION_TOOLS }          from '.';
import { ProjectOverviewTool }           from './ProjectOverviewTool';
import { BashTool }                      from './BashTool';
import { withStandardErrorHandling }     from './withStandardErrorHandling';
import type { AppTool } from './AppTool';
import { McpService } from '../McpService/McpService';
import { FileReadTool } from './FileReadTool';
import { FileWriteTool } from './FileWriteTool';
import { FileEditTool } from './FileEditTool';
import { GlobTool } from './GlobTool';
import { GrepTool } from './GrepTool';
import {RagTool} from './RagTool';


export const ToolService = {
  getTools: () => ALL_COMPLETION_TOOLS,
  /** @deprecated use executeToolCall instead */
  getToolHandler,

  // TODO: Parse Parameters here instead of in each Handler
  executeToolCall: async (toolCall: ChatCompletionMessageToolCall) => {
    const { name, arguments: _args } = toolCall.function;
    const toolHandler = withStandardErrorHandling(getToolHandler(name as ToolName));
    return await toolHandler(toolCall);
  }
};

export type ToolName = AppTool['name'];
function getToolHandler (name: ToolName) {
  switch (name) {
    case 'bash':
      return BashTool.handler;
    case 'project_overview':
      return ProjectOverviewTool.handler;
    case 'file_read':
      return FileReadTool.handler;
    case 'file_write':
      return FileWriteTool.handler;
    case 'file_edit':
      return FileEditTool.handler;
    case 'glob':
      return GlobTool.handler;
    case 'grep':
      return GrepTool.handler;
    case 'rag_tool':
      return RagTool.handler;
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
