import { call, cancelled, select, take, takeEvery } from 'typed-redux-saga'
import { serializeError } from 'serialize-error'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppState'
import type { AssistantMessage, ChatMessage, ChatSession } from '@/lib/Domain/ChatSession'
import { channelFromAsyncIterable, END, mapAsyncIterable, put } from '@/lib/App/Utils'
import type { ChatCompletionChunk } from 'openai/resources'
import { mergeDeltas } from '@/lib/Services/LlmService/processStream'
import { logger, LogService } from '@/lib/Services/LogService'
import { mergeLeft } from 'rambdax'
import { dump } from '@/lib/Utils'
import { mergeChunks, type AnyChunk } from '@/lib/Services/LlmService/mergeChunks'
import type { FunctionToolCall } from 'openai/resources/beta/threads/runs/steps.mjs'
import type { Usage } from '@/lib/Services/LlmService/Types'


export type CompletionDelta = ChatCompletionChunk.Choice.Delta
export type DeltaToolCall = any // fuck it // FIXME: unfuck it

type StreamCompletionSagaOpts = {
  chatSession: ChatSession
}
export function * StreamCompletionSaga({ chatSession }: StreamCompletionSagaOpts) {
  let partialCompletion: CompletionDelta = {}
  let partialContent: string = '';
  let role: string | undefined;
  let toolCalls: DeltaToolCall[] | undefined;
  let usage: Usage | undefined;

  try {
    const completion  = yield * call(
      LlmService.streamChatCompletion,
      chatSession,
    )

    yield * mapAsyncIterable(
      completion,
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
        yield * put({ type: 'CHAT_COMPLETION_STREAM_PARTIAL', payload: { partialCompletion } })
      }
    )
  } catch (error) {
    yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
  }

  return {
    assistantMessage: {
      content: partialContent,
      role: 'assistant' as const,
      tool_calls: toolCalls
    },
    usage
  }
}
