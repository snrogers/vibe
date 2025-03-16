import type { ChatCompletionMessageToolCall } from "openai/resources";

import type { ToolMessage } from "@/lib/Domain/ChatSession";


export type ToolCallHandler = (toolCall: ChatCompletionMessageToolCall) => Promise<ToolMessage>
