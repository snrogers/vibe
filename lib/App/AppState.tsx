import type { AppEvent } from "./AppEvent"
import type { ChatSession } from "../Domain/ChatSession"
import type { CompletionDelta } from "./Saga/StreamCompletionSaga"
import { generalCLIPrompt } from "../Services/LlmService/Prompt.example"

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
        role: 'system',
        content: generalCLIPrompt.join('\n\n\n--------------------------------------------------------------------------------\n\n\n'),
      }
    ]
  },
  completionDelta: undefined,
  debugMode: true,
  events: [],
}
