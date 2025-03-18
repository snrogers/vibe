import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall } from "openai/resources";

import { logger } from "@/lib/Services/LogService";

import { getIgnoreFunction, buildTree, printTree } from "./Utils";
import { StringifiedProjectOverviewArgumentsSchema } from "./Args";


export const handleProjectOverviewToolCall = async (toolCall: ChatCompletionMessageToolCall): Promise<ToolMessage> => {
  const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
  const args = StringifiedProjectOverviewArgumentsSchema.parse(argsJson);
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
};
