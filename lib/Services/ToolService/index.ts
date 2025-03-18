import type { ChatCompletionTool } from 'openai/resources'

import { BashTool } from './BashTool'
import { ProjectOverviewTool } from './ProjectOverviewTool'
import { openAiChatCompletionToolFromTool } from './Utils'
import { ALL_MCP_COMPLETION_TOOLS, ALL_MCP_TOOLS } from '../McpService/McpService'

export { BashTool } from './BashTool'
export { ProjectOverviewTool } from './ProjectOverviewTool'
export { ToolService } from './ToolService'



export const ALL_TOOLS = [
  BashTool,
  ProjectOverviewTool,
  ...ALL_MCP_TOOLS,
]

export const ALL_COMPLETION_TOOLS: ChatCompletionTool[] = [
  openAiChatCompletionToolFromTool(BashTool),
  openAiChatCompletionToolFromTool(ProjectOverviewTool),
  ...ALL_MCP_COMPLETION_TOOLS,
]
