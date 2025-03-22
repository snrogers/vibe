import { z } from "zod";
import { zu } from "zod_utilz";

export const parametersSchema = z.strictObject({
  pattern: z.string().describe('The glob pattern to match files against'),
  path: z.string().optional().describe('The directory to search in. Defaults to the current working directory.'),
});

export const stringifiedParametersSchema = zu.stringToJSON().pipe(
  parametersSchema,
);