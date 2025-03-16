import { z } from "zod";
import { zu } from "zod_utilz";

export const ProjectOverviewArgumentsSchema = z.object({
  root_dir: z.string().describe('The root directory of the project.'),
}).describe('Arguments for the ProjectOverviewTool.');


export const StringifiedProjectOverviewArgumentsSchema = zu.stringToJSON().pipe(
  ProjectOverviewArgumentsSchema,
)
