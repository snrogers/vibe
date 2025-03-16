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
import { pp } from '@/lib/Utils'
import { mergeChunks, type AnyChunk } from '@/lib/Services/LlmService/mergeChunks'
import type { FunctionToolCall } from 'openai/resources/beta/threads/runs/steps.mjs'


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

  try {
    const completion  = yield * call(
      LlmService.streamChatCompletion,
      chatSession,
    )

    yield * mapAsyncIterable(
      completion,
      function * (chunk: ChatCompletionChunk) {
        logger.log('info', `Received chunk: ${pp(chunk.choices[0]?.delta)}`);

        const maybeRole       = chunk.choices[0]?.delta?.role
        const maybeContent    = chunk.choices[0]?.delta?.content
        const maybeTool_calls = chunk.choices[0]?.delta?.tool_calls

        if (maybeRole)       role           ??= maybeRole
        if (maybeContent)    partialContent += maybeContent
        if (maybeTool_calls) toolCalls      ??= maybeTool_calls

        toolCalls = chunk.choices[0]?.delta?.tool_calls

        const partialCompletion: CompletionDelta =
          {
            ...chunk.choices[0]?.delta,
            content: partialContent,
            role: role as any
          }
        // logger.log('info', `Merged chunk: ${pp(partialCompletion)}`);
        yield * put({ type: 'CHAT_COMPLETION_STREAM_PARTIAL', payload: { partialCompletion } })
      }
    )
  } catch (error) {
    yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
  }

  return {
    content: partialContent,
    role: role as any,
    tool_calls: toolCalls
  }
}
