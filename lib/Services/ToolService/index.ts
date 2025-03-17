import type { ChatCompletionTool } from 'openai/resources'

import { BashTool } from './BashTool'
import { ProjectOverviewTool } from './ProjectOverviewTool'
import { ReadFileTool } from './ReadFileTool'
import { WriteFileTool } from './WriteFileTool'
import { ReplaceTool } from './ReplaceTool/ReplaceTool'
import { CurlTool } from './CurlTool'
import { openAiChatCompletionToolFromTool } from './Utils'
import { ALL_MCP_COMPLETION_TOOLS, ALL_MCP_TOOLS } from '../McpService/McpService'

export { BashTool } from './BashTool'
export { CurlTool } from './CurlTool'
export { ProjectOverviewTool } from './ProjectOverviewTool'
export { ReadFileTool } from './ReadFileTool'
export { ReplaceTool } from './ReplaceTool/ReplaceTool'
export { ToolService } from './ToolService'
export { WriteFileTool } from './WriteFileTool'



export const ALL_TOOLS = [
  BashTool,
  CurlTool,
  ProjectOverviewTool,
  ReadFileTool,
  ReplaceTool,
  WriteFileTool,
  ...ALL_MCP_TOOLS,
]

export const ALL_COMPLETION_TOOLS: ChatCompletionTool[] = [
  openAiChatCompletionToolFromTool(BashTool),
  openAiChatCompletionToolFromTool(CurlTool),
  openAiChatCompletionToolFromTool(ProjectOverviewTool),
  openAiChatCompletionToolFromTool(ReadFileTool),
  openAiChatCompletionToolFromTool(ReplaceTool),
  openAiChatCompletionToolFromTool(WriteFileTool),
  ...ALL_MCP_COMPLETION_TOOLS,
]
