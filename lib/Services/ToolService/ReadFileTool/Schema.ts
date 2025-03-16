import { z } from "zod";

export const ReadFileArgumentsSchema = z.object({
  file_path: z.string(),
});
