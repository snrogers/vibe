import type { ChatCompletionMessageToolCall } from 'openai/resources'
import { serializeError } from 'serialize-error'
import { all, call, cancelled, put, select, take, takeEvery } from 'typed-redux-saga'

import type { AssistantMessage } from '@/lib/Domain/ChatSession'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppState'
import type { ToolMessage } from '@/lib/Domain/ChatSession'
import { LlmService } from '@/lib/Services/LlmService'
import { StreamCompletionSaga } from '@/lib/App/Saga/StreamCompletionSaga'
import { ToolCallSaga } from '@/lib/App/Saga/ToolCallSaga'
import { ToolService } from '@/lib/Services/ToolService'
import { logger } from '@/lib/Services/LogService'


const TOOL_CALL_LIMIT = 5

type ToolCallLoopSagaOpts = {
  assistantMessage: AssistantMessage
  toolCalls:        ChatCompletionMessageToolCall[]
}
export function * ToolCallLoopSaga(opts: ToolCallLoopSagaOpts) {
  try {
    let toolCalls           = opts.toolCalls
    let assistantMessage    = opts.assistantMessage
    let processingToolCalls = true
    let numLoops            = 0

    while (processingToolCalls) {
      numLoops++

      // ----------------------------------------------------------------- //
      // Break if we've reached the limit
      // We'll check afterwards to see if there's a dangling AssistantMesage.
      // If so, we'll replace it with a little pep talk session.
      // ----------------------------------------------------------------- //
      if (numLoops > TOOL_CALL_LIMIT) {
        logger.log('info', `Too many tool calls, stopping here.`)

        yield * put({ type: 'CHAT_COMPLETION_PEP_TALK', payload: { message: assistantMessage } })

        yield * put({ type: 'CHAT_COMPLETION_FINISHED', payload: { message: assistantMessage } })

        break
      }

      // ----------------------------------------------------------------- //
      // Otherwise Crunch the Tool calls and wait for the results
      // ----------------------------------------------------------------- //
      const toolMessages: ToolMessage[] = yield * all(toolCalls.map(
        (toolCall) => ToolCallSaga({ toolCall })
      ))
      yield* put({ type: 'TOOLS_COMPLETE', payload: { messages: toolMessages } })

      // Respond with Tool Call Results
      const chatSessionWithToolCallResults = yield* select((state: AppState) => state.chatSession)
      const assistantMessage = yield* StreamCompletionSaga({ chatSession: chatSessionWithToolCallResults })
      yield* put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: assistantMessage } })

      toolCalls = assistantMessage.tool_calls ?? []
    }
  } catch (error) {
    if (yield* cancelled()) {
      yield* put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
      return
    }

    yield* put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
    console.error(error)
  }

}
