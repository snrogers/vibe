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
import { ToolCallLoopSaga } from './ToolCallLoopSaga'



// GAME PLAN:
// This is eventually going to turn into a big "Listen for the Next Event and then do a Completion" loop.
// "Next Event" maybe be:
// - User submits a prompt
// - VibeApp responds with a "Tool Call" to the LLM
// - Agent responds with a request to powwow


const TOOL_CALL_LIMIT = 5

type ChatSagaOtps = {
  prompt: string
}
export function * ChatSaga(opts: ChatSagaOtps) {
  try {
    const { prompt } = opts
    yield * put({ type: 'CHAT_COMPLETION_STARTED', payload: { message: prompt } })
    const chatSession = yield * select((state: AppState) => state.chatSession)

    // ----------------------------------------------------------------- //
    // Fetch a Completion
    // ----------------------------------------------------------------- //
    const assistantMessage = yield * StreamCompletionSaga({ chatSession })
    yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: assistantMessage } })

    // ----------------------------------------------------------------- //
    // Handle Any Tool Calls
    // ----------------------------------------------------------------- //
    let toolCalls = assistantMessage.tool_calls ?? []
    if (toolCalls.length) yield * ToolCallLoopSaga({ assistantMessage, toolCalls })

    // ----------------------------------------------------------------- //
    // Then we're done
    // ----------------------------------------------------------------- //
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
