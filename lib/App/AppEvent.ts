import type { ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/index.mjs";
import type { PartialCompletion } from "./Saga/StreamCompletionSaga";
import type { ChatMessage } from "../Domain/ChatSession";


export type AppEvent =
  | PROMPT_SUBMITTED
  | CHAT_COMPLETION_SUCCESS
  | CHAT_COMPLETION_FAILURE
  | CHAT_COMPLETION_STREAM_PARTIAL
  | DEBUG_MODE_SET


export type PROMPT_SUBMITTED =
  Event<'PROMPT_SUBMITTED', { prompt: string }>

export type CHAT_COMPLETION_SUCCESS =
  Event<'CHAT_COMPLETION_SUCCESS', { message: ChatMessage }>

export type CHAT_COMPLETION_FAILURE =
  Event<'CHAT_COMPLETION_FAILURE', { error: Error }>

export type CHAT_COMPLETION_STREAM_PARTIAL =
  Event<'CHAT_COMPLETION_STREAM_PARTIAL', { partialCompletion: PartialCompletion }> // TODO: Implement

export type DEBUG_MODE_SET =
  Event<'DEBUG_MODE_SET', { debugMode: boolean }>


// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyEvent = Event<any, any>;

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false;

export type Event<EventType extends string, Payload = never> = Equal<
  Payload,
  never
> extends true
  ? { type: EventType; payload?: never }
  : { type: EventType; payload: Payload };

