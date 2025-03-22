import type { AppEvent } from './AppEvent';
import { addAssistantMessage, addToolCallResults, addUserMessage, type ChatSession } from '../Domain/ChatSession';
import { exhaustiveCheck } from '../Utils';
import { INITIAL_APP_STATE, type AppState } from './AppState';
import { logger } from '../Services/LogService';
import { last } from 'rambdax';

type IgnoredEventTypes =
  | 'KEY_INPUT'
  | 'INPUT_SUBMITTED'
  | `debug/${string}`

type AnyFunction = (...args: any[]) => any

function withLogging<T extends AnyFunction>(fn: T): T {
  return function (...args: Parameters<T>): ReturnType<T> {
    const result: ReturnType<T> = fn(...args)
    logger.log('info', 'AppReducer->withLogging', { ...args, result })
    return result
  } as T
}

export const appReducer = withLogging((state: AppState = INITIAL_APP_STATE, event: AppEvent): AppState => {
  const { type, payload } = event

  // Handle the event
  switch (type) {
    case 'AGENT_TASK_COMPLETION_SUCCESS': {
      // TODO: Display a non-static window with the agent's latest messages
      //       in chat history
      return {
        ...state,
        inProgress: true,
        completionDelta: { role: 'assistant', content: 'Running agent...' },
      }
    }
    case 'AGENT_TASK_STARTED': {
      const { prompt, model, systemPrompt, toolNames } = payload

      return {
        ...state,
        inProgress: true,
        agent: { model, prompt, systemPrompt, toolNames },
      }
    }
    case 'AGENT_TASK_SUCCESS': {
      return {
        ...state,
        completionDelta: { role: 'assistant', content: 'Running agent...' },
      }
    }
    case 'AGENT_TASK_FAILURE': {
      return {
        ...state,
        agent: undefined,
      }
    }
    case 'CHAT_COMPACTION_STARTED': {
      return {
        ...state,
        inProgress: true,
        completionDelta: { role: 'assistant', content: 'Compacting chat history...' },
      }
    }
    case 'CHAT_COMPACTION_SUCCESS': {
      const { compactedChatSession: chatSession } = payload
      return {
          ...state,
          chatSession,
          inProgress: false,
          completionDelta: undefined
        }
    }
    case 'CHAT_COMPLETION_CANCEL': {
      const chatSession = addAssistantMessage(
        state.chatSession,
        { role: 'assistant', content: '[Request interrupted by user]' }
      )

      return {
        ...state,
        chatSession,
        inProgress: false,
        completionDelta: undefined,
      }
    }
    case 'CHAT_COMPLETION_FAILURE': {
      return {
        ...state,
        completionDelta: undefined,
        inProgress:      false
      }
    }
    case 'CHAT_COMPLETION_FINISHED': {
      return { ...state, inProgress: false }
    }
    case 'CHAT_COMPLETION_STARTED': {
      return { ...state, inProgress: true }
    }
    case 'CHAT_COMPLETION_SUCCESS': {
      const { assistantMessage, usage } = payload
      const chatSession = addAssistantMessage(state.chatSession, assistantMessage)
      return {
        ...state,
        chatSession,
        completionDelta: undefined,
        inProgress: false,
        usage,
      }
    }
    case 'CHAT_COMPLETION_STREAM_PARTIAL': {
      const { partialCompletion } = payload
      return { ...state, completionDelta: partialCompletion }
    }
    case 'CHAT_SESSION_LOADED': {
      const { chatSession } = payload
      return { ...state, chatSession }
    }
    case 'CHAT_SESSION_RESET': {
      return { ...INITIAL_APP_STATE }
    }
    case 'CHAT_SESSION_RECOVER': {
      const { chatSession } = state
      const messages = [...chatSession.messages]

      // Remove Any Dangling messages
      do {
        const lastMessage = messages.pop()
        if (lastMessage?.role !== 'assistant') continue
        if (lastMessage?.tool_calls?.length) continue

        // Otherwise its good. Put it back!
        messages.push(lastMessage)
      } while (true)

      return { ...state, chatSession: { ...chatSession, messages } }
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

    case 'SET_INSPECT_MODE': {
      logger.log('info', 'AppReducer->SET_INSPECT_MODE', { event })
      const { inspectMode } = payload
      return { ...state, inspectMode }
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
      exhaustiveCheck<IgnoredEventTypes>(type)
      return state
  }
})
