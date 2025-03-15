import type { ChatCompletionChunk } from "openai/resources"
import type { Stream } from "openai/streaming"

import { pp } from "@/lib/Utils";
import type { ChatMessage } from "@/lib/Domain/ChatSession";
import { channelFromAsyncIterable } from "@/lib/App/Utils";
import { mergeDeepLeft } from "rambdax";


type Delta         = ChatCompletionChunk.Choice.Delta;
type DeltaToolCall = NonNullable<Delta['tool_calls']>[number]

export const mergeDeltas = (acc: Delta, delta: Delta): Delta => {
  return mergeDeepLeft(acc, delta)
}
