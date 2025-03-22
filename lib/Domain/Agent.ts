import type { LlmConfig } from "../Services/LlmService/LlmClient/getApiClient"
import type { ModelProvider } from "../Services/LlmService/ModelProvider"
import type { ToolDef } from "../Services/ToolService/ToolDef"
import { mkEmptyChatSession, type ChatSession } from "./ChatSession"



export type Agent = {
  _tag?:       'Agent'
  chatSession: ChatSession
  modelConfig: LlmConfig
  tools:       ToolDef[]
}

type mkAgentOpts = {
  modelProvider: ModelProvider
  modelName:     string
  tools:         ToolDef[]
}
export function mkAgent(opts: mkAgentOpts) {
  return {
    _tag: 'Agent',
    chatSession: mkEmptyChatSession(),
    ...opts
  }
}
