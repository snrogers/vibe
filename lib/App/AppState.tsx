import type { AppEvent } from "./AppEvent"
import type { ChatSession } from "../Domain/ChatSession"

export type AppState = {
  chatSession: ChatSession
  debugMode: boolean
  /** Event Log */
  events: AppEvent[]
}

export const INITIAL_APP_STATE: AppState = {
  chatSession: {
    messages: [
      { content: 'Hello World!', role: 'user' },
      { content: 'Hello World!', role: 'assistant' },
      { content: 'Hello World!', role: 'user' },
      { content: 'Hello World!', role: 'assistant' },
    ]
  },
  debugMode: true,
  events: [],
}
