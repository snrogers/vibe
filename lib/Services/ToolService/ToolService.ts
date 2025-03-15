import { handleBashToolCall } from "./BashTool"

export const ToolService = {
  getToolHandler: (name: string) => {
    switch (name) {
      case 'bash':
        return handleBashToolCall
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  },
}
