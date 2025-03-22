import { call, cancelled, select, take } from 'typed-redux-saga'
import { serializeError } from 'serialize-error'

import type { AppState } from '@/lib/App/AppState'
import { StreamCompletionSaga } from '@/lib/App/Saga/StreamCompletionSaga'
import { logger } from '@/lib/Services/LogService'

import { ToolCallLoopSaga } from '../ToolCallLoopSaga'
import { put, race } from '../../Utils'




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
