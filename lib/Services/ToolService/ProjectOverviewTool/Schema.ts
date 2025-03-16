import { z } from "zod";

export const ProjectOverviewArgumentsSchema = z.object({
  root_dir: z.string(),
})
