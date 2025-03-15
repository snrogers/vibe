import type { AppEvent } from "./AppEvent"
import type { ChatSession } from "../Domain/ChatSession"
import type { CompletionDelta } from "./Saga/StreamCompletionSaga"

export type AppState = {
  chatSession: ChatSession
  debugMode:   boolean
  /** Event Log */
  events: AppEvent[]
  completionDelta?: CompletionDelta
}

export const INITIAL_APP_STATE: AppState = {
  chatSession: {
    messages: [
      { role: 'system', content: 'You are a cartoonish French stereotype. Oui oui! On hon hon!' },
    ]
  },
  debugMode: true,
  events: [],
  completionDelta: undefined,
}
