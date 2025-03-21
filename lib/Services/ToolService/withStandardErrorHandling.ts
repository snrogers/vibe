import { ZodError } from "zod";

import type { AnyAsyncFn } from "@/lib/Types";
import { ENV, V_DEBUG } from "@/lib/Constants";
import { ToolNotFoundError } from "./ToolService";
import type { AnyToolCallHandler, ToolCallHandler, ToolCallHandlerArgs } from "./Types";
import { serializeError } from "serialize-error";


export function withStandardErrorHandling<T extends AnyToolCallHandler>(
  fn: T
): T {
  return async function (args: any) {
    try {
      const result = await fn(args);
      return result
    } catch (error) {
      // Handle ParseError on the ToolCall
      if (error instanceof ZodError) {
        return {
          role: 'tool',
          tool_call_id: args.id,
          content: `Error parsing arguments: ${error.message}`,
        };
      }

      // Handle Non-Existent Tool
      if (error instanceof ToolNotFoundError) {
        return {
          role: 'tool',
          tool_call_id: args.id,
          content: `Error: ${error.message}`,
        };
      }

      // Generic error handling
      if (error instanceof Error) {
        if (ENV === 'development') {
          return {
            role: 'tool',
            tool_call_id: args.id,
            content: `Error: ${error.message}`,
          };
        }
      }

      // Verbose error response in debug mode
      if (V_DEBUG || ENV === 'development') {
        return {
          role: 'tool',
          tool_call_id: args.id,
          content: JSON.stringify(serializeError(error)),
        };
      }

      return {
        role: 'tool',
        tool_call_id: args.id,
        content: `Error: Internal Tool Error`,
      };
    }
  } as T
}
