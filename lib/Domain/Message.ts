import type { ChatCompletionAssistantMessageParam, ChatCompletionMessageParam, ChatCompletionDeveloperMessageParam, ChatCompletionSystemMessageParam, ChatCompletionToolMessageParam, ChatCompletionUserMessageParam } from "openai/resources"

export type AssistantMessage = ChatCompletionAssistantMessageParam
export type ChatMessage      = ChatCompletionMessageParam
export type DeveloperMessage = ChatCompletionDeveloperMessageParam
export type SystemMessage    = ChatCompletionSystemMessageParam
export type ToolMessage      = ChatCompletionToolMessageParam
export type UserMessage      = ChatCompletionUserMessageParam
