import { zodToJsonSchema } from "zod-to-json-schema";
import type { ChatCompletionTool } from "openai/resources/index.mjs";
import type { Tool } from "./Types";


export const openAiChatCompletionToolFromTool = (tool: Tool): ChatCompletionTool => {
  const { name, description, argsSchema } = tool;

  const parameters = zodToJsonSchema(argsSchema, `${name}Arguments`);

  return {
    type: 'function',
    function: { name, description, parameters },
  };
};
