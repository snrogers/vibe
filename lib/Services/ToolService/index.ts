import type { ChatCompletionTool } from 'openai/resources'

import { BashTool } from './BashTool'
import { ProjectOverviewTool } from './ProjectOverviewTool'
import { openAiChatCompletionToolFromTool } from './Utils'
import { ALL_MCP_COMPLETION_TOOLS, ALL_MCP_TOOLS } from '../McpService/McpService'
import { FileReadTool } from './FileReadTool'
import { FileWriteTool } from './FileWriteTool'
import { FileEditTool } from './FileEditTool'
import { GlobTool } from './GlobTool'
import { GrepTool } from './GrepTool'

export { BashTool } from './BashTool'
export { ProjectOverviewTool } from './ProjectOverviewTool'
export { ToolService } from './ToolService'
export { FileReadTool } from './FileReadTool'
export { FileWriteTool } from './FileWriteTool'
export { FileEditTool } from './FileEditTool'
export { GlobTool } from './GlobTool'
export { GrepTool } from './GrepTool'



export const ALL_TOOLS = [
  BashTool,
  ProjectOverviewTool,
  FileReadTool,
  FileWriteTool,
  FileEditTool,
  GlobTool,
  GrepTool,
  ...ALL_MCP_TOOLS,
]

export const ALL_COMPLETION_TOOLS: ChatCompletionTool[] = [
  openAiChatCompletionToolFromTool(BashTool),
  openAiChatCompletionToolFromTool(ProjectOverviewTool),
  openAiChatCompletionToolFromTool(FileReadTool),
  openAiChatCompletionToolFromTool(FileWriteTool),
  openAiChatCompletionToolFromTool(FileEditTool),
  openAiChatCompletionToolFromTool(GlobTool),
  openAiChatCompletionToolFromTool(GrepTool),
  ...ALL_MCP_COMPLETION_TOOLS,
]
