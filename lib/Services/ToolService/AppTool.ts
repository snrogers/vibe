import { BashTool } from "./BashTool";
import type { FileEditTool } from "./FileEditTool";
import type { FileReadTool } from "./FileReadTool";
import type { FileWriteTool } from "./FileWriteTool";
import { ProjectOverviewTool } from "./ProjectOverviewTool";

export type AppTool =
  | typeof BashTool
  | typeof FileEditTool
  | typeof FileReadTool
  | typeof FileWriteTool
  | typeof ProjectOverviewTool
