import type { AppEvent } from "./AppEvent"
import type { ChatSession } from "../Domain/ChatSession"
import type { CompletionDelta } from "./Saga/StreamCompletionSaga"

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
        content: `
          You are a helpful assistant that is extremely laconic.
          When using tools, briefly explain your actions to clarify intent.
        `,
      }
    ]
  },
  completionDelta: undefined,
  debugMode: true,
  events: [],
}
