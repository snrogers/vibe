import type { ChatCompletionMessageToolCall } from "openai/resources";
import type { z } from "zod";

import type { AnyZodType } from "@/lib/Types";
import type { SystemMessage, ToolMessage } from "@/lib/Domain/ChatSession";
import type { JsonSchema } from "json-schema-to-zod";

import type { BashTool } from "./BashTool";


/**
 * A function that handles a tool call with the given arguments.
 * @template ArgsSchema - The schema type for the tool call arguments.
 * @param {z.TypeOf<ArgsSchema>} toolCall - The tool call arguments.
 * @returns {Promise<ToolMessage>} A promise that resolves to a ToolMessage.
 */
export type ToolCallHandler<
  ArgsSchema extends AnyZodType = AnyZodType,
> = (toolCall: z.TypeOf<ArgsSchema>) => Promise<(ToolMessage|SystemMessage)[]>
export type AnyToolCallHandler = ToolCallHandler<any>

/**
 * Extracts the argument schema type from a ToolCallHandler.
 * @template T - The ToolCallHandler type.
 * @returns {T extends ToolCallHandler<infer ArgsSchema> ? ArgsSchema : never} The argument schema type.
 */
export type ToolCallHandlerArgs<T extends AnyToolCallHandler> =
  T extends ToolCallHandler<infer ArgsSchema>
  ? ArgsSchema
  : never

/**
 * Represents a tool with a name, description, argument schema, and handler.
 * @template Name - The name of the tool.
 * @template Description - The description of the tool.
 * @template ArgsSchema - The schema for the tool's arguments.
 */
export type Tool<
  Name        extends string         = string,
  Description extends string         = string,
  ArgsSchema  extends AnyZodType     = AnyZodType,
> = {
  name:        Name;
  description: Description;
  argsSchema:  ArgsSchema;
  handler:     ToolCallHandler<ArgsSchema>;
  reminder?:   string;
  jsonSchema?: Record<string, unknown>;
};
export type AnyTool = Tool<any, any, any>

/**
 * Extracts the argument schema type from a Tool.
 * @template T - The Tool type.
 * @returns {T extends Tool<any, any, infer ArgsSchema> ? ArgsSchema : never} The argument schema type.
 */
export type ToolArgsSchema<
  T extends Tool = Tool,
> = T extends Tool<any, any, infer ArgsSchema> ? ArgsSchema : never
