import type { ChatCompletion } from "openai/resources/index.mjs"
import type { LlmClient } from "../Services/LlmService/LlmClient/LlmClient"
import type { Tool } from "../Services/ToolService/Types"
import { mkEmptyChatSession, type ChatSession } from "./ChatSession"
import type { ModelProvider } from "../Services/LlmService/ModelProvider"
import type { ToolDef } from "../Services/ToolService/ToolDef"



export type Agent = {
  _tag?:        'Agent'
  tools:         ToolDef[]
  chatSession:   ChatSession
  modelProvider: ModelProvider
  modelName:     string
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
