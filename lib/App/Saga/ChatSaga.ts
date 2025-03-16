import { all, call, cancelled, put, select, take, takeEvery } from 'typed-redux-saga'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '../AppState'
import { StreamCompletionSaga } from './StreamCompletionSaga'
import { serializeError } from 'serialize-error'
import { ToolService } from '@/lib/Services/ToolService'
import type { ToolMessage } from '@/lib/Domain/ChatSession'
import { ToolCallSaga } from './ToolCallSaga'


export function * ChatSaga() {
  while (true) {
    try {
      const userPrompt  = yield * take<AppEvent>('PROMPT_SUBMITTED')
      const chatSession = yield * select((state: AppState) => state.chatSession)

      yield * put({ type: 'CHAT_COMPLETION_STARTED', payload: { message: userPrompt } })

      const assistantMessage = yield * StreamCompletionSaga({ chatSession })
      yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: assistantMessage } })

      // Execute Tool Calls
      let toolCalls = assistantMessage.tool_calls ?? []
      while (toolCalls.length) {
        const toolMessages: ToolMessage[] = yield * all(toolCalls.map(
          (toolCall) => ToolCallSaga({ toolCall })
        ))

        yield * put({ type: 'TOOLS_COMPLETE', payload: { messages: toolMessages } })

        const chatSessionWithToolCallResults = yield * select((state: AppState) => state.chatSession)

        // Respond with Tool Call Results
        const assistantMessage = yield * StreamCompletionSaga({ chatSession: chatSessionWithToolCallResults })
        yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: assistantMessage } })

        toolCalls = assistantMessage.tool_calls ?? []
      }

      yield * put({ type: 'CHAT_COMPLETION_FINISHED', payload: { message: assistantMessage } })
    } catch (error) {
      if (yield * cancelled()) {
        yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
        return
      }
      yield * put({ type: 'debug/error', payload: { error: serializeError(new Error('wtf why are we here in ChatSaga->error?NOTcancelled')) } })
      yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
      console.error(error)
    }
  }
}
