import { call, cancelled, select, take, takeEvery, type SagaGenerator } from 'typed-redux-saga'
import { serializeError } from 'serialize-error'

import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppState'
import type { AssistantMessage, ChatSession } from '@/lib/Domain/ChatSession'
import type { ChatCompletionChunk } from 'openai/resources'
import type { FunctionToolCall } from 'openai/resources/beta/threads/runs/steps.mjs'
import type { Stream } from 'openai/streaming.mjs'
import type { Usage } from '@/lib/Services/LlmService/Types'
import { LlmService } from '@/lib/Services/LlmService'
import { channelFromAsyncIterable, END, mapAsyncIterable, put } from '@/lib/App/Utils'
import { dump } from '@/lib/Utils'
import { getPrompt } from '@/lib/Services/LlmService/Prompt'
import { logger } from '@/lib/Services/LogService'
import { mergeChunks, type AnyChunk } from '@/lib/Services/LlmService/mergeChunks'
import { mergeLeft } from 'rambdax'


export type CompletionDelta = ChatCompletionChunk.Choice.Delta
export type DeltaToolCall = any // fuck it // FIXME: unfuck it

type StreamCompletionSagaOpts = {
  chatSession:         ChatSession
  footerSystemPrompt?: string
  headerSystemPrompt?: string
}
export function * StreamCompletionSaga(opts: StreamCompletionSagaOpts) {
  const {
    chatSession,
    footerSystemPrompt,
    headerSystemPrompt = getPrompt(),
  } = opts

  try {
    const chunkStream  = yield * call(
      LlmService.streamChatCompletion,
      chatSession,
    )

    const { assistantMessage, usage } = yield * collectChunks(
      chunkStream,
      function * (partialCompletion: CompletionDelta) {
        yield * put({ type: 'CHAT_COMPLETION_STREAM_PARTIAL', payload: { partialCompletion } })
      }
    )

    yield* put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { assistantMessage, usage } })

    return { assistantMessage, usage }
  } catch (error) {
    yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
    throw error
  }
}

// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //
function * collectChunks(chunkStream: Stream<ChatCompletionChunk>, onAccumulate?: (delta: CompletionDelta) => SagaGenerator<any, any>) {
  let partialCompletion: CompletionDelta = {}
  let partialContent: string = '';
  let role: string | undefined;
  let toolCalls: DeltaToolCall[] | undefined;
  let usage: Usage | undefined;

  yield * mapAsyncIterable(
    chunkStream,
    function * (chunk: ChatCompletionChunk) {
      logger.log('info', 'Chunk received', chunk)

      const maybeRole       = chunk.choices[0]?.delta?.role
      const maybeContent    = chunk.choices[0]?.delta?.content
      const maybeTool_calls = chunk.choices[0]?.delta?.tool_calls
      const maybeUsage      = chunk.usage

      if (maybeRole)       role           ??= maybeRole
      if (maybeContent)    partialContent += maybeContent
      if (maybeTool_calls) toolCalls      ??= maybeTool_calls
      if (maybeUsage)      usage          ??= maybeUsage

      toolCalls = chunk.choices[0]?.delta?.tool_calls

      const partialCompletion: CompletionDelta = {
        ...chunk.choices[0]?.delta,
        content: partialContent,
        role: role as any
      }

      if (onAccumulate) yield * onAccumulate(partialCompletion)

      yield * put({ type: 'CHAT_COMPLETION_STREAM_PARTIAL', payload: { partialCompletion } })
    }
  )

  return {
    assistantMessage: {
      content:    partialContent,
      role:       'assistant' as const,
      tool_calls: toolCalls
    },
    usage: usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
  }
}
