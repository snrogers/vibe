import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import { ALL_TOOLS }                     from ".";
import { handleBashToolCall }            from "./BashTool";
import { handleCurlToolCall }            from "./CurlTool";
import { handleProjectOverviewToolCall } from "./ProjectOverviewTool";
import { handleReadFileToolCall }        from "./ReadFileTool/ReadFileTool";
import { handleReplaceToolCall }         from "./ReplaceTool/ReplaceTool";
import { handleWriteFileToolCall }       from "./WriteFileTool";
import { ZodError } from "zod";
import { ENV } from "@/lib/Constants";
import { exhaustiveCheck } from "@/lib/Utils";

export const ToolService = {
  getTools: () => {
    return ALL_TOOLS;
  },
  /** @deprecated use executeToolCall instead */
  getToolHandler: (name: string) => {
    switch (name) {
      case "bash":
        return handleBashToolCall;
      case "curl":
        return handleCurlToolCall;
      case "project_overview":
        return handleProjectOverviewToolCall;
      case "read_file":
        return handleReadFileToolCall;
      case "write_file":
        return handleWriteFileToolCall;
      case "replace":
        return handleReplaceToolCall;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  },
  executeToolCall: async (toolCall: ChatCompletionMessageToolCall) => {
    const { name, arguments: args } = toolCall.function;
    const toolHandler = getToolHandler(name);

    return await toolHandler(toolCall);
  }
};

type ToolName = (typeof ALL_TOOLS)[number]['function']['name']
function getToolHandler (name: string) {
  switch (name) {
    case "bash":
      return handleBashToolCall;
    case "curl":
      return handleCurlToolCall;
    case "project_overview":
      return handleProjectOverviewToolCall;
    case "read_file":
      return handleReadFileToolCall;
    case "write_file":
      return handleWriteFileToolCall;
    case "replace":
      return handleReplaceToolCall;
    default:
      exhaustiveCheck(name);
      throw new ToolNotFoundError(`Unknown tool: ${name}`);
  }
}

export class ToolNotFoundError extends Error {
  constructor(toolName: string) {
    super(`Tool not found: ${toolName}`);
  }
}
