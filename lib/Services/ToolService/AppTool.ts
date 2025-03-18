import { BashTool } from "./BashTool";
import { ProjectOverviewTool } from "./ProjectOverviewTool";

export type AppTool =
  | typeof BashTool
  | typeof ProjectOverviewTool
