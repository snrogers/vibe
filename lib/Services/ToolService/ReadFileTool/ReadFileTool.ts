import { zu } from "zod_utilz";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";
import { ReadFileArgumentsSchema } from "./Schema";
import { logger } from "@/lib/Services/LogService";
import { z } from "zod";

export const ReadFileTool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "read_file",
    description: "Read the contents of a file given its path.",
    parameters: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "The path to the file to read.",
        },
      },
      required: ["file_path"],
    },
  },
};

const StringifiedArgumentsSchema = zu.stringToJSON().pipe(ReadFileArgumentsSchema);

export const handleReadFileToolCall = async (
  toolCall: ChatCompletionMessageToolCall
): Promise<ToolMessage> => {
  try {
    const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
    const args = StringifiedArgumentsSchema.parse(argsJson);
    const { file_path } = args;

    logger.log("info", "Handling ReadFileToolCall", { file_path });

    const file = Bun.file(file_path);
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
  } catch (error) {
    logger.log("error", "Error handling ReadFileToolCall", error);

    if (error instanceof z.ZodError) {
      return {
        role: "tool",
        tool_call_id: toolCall.id,
        content: `Error parsing arguments: ${error.message}`,
      };
    }

    if (error instanceof Error) {
      return {
        role: "tool",
        tool_call_id: toolCall.id,
        content: `Error handling ReadFileToolCall: ${error.message}`,
      };
    }

    throw error;
  }
};
