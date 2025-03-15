import type { ChatCompletionChunk, ChatCompletionMessage } from "openai/resources/index.mjs";


export type AppEvent =
  | PROMPT_SUBMITTED
  | CHAT_COMPLETION_SUCCESS
  | CHAT_COMPLETION_FAILURE
  | CHAT_COMPLETION_STREAM_PARTIAL


export type PROMPT_SUBMITTED =
  Event<'PROMPT_SUBMITTED', { prompt: string }>

export type CHAT_COMPLETION_SUCCESS =
  Event<'CHAT_COMPLETION_SUCCESS', { message: ChatCompletionMessage }>

export type CHAT_COMPLETION_FAILURE =
  Event<'CHAT_COMPLETION_FAILURE', { error: Error }>

export type CHAT_COMPLETION_STREAM_PARTIAL =
  Event<'CHAT_COMPLETION_STREAM_PARTIAL', { chunk: never }> // TODO: Implement


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

