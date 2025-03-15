import { append, compose, flow, lensPath, lensProp, over } from 'ramda'
import type { AppEvent } from './AppEvent';
import { addUserMessage, type ChatMessage, type ChatSession } from '../Domain/ChatSession';
import { exhaustiveCheck, overDeep2 } from '../Utils';
import { INITIAL_APP_STATE, type AppState } from './AppState';



export const appReducer = (state: AppState = INITIAL_APP_STATE, event: AppEvent): AppState => {
  const { type, payload } = event

  // If debug mode is enabled, add the event to the state,
  // in addition to whatever else happens
  if (state.debugMode) {
    state = { ...state, events: [...state.events, event] }
  }

  // Handle the event
  switch (type) {
    case 'DEBUG_MODE_SET': {
      const { debugMode } = payload
      return { ...state, debugMode }
    }

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
