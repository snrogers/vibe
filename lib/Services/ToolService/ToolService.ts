import { handleBashToolCall } from "./BashTool"
import { handleProjectOverviewToolCall } from "./ProjectOverviewTool"

export const ToolService = {
  getToolHandler: (name: string) => {
    switch (name) {
      case 'bash':
        return handleBashToolCall
      case 'project_overview':
        return handleProjectOverviewToolCall
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  },
}
