import type { ChatCompletionChunk, ChatCompletionMessage, ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import type { CompletionDelta } from "./Saga/StreamCompletionSaga";
import type { ChatMessage, ChatSession, ToolMessage } from "../Domain/ChatSession";
import type { ErrorObject } from "serialize-error";
import type { Key } from "ink";
import type { Simplify } from "../Types";


// ----------------------------------------------------------------- //
// Type Unions
// ----------------------------------------------------------------- //
export type AppEventType    = EventType<AppEvent>
export type AppEventPayload = EventPayload<AppEvent>

export type AppEvent =
  | CHAT_COMPACTION_SUCCESS
  | CHAT_COMPLETION_STARTED
  | CHAT_COMPLETION_SUCCESS
  | CHAT_COMPLETION_FAILURE
  | CHAT_COMPLETION_FINISHED
  | CHAT_COMPLETION_STREAM_PARTIAL
  | CHAT_SESSION_RESET
  | CHAT_SESSION_RECOVER
  | DEBUG_MODE_SET
  | EVENT_LOG
  | GENERIC_DEBUG_EVENT
  | INPUT_SUBMITTED
  | KEY_INPUT
  | PROMPT_SUBMITTED
  | SET_INSPECT_MODE
  | TOOL_CONFIRMED
  | TOOL_REQUEST_CONFIRMATION
  | TOOLS_COMPLETE


// ----------------------------------------------------------------- //
// Type Helpers
// ----------------------------------------------------------------- //
export type AppEventDict<T extends AppEventType> =
  Simplify<AppEvent & { type: T }>

export type AppEventPayloadDict<T extends AppEventType> =
  Simplify<EventPayload<AppEvent & { type: T }>>


// ----------------------------------------------------------------- //
// Types
// ----------------------------------------------------------------- //
export type CHAT_COMPACTION_SUCCESS =
  Event<'CHAT_COMPACTION_SUCCESS', { compactedChatSession: ChatSession }>

export type CHAT_COMPLETION_PEP_TALK =
  Event<'CHAT_COMPLETION_PEP_TALK'>

export type CHAT_COMPLETION_STARTED =
  Event<'CHAT_COMPLETION_STARTED', { message: string }>

export type CHAT_COMPLETION_SUCCESS =
  Event<'CHAT_COMPLETION_SUCCESS', { message: ChatMessage }>

export type CHAT_COMPLETION_FAILURE =
  Event<'CHAT_COMPLETION_FAILURE', { error: unknown }>

export type CHAT_COMPLETION_FINISHED =
  Event<'CHAT_COMPLETION_FINISHED'>

export type CHAT_COMPLETION_STREAM_PARTIAL =
  Event<'CHAT_COMPLETION_STREAM_PARTIAL', { partialCompletion: CompletionDelta }> // TODO: Implement

export type CHAT_SESSION_RESET =
  Event<'CHAT_SESSION_RESET'>

export type CHAT_SESSION_RECOVER =
  Event<'CHAT_SESSION_RECOVER'>

export type DEBUG_MODE_SET =
  Event<'DEBUG_MODE_SET', { debugMode: boolean }>

export type EVENT_LOG =
  Event<'EVENT_LOG', { event: AppEvent }>

export type GENERIC_DEBUG_EVENT =
  Event<`debug/${string}`, {}>

export type INPUT_SUBMITTED =
  Event<'INPUT_SUBMITTED', { input: string }>

export type KEY_INPUT =
  Event<'KEY_INPUT', { key: Key }>

export type PROMPT_SUBMITTED =
  Event<'PROMPT_SUBMITTED', { prompt: string }>

export type SET_INSPECT_MODE =
  Event<'SET_INSPECT_MODE', { inspectMode: boolean }>

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

export type EventType<EventType extends AppEvent> = EventType['type']
export type EventPayload<EventType extends AppEvent> = EventType['payload']
