import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall } from "openai/resources";

import { logger } from "@/lib/Services/LogService";
import { StringifiedReadFileArgumentsSchema } from "./Schema";

export async function handleReadFileToolCall(
  toolCall: ChatCompletionMessageToolCall
): Promise<ToolMessage> {
  const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
  const args = StringifiedReadFileArgumentsSchema.parse(argsJson);
  const { file_path } = args;

  logger.log("info", "Handling ReadFileToolCall", { file_path });

  const file    = Bun.file(file_path);
  const content = await file.text();

  logger.log("info", "Handled ReadFileToolCall", {
    file_path,
    content: content.substring(0, 100),
  });

  return {
    role: "tool",
    tool_call_id,
    content,
  };
};
