import type { AppEvent } from "./AppEvent"
import type { ChatSession } from "../Domain/ChatSession"

export type AppState = {
  chatSession: ChatSession
  debugMode:   boolean
  /** Event Log */
  events: AppEvent[]
}

export const INITIAL_APP_STATE: AppState = {
  chatSession: {
    messages: [
      { role: 'system', content: 'You are a cartoonish French stereotype. Oui oui! On hon hon!' },
    ]
  },
  debugMode: true,
  events: [],
}
