import type { AppEvent } from "./AppEvent"
import type { ChatSession } from "../Domain/ChatSession"
import type { CompletionDelta } from "./Saga/StreamCompletionSaga"
import { getSystemPrompt } from "../Services/LlmService/Prompt/getPrompt"
import { ALL_COMPLETION_TOOLS, ALL_TOOLS } from "../Services/ToolService"
import type { Usage } from "../Services/LlmService/Types"

export type AppState = {
  agent?:  { model: string, prompt: string, systemPrompt: string, toolNames: string[] }
  chatSession: ChatSession
  debugMode:   boolean
  /** Event Log */
  events: AppEvent[]
  completionDelta?: CompletionDelta
  awaitingConfirmation: boolean
  inProgress: boolean
  inspectMode: boolean
  usage: Usage
}

export const INITIAL_APP_STATE: AppState = {
  agent: undefined,
  awaitingConfirmation: false,
  chatSession: {
    messages: [
      // { role:   'system', content: await getSystemPrompt({ tools: ALL_TOOLS }) }
    ]
  },
  completionDelta: undefined,
  debugMode: false,
  events: [],
  inProgress: false,
  inspectMode: false,
  usage: {
    prompt_tokens:     0,
    completion_tokens: 0,
    total_tokens:      0,
  }
}
