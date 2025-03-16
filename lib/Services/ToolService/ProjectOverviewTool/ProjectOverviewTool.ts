import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import { z } from "zod";
import { zu } from "zod_utilz";

import { logger } from "@/lib/Services/LogService";

import { ProjectOverviewArgumentsSchema } from "./Args";
import { buildTree, getIgnoreFunction, printTree } from "./Utils";
import type { Tool } from "../Types";
import { handleProjectOverviewToolCall } from "./handleProjectOverviewToolCall";


const description = `
  Generate a project overview for the current directory.
  Returns a tree structure of the project files and directories.

  <example>
    {
      "root_dir": "/Users/someDude/hisProject"
    }
  </example>
`


export const ProjectOverviewTool = {
  name: 'project_overview',
  description,
  argsSchema: ProjectOverviewArgumentsSchema,
  handler: handleProjectOverviewToolCall,
} as const satisfies Tool
