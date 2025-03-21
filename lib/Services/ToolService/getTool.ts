import type { ToolDef } from "./ToolDef";
import { BashTool } from "./BashTool";
import { FileReadTool } from "./FileReadTool";
import { ProjectOverviewTool } from "./ProjectOverviewTool";
import { openAiChatCompletionToolFromTool } from './Utils'

export function getCompletionTool<TDef extends ToolDef>(toolDef: TDef) {
  switch (toolDef.name) {
    case 'bash':
      return openAiChatCompletionToolFromTool(BashTool)
    case 'file_read':
      return openAiChatCompletionToolFromTool(FileReadTool)
    case 'project_overview':
      return openAiChatCompletionToolFromTool(ProjectOverviewTool)
    default:
      throw new Error(`Unsupported tool: ${toolDef.name}`)
  }
}
