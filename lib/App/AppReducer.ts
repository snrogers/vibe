import { append, compose, flow, lensPath, lensProp, over } from 'ramda'
import type { AppEvent } from './AppEvent';
import { addAssistantMessage, addToolCallResults, addUserMessage, type ChatMessage, type ChatSession } from '../Domain/ChatSession';
import { exhaustiveCheck, overDeep2, setDeep } from '../Utils';
import { INITIAL_APP_STATE, type AppState } from './AppState';



export const appReducer = (state: AppState = INITIAL_APP_STATE, event: AppEvent): AppState => {
  const { type, payload } = event

  // Handle the event
  switch (type) {

    case 'CHAT_COMPLETION_FAILURE': {
      return { ...state, completionDelta: undefined }
    }

    case 'CHAT_COMPLETION_SUCCESS': {
      const { message } = payload
      const chatSession = addAssistantMessage(state.chatSession, message)
      return { ...state, chatSession, completionDelta: undefined }
    }

    case 'CHAT_COMPLETION_STREAM_PARTIAL': {
      const { partialCompletion } = payload
      return { ...state, completionDelta: partialCompletion }
    }

    case 'DEBUG_MODE_SET': {
      const { debugMode } = payload
      return { ...state, debugMode }
    }

    case 'EVENT_LOG': {
      const { event } = payload
      return { ...state, events: [...state.events, event] }
    }

    case 'PROMPT_SUBMITTED': {
      const { prompt } = payload

      const chatSession = addUserMessage(state.chatSession, prompt)
      return { ...state, chatSession }
    }

    case 'TOOL_CONFIRMED': {
      const { isConfirmed } = payload
      return { ...state, awaitingConfirmation: !isConfirmed }
    }

    case 'TOOL_REQUEST_CONFIRMATION': {
      return { ...state, awaitingConfirmation: true }
    }

    case 'TOOLS_COMPLETE': {
      const { messages } = payload
      const chatSession = addToolCallResults(state.chatSession, messages)
      return { ...state, chatSession }
    }

    default:
      exhaustiveCheck(type)
      return state
  }
}
