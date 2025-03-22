import type { Tool } from "../../ToolService/Types"
import { generalCLIPrompt } from "./GeneralCliPrompt"
import { getProjectOverview } from "./getProjectOverview"
import { getVibeMd } from "./getVibeMd"

type GetPromptOpts = {
  tools: Tool[]
}
export async function getSystemPrompt(opts?: GetPromptOpts): Promise<string> {
  const { tools = [] } = opts ?? {}

  return [
    generalCLIPrompt,
    await getProjectOverview(),
    await getVibeMd(),
    getToolPrompts(tools),
  ].join('\n\n\n')
}


function getToolPrompts(tools: Tool[]) {
  return `
# Available Tools

${tools.map(getToolPrompt).join('\n\n')}
`.trim()
}


function getToolPrompt(tool: Tool) {
  return `
<Tool name="${tool.name}">${tool.description}</Tool>
`.trim()
}
