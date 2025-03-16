import { handleBashToolCall } from "./BashTool";
import { handleProjectOverviewToolCall } from "./ProjectOverviewTool";
import { handleReadFileToolCall } from "./ReadFileTool/ReadFileTool";
import { handleWriteFileToolCall } from "./WriteFileTool";
import { replaceInFile } from "./ReplaceTool/ReplaceTool";

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
      case "replace":
        return async (args: any) => {
          const { file_path, search_string, replace_string } = args;
          return await replaceInFile(file_path, search_string, replace_string);
        };
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  },
};