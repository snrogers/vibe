import type { AppEvent } from "./AppEvent"
import type { ChatSession } from "../Domain/ChatSession"
import type { CompletionDelta } from "./Saga/StreamCompletionSaga"
import { getPrompt } from "../Services/LlmService/Prompt/getPrompt"

export type AppState = {
  chatSession: ChatSession
  debugMode:   boolean
  /** Event Log */
  events: AppEvent[]
  completionDelta?: CompletionDelta
  awaitingConfirmation: boolean
}

export const INITIAL_APP_STATE: AppState = {
  awaitingConfirmation: false,
  chatSession: {
    messages: [
      {
        role:   'system',
        content: await getPrompt()
      }
    ]
  },
  completionDelta: undefined,
  debugMode: false,
  events: [],
}
