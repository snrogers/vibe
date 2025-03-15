import { call, cancelled, select, take, takeEvery } from 'typed-redux-saga'
import { serializeError } from 'serialize-error'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppState'
import type { AssistantMessage, ChatMessage, ChatSession } from '@/lib/Domain/ChatSession'
import { channelFromAsyncIterable, END, mapAsyncIterable, put } from '@/lib/App/Utils'
import type { ChatCompletionChunk } from 'openai/resources'
import { mergeDeltas } from '@/lib/Services/LlmService/processStream'


export type CompletionDelta = ChatCompletionChunk.Choice.Delta

type StreamCompletionSagaOpts = {
  chatSession: ChatSession
}
export function * StreamCompletionSaga({ chatSession }: StreamCompletionSagaOpts) {
  let partialCompletion: CompletionDelta = {}

  try {
    const completion  = yield * call(
      LlmService.streamChatCompletion,
      chatSession,
    )

    yield * mapAsyncIterable(
      completion,
      function * (chunk: ChatCompletionChunk) {
        yield * put({ type: 'debug/chunk' as const, payload: { chunk, partialCompletion } })
        partialCompletion = mergeDeltas(partialCompletion, chunk.choices[0]?.delta)
        yield * put({ type: 'CHAT_COMPLETION_STREAM_PARTIAL', payload: { partialCompletion } })
      }
    )
  } catch (error) {
    yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
  }

  return partialCompletion as AssistantMessage
}
