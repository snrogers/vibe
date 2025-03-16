import type { ChatCompletionTool } from 'openai/resources'

import { BashTool } from './BashTool'
import { ProjectOverviewTool } from './ProjectOverviewTool'
import { ReadFileTool } from './ReadFileTool'
import { WriteFileTool } from './WriteFileTool'
import { ReplaceTool } from './ReplaceTool/ReplaceTool'
import { CurlTool } from './CurlTool'
import { openAiChatCompletionToolFromTool } from './Utils'

export { BashTool } from './BashTool'
export { CurlTool } from './CurlTool'
export { ProjectOverviewTool } from './ProjectOverviewTool'
export { ReadFileTool } from './ReadFileTool'
export { ReplaceTool } from './ReplaceTool/ReplaceTool'
export { ToolService } from './ToolService'
export { WriteFileTool } from './WriteFileTool'


export const ALL_TOOLS: ChatCompletionTool[] = [
  // Old Format
  BashTool,
  ProjectOverviewTool,
  ReplaceTool,
  WriteFileTool,

  // New Format
  openAiChatCompletionToolFromTool(CurlTool),
  openAiChatCompletionToolFromTool(ReadFileTool),
]
