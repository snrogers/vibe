import { handleBashToolCall } from "./BashTool";
import { handleProjectOverviewToolCall } from "./ProjectOverviewTool";
import { handleReadFileToolCall } from "./ReadFileTool/ReadFileTool";
import { handleWriteFileToolCall } from "./WriteFileTool";
import { handleReplaceToolCall, replaceInFile } from "./ReplaceTool/ReplaceTool";
import { handleCurlToolCall } from "./CurlTool";

export const ToolService = {
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
};
