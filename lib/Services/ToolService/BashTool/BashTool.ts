import { appStore } from "@/lib/App";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";

import type { Tool } from "../Types";
import { BashToolArgsSchema } from "./Args";
import { handleBashToolCall } from "./handleBashToolCall";


const description = `
  Execute Bash commands to access shell functionality (e.g., file operations, system info).
  Returns command output or error if it fails.

  <example>
    { "command": "ls -l" }
  </example>
`

const jsonSchema = {
  type: 'object',
  description,
  properties: {
    command: {
      type: 'string',
      description: 'The bash command to execute.',
    },
  },
  required: ['command'],
};

// Define the BashTool with the new structure
export const BashTool = {
  name: "bash",
  description,
  argsSchema: BashToolArgsSchema,
  jsonSchema,
  handler: handleBashToolCall,
} as const satisfies Tool

