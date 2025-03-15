import type { ChatCompletionChunk } from "openai/resources"
import type { Stream } from "openai/streaming"

import { pp } from "@/lib/Utils";
import type { ChatMessage } from "@/lib/Domain/ChatSession";
import { channelFromAsyncIterable } from "@/lib/App/Utils";


type Delta         = ChatCompletionChunk.Choice.Delta;
type DeltaToolCall = NonNullable<Delta['tool_calls']>[number]

/** WARNING: Mutates `sum` */
export const mergeDeltas = (acc: Delta, delta: Delta) => {
  const sum = { ...acc }

  if (delta.content) {
    sum.content ??= '';
    sum.content += delta.content;
  }

  if (delta.role) {
    sum.role ??= '' as any;
    sum.role += delta.role;
  }

  if (delta.function_call) {
    sum.function_call ??= {};
    if (delta.function_call.name) {
      sum.function_call.name ??= '';
      sum.function_call.name += delta.function_call.name;
    }

    if (delta.function_call.arguments) {
      sum.function_call.arguments ??= '';
      sum.function_call.arguments += delta.function_call.arguments;
    }
  }

  if (delta.refusal) {
    sum.refusal ??= '';
    sum.refusal += delta.refusal;
  }

  if (delta.tool_calls) {
    sum.tool_calls ??= [];

    delta.tool_calls.forEach((toolCallDelta) => {
      const toolCall: Partial<DeltaToolCall> = sum.tool_calls?.find(
        (toolCall) => toolCall.index === toolCallDelta.index
      ) ?? {}

      toolCall.id ??= '' as any;
      toolCall.id += toolCallDelta.id ?? ''

      toolCall.type ??= '' as any;
      toolCall.type += toolCallDelta.type ?? ''

      toolCall.function ??= {};
      if (toolCallDelta.function?.name) {
        toolCall.function.name ??= '';
        toolCall.function.name += toolCallDelta.function.name ?? ''
      }

      if (toolCallDelta.function?.arguments) {
        toolCall.function.arguments ??= '';
        toolCall.function.arguments += toolCallDelta.function?.arguments;
      }
    });
  }

  return sum
}
