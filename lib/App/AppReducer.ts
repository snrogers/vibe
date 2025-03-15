import { append, compose, flow, lensPath, lensProp, over } from 'ramda'
import type { AppEvent } from './AppEvent';
import { addUserMessage, type ChatMessage, type ChatSession } from '../Domain/ChatSession';
import { exhaustiveCheck, overDeep2 } from '../Utils';


export type AppState = {
  chatSession: ChatSession
}

const initialState: AppState = {
  chatSession: {
    messages: [
      { content: 'Hello World!', role: 'user' },
      { content: 'Hello World!', role: 'assistant' },
      { content: 'Hello World!', role: 'user' },
      { content: 'Hello World!', role: 'assistant' },
    ]
  }
}

export const appReducer = (state: AppState = initialState, event: AppEvent) => {
  const { type, payload } = event

  switch (type) {
    case 'PROMPT_SUBMITTED': {
      const { prompt } = payload

      const chatSession = addUserMessage(state.chatSession, prompt)
      return overDeep2('chatSession.messages', append(chatSession.messages)) (state)
    }

    default:
      exhaustiveCheck(type)
      return state
  }
}
