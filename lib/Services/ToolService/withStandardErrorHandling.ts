import { ZodError } from "zod";

import type { AnyAsyncFn } from "@/lib/Types";
import type { ToolCallHandler } from "./Types";
import { ENV } from "@/lib/Constants";
import { ToolNotFoundError } from "./ToolService";


export function withStandardErrorHandling<T extends ToolCallHandler = ToolCallHandler>(
  fn: T
): T {
  return async function (toolCall) {
    try {
      const result = await fn(toolCall);
      return result
    } catch (error) {
      // Handle ParseError on the ToolCall
      if (error instanceof ZodError) {
        return {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: `Error parsing arguments: ${error.message}`,
        };
      }

      // Handle Non-Existent Tool
      if (error instanceof ToolNotFoundError) {
        return {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: `Error: ${error.message}`,
        };
      }

      // Generic error handling
      if (error instanceof Error) {
        if (ENV === 'development') {
          return {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: `Error: ${error.message}`,
          };
        }
      }

      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: `Error: Internal Tool Error`,
      };
    }
  } as T
}
