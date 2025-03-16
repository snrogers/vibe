import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import { z } from "zod";
import { zu } from "zod_utilz";

import { ProjectOverviewArgumentsSchema } from "./Schema";
import { buildTree, getIgnoreFunction, printTree } from "./Utils";
import { logger } from "../../LogService";

export const ProjectOverviewTool = {
  type: 'function',
  function: {
    name: 'project_overview',
    description: `
      Generate a project overview for the current directory.
      Returns a tree structure of the project files and directories.
    `,
    parameters: {
      type: 'object',
      properties: {
        root_dir: {
          type: 'string',
          description: 'The root directory of the project.',
        },
      },
      required: ['root_dir'],
    },
  },
} satisfies ChatCompletionTool

const StringifiedArgumentsSchema = zu.stringToJSON().pipe(
  ProjectOverviewArgumentsSchema,
)
export const handleProjectOverviewToolCall = async (toolCall: ChatCompletionMessageToolCall): Promise<ToolMessage> => {
  try {
    const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
    const args = StringifiedArgumentsSchema.parse(argsJson);
    logger.log('info', 'Handling ProjectOverviewToolCall', args)

    const rootDir    = process.cwd();
    const ignoreFunc = await getIgnoreFunction(rootDir);
    const tree       = await buildTree(rootDir, ignoreFunc, rootDir);
    const result     = printTree(tree);

    logger.log('info', 'Handled ProjectOverviewToolCall', result)

    return {
      role: 'tool',
      tool_call_id,
      content: result
    }
  } catch (error) {
    logger.log('error', 'Error handling ProjectOverviewToolCall', error)

    if (error instanceof z.ZodError) {
      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: `Error handling ProjectOverviewToolCall: ${error.message}`
      }
    }

    if (error instanceof Error) {
      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: `Error handling ProjectOverviewToolCall: ${error.message}`
      }
    }

    throw error
  }
};
