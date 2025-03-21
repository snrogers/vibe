import { BashTool } from "./BashTool";
import type { FileReadTool } from "./FileReadTool";
import { ProjectOverviewTool } from "./ProjectOverviewTool";

export type AppTool =
  | typeof BashTool
  | typeof FileReadTool
  | typeof ProjectOverviewTool
