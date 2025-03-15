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
  chatSession: { messages: [ { role: 'system', content: 'You are extremely laconic.' } ] },
  completionDelta: undefined,
  debugMode: false,
  events: [],
}
