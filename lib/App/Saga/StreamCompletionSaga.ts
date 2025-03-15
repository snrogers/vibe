import { call, select, take, takeEvery } from 'typed-redux-saga'
import { serializeError } from 'serialize-error'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppState'
import type { ChatMessage, ChatSession } from '@/lib/Domain/ChatSession'
import { channelFromAsyncIterable, put } from '@/lib/App/Utils'
import type { ChatCompletionChunk } from 'openai/resources'
import { mergeDeltas } from '@/lib/Services/LlmService/processStream'


export type PartialCompletion = ChatCompletionChunk.Choice.Delta

type StreamCompletionSagaOpts = {
  chatSession: ChatSession
}
export function * StreamCompletionSaga({ chatSession }: StreamCompletionSagaOpts) {
  let partialCompletion: PartialCompletion = {}

  try {
    const completion  = yield * call(
      LlmService.streamChatCompletion,
      chatSession,
    )

    const channel = channelFromAsyncIterable(completion)

    // Rely on the channel END-ing to exit the loop
    while (true) {
      const chunk = (yield * take(channel)) as any
      partialCompletion = mergeDeltas(partialCompletion, chunk.choices[0]?.delta)

      yield * put({ type: 'CHAT_COMPLETION_STREAM_PARTIAL', payload: { partialCompletion } })
    }
  } catch (error) {
    yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
  } finally {
    return partialCompletion as ChatMessage
    // yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: partialCompletion as ChatMessage } })
  }
}
