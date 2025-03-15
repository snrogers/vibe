import type { ChatCompletionChunk, ChatCompletionMessage, ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import type { CompletionDelta } from "./Saga/StreamCompletionSaga";
import type { ChatMessage, ToolMessage } from "../Domain/ChatSession";
import type { ErrorObject } from "serialize-error";
import type { Key } from "ink";


export type AppEvent =
  | PROMPT_SUBMITTED
  | CHAT_COMPLETION_SUCCESS
  | CHAT_COMPLETION_FAILURE
  | CHAT_COMPLETION_STREAM_PARTIAL
  | DEBUG_MODE_SET
  | EVENT_LOG
  | GENERIC_DEBUG_EVENT
  | KEY_INPUT
  | TOOL_CONFIRMED
  | TOOL_REQUEST_CONFIRMATION
  | TOOLS_COMPLETE


export type PROMPT_SUBMITTED =
  Event<'PROMPT_SUBMITTED', { prompt: string }>

export type CHAT_COMPLETION_SUCCESS =
  Event<'CHAT_COMPLETION_SUCCESS', { message: ChatMessage }>

export type CHAT_COMPLETION_FAILURE =
  Event<'CHAT_COMPLETION_FAILURE', { error: unknown }>

export type CHAT_COMPLETION_STREAM_PARTIAL =
  Event<'CHAT_COMPLETION_STREAM_PARTIAL', { partialCompletion: CompletionDelta }> // TODO: Implement

export type DEBUG_MODE_SET =
  Event<'DEBUG_MODE_SET', { debugMode: boolean }>

export type EVENT_LOG =
  Event<'EVENT_LOG', { event: AppEvent }>

export type GENERIC_DEBUG_EVENT =
  Event<`debug/${string}`, {}>

export type KEY_INPUT =
  Event<'KEY_INPUT', { key: Key }>

export type TOOL_CONFIRMED =
  Event<'TOOL_CONFIRMED', { isConfirmed: boolean }>

export type TOOL_REQUEST_CONFIRMATION =
  Event<'TOOL_REQUEST_CONFIRMATION', { toolCall: ChatCompletionMessageToolCall }>

export type TOOLS_COMPLETE =
  Event<'TOOLS_COMPLETE', { messages: ToolMessage[] }>


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


