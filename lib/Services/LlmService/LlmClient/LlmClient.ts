import type { APIPromise } from "openai/core";
import type { ChatCompletion, ChatCompletionChunk, ChatCompletionTool } from "openai/resources";
import type { Stream } from "openai/streaming";

import type { ChatSession }    from "@/lib/Domain/ChatSession";
import type { Simplify } from "@/lib/Types";


export type CompletionOpts = {
  max_tokens?:  number
  n?:           number
  stop?:        string | string[]
  stream?:      boolean
  temperature?: number
  tool_choice?: 'auto' | 'required' | 'none'
  tools:        ChatCompletionTool[]
  top_p?:       number
}

export type StreamCompletionOpts = Simplify<
  CompletionOpts & { stream: true }
>

export abstract class LlmClient {
  abstract getModel(): string

  abstract generateCompletion(
    chatSession: ChatSession,
    completionOpts: StreamCompletionOpts
  ): APIPromise<Stream<ChatCompletionChunk>>
  abstract generateCompletion(
    chatSession: ChatSession
  ): APIPromise<ChatCompletion | Stream<ChatCompletionChunk>>
}
