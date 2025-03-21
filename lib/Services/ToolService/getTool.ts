import type { ToolDef } from "./ToolDef";
import { BashTool } from "./BashTool";
import { FileReadTool } from "./FileReadTool";
import { ProjectOverviewTool } from "./ProjectOverviewTool";
import { openAiChatCompletionToolFromTool } from './Utils'
import type { ChatCompletionTool } from "openai/resources/index.mjs";


export function getCompletionTool<TDef extends ToolDef>(toolDef: TDef) {
  const { name, description, jsonSchema } = toolDef;

  return {
    type: 'function',
    function: { name, description, parameters: jsonSchema },
  } satisfies ChatCompletionTool;
}
