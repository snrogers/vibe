import { BashTool } from "./BashTool";
import { CurlTool } from "./CurlTool";
import { GithubTool } from "./GithubTool";
import { ProjectOverviewTool } from "./ProjectOverviewTool";
import { ReadFileTool } from "./ReadFileTool";
import { ReplaceTool } from "./ReplaceTool";
import { WriteFileTool } from "./WriteFileTool";

export type AppTool =
  | typeof BashTool
  | typeof CurlTool
  | typeof GithubTool
  | typeof ProjectOverviewTool
  | typeof ReadFileTool
  | typeof ReplaceTool
  | typeof WriteFileTool
