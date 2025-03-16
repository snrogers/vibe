import type { AppEvent } from "./AppEvent"
import type { ChatSession } from "../Domain/ChatSession"
import type { CompletionDelta } from "./Saga/StreamCompletionSaga"
import { getPrompt } from "../Services/LlmService/Prompt/getPrompt"
import { ALL_COMPLETION_TOOLS, ALL_TOOLS } from "../Services/ToolService"

export type AppState = {
  chatSession: ChatSession
  debugMode:   boolean
  /** Event Log */
  events: AppEvent[]
  completionDelta?: CompletionDelta
  awaitingConfirmation: boolean
  inProgress: boolean
}

export const INITIAL_APP_STATE: AppState = {
  awaitingConfirmation: false,
  chatSession: {
    messages: [
      {
        role:   'system',
        content: await getPrompt({ tools: ALL_TOOLS }),
      }
    ]
  },
  completionDelta: undefined,
  debugMode: false,
  events: [],
  inProgress: false,
}
