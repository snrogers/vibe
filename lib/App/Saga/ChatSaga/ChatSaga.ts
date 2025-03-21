import { all, call, cancelled, select, take, takeEvery, takeLatest } from 'typed-redux-saga'
import { serializeError } from 'serialize-error'

import type { AppEvent, PROMPT_SUBMITTED } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppState'
import type { ToolMessage } from '@/lib/Domain/ChatSession'
import { LlmService } from '@/lib/Services/LlmService'
import { StreamCompletionSaga } from '@/lib/App/Saga/StreamCompletionSaga'
import { ToolService } from '@/lib/Services/ToolService'
import { logger } from '@/lib/Services/LogService'

import { ToolCallLoopSaga } from './ToolCallLoopSaga'
import { put, race } from '../../Utils'




// GAME PLAN:
// This Saga runs from the point the user says something,
// until the Asistant is finished responding and we
// return control to the user.
//
// That currently includes:
// - handling tool calls
//
// but in the future:
// - Deploying Agents
// - Automatic Compaction


const TOOL_CALL_LIMIT = 5

type ChatSagaOtps = {
  prompt: string
}
export function * ChatSaga(opts: ChatSagaOtps) {
  logger.log('info', 'ChatSaga->START', { opts })

  const { cancel } = yield * race({
    cancel: take('CHAT_COMPLETION_CANCEL'),
    success: call(function * () {
      try {
        const { prompt } = opts
        yield * put({ type: 'CHAT_COMPLETION_STARTED', payload: { message: prompt } })
        const chatSession = yield * select((state: AppState) => state.chatSession)

        // ----------------------------------------------------------------- //
        // Fetch a Completion
        // ----------------------------------------------------------------- //
        const completionResult = yield * StreamCompletionSaga({ chatSession })
        const { assistantMessage, usage } = completionResult

        // ----------------------------------------------------------------- //
        // Handle Any Tool Calls
        // ----------------------------------------------------------------- //
        let toolCalls = assistantMessage.tool_calls ?? []
        if (toolCalls.length) yield * ToolCallLoopSaga({ assistantMessage, toolCalls })
      } catch (error) {
        if (yield * cancelled()) {
          yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
          return
        }
        yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
        console.error(error)
      }
    })
  })

  if (cancel) {
    logger.log('info', 'ChatSaga->CANCELLED', { cancel })
  }

  logger.log('info', 'ChatSaga->END', { cancel })
}

export function * WatchChatSaga() {
  yield * takeLatest<PROMPT_SUBMITTED>(
    'PROMPT_SUBMITTED',
    ({ payload }) => ChatSaga(payload)
  )
}
