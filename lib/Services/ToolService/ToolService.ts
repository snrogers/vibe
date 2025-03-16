import { handleBashToolCall } from "./BashTool";
import { handleProjectOverviewToolCall } from "./ProjectOverviewTool";
import { handleReadFileToolCall } from "./ReadFileTool/ReadFileTool";
import { handleWriteFileToolCall } from "./WriteFileTool";

export const ToolService = {
  getToolHandler: (name: string) => {
    switch (name) {
      case "bash":
        return handleBashToolCall;
      case "project_overview":
        return handleProjectOverviewToolCall;
      case "read_file":
        return handleReadFileToolCall;
      case "write_file":
        return handleWriteFileToolCall;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  },
};
