import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources/index.mjs";
import { z, type ZodTypeAny } from "zod";
import { zu } from "zod_utilz";

import { logger } from "@/lib/Services/LogService";

import type { AnyTool, Tool } from "../Types";
import { CurlArgumentsSchema, StringifiedCurlArgumentsSchema } from "./Args";
import { handleCurlToolCall } from "./handleCurlToolCall";


const description =`
  Make an HTTP request using curl.
  The body should be a string, and the content type can be specified in the headers (e.g., "Content-Type": "application/json" for JSON).
`

export const CurlTool = {
  name:        'curl',
  description,
  argsSchema:  CurlArgumentsSchema,
  handler:     handleCurlToolCall,
} as const satisfies Tool

