import { call, cancelled, select, take, takeEvery } from 'typed-redux-saga'
import { serializeError } from 'serialize-error'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppState'
import type { ChatMessage, ChatSession } from '@/lib/Domain/ChatSession'
import { channelFromAsyncIterable, END, put } from '@/lib/App/Utils'
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

    const asyncIterator:AsyncIterator<any> = completion[Symbol.asyncIterator]()
    const chunks = []
    while (true) {
      const chunkP = asyncIterator.next()
      const chunkResult = (yield chunkP) as any
      const chunk = chunkResult.value
      const done = chunkResult.done
      if (done) break

      partialCompletion = mergeDeltas(partialCompletion, chunk.choices[0]?.delta)
      yield * put({ type: 'CHAT_COMPLETION_STREAM_PARTIAL', payload: { partialCompletion } })
    }
  } catch (error) {
    yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
  }

  return partialCompletion as ChatMessage
}
