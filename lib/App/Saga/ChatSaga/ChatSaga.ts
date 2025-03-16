import { all, call, cancelled, put, select, take, takeEvery, takeLatest } from 'typed-redux-saga'

import type { AppEvent, PROMPT_SUBMITTED } from '@/lib/App/AppEvent'
import type { ToolMessage } from '@/lib/Domain/ChatSession'
import { LlmService } from '@/lib/Services/LlmService'
import { ToolService } from '@/lib/Services/ToolService'
import { logger } from '@/lib/Services/LogService'
import { serializeError } from 'serialize-error'

import type { AppState } from '@/lib/App/AppState'
import { StreamCompletionSaga } from '@/lib/App/Saga/StreamCompletionSaga'
import { ToolCallSaga } from '@/lib/App/Saga/ToolCallSaga'


const TOOL_CALL_LIMIT = 5

type ChatSagaOtps = {
  prompt: string
}
export function * ChatSaga(opts: ChatSagaOtps) {
  try {
    const { prompt } = opts
    yield * put({ type: 'CHAT_COMPLETION_STARTED', payload: { message: prompt } })
    const chatSession = yield * select((state: AppState) => state.chatSession)

    const assistantMessage = yield * StreamCompletionSaga({ chatSession })
    yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: assistantMessage } })

    // ----------------------------------------------------------------- //
    // Handle Tool Calls
    // ----------------------------------------------------------------- //
    let numSteps = 0
    let toolCalls = assistantMessage.tool_calls ?? []
    while (toolCalls.length) {
      numSteps++

      // ----------------------------------------------------------------- //
      // Break if we've reached the limit
      // We'll check afterwards to see if there's a dangling AssistantMesage.
      // If so, we'll replace it with a little pep talk session.
      // ----------------------------------------------------------------- //
      if (numSteps > TOOL_CALL_LIMIT) {
        logger.log('info', `Too many tool calls, stopping here.`)
        break
      }

      // ----------------------------------------------------------------- //
      // Otherwise Crunch the Tool calls and wait for the results
      // ----------------------------------------------------------------- //
      const toolMessages: ToolMessage[] = yield * all(toolCalls.map(
        (toolCall) => ToolCallSaga({ toolCall })
      ))
      yield * put({ type: 'TOOLS_COMPLETE', payload: { messages: toolMessages } })

      // ----------------------------------------------------------------- //
      // Respond with Tool Call Results
      // ----------------------------------------------------------------- //
      const chatSessionWithToolCallResults = yield * select((state: AppState) => state.chatSession)
      const assistantMessage               = yield * StreamCompletionSaga({ chatSession: chatSessionWithToolCallResults })
      yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: assistantMessage } })

      toolCalls = assistantMessage.tool_calls ?? []
    }

    yield * put({ type: 'CHAT_COMPLETION_FINISHED', payload: { message: assistantMessage } })
  } catch (error) {
    if (yield * cancelled()) {
      yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
      return
    }
    yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
    console.error(error)
  }
}

export function * WatchChatSaga() {
  yield * takeLatest<PROMPT_SUBMITTED>(
    'PROMPT_SUBMITTED',
    ({ payload }) => ChatSaga(payload)
  )
}
