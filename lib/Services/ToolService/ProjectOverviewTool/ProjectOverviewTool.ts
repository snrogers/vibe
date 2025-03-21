import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import { z } from "zod";
import { zu } from "zod_utilz";

import { logger } from "@/lib/Services/LogService";

import { ProjectOverviewArgumentsSchema } from "./Args";
import { buildTree, getIgnoreFunction, printTree } from "./Utils";
import { handleProjectOverviewToolCall } from "./handleProjectOverviewToolCall";
import type { Tool } from "../Types";


const description = `
  Generate a project overview for the current directory.
  Returns a tree structure of the project files and directories.

  <example>
    {
      "root_dir": "/Users/someDude/hisProject"
    }
  </example>
`

  const jsonSchema = {
    type: 'object',
    description,
    properties: {
      root_dir: {
        type: 'string',
        description: 'The root directory of the project.',
      },
    },
    required: ['root_dir'],
  };

export const ProjectOverviewTool = {
  name: 'project_overview',
  description,
  argsSchema: ProjectOverviewArgumentsSchema,
  handler: handleProjectOverviewToolCall,
  jsonSchema,
} as const satisfies Tool
