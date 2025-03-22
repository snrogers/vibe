import { z } from "zod";
import { zu } from "zod_utilz";

export const parametersSchema = z.strictObject({
  pattern: z.string().describe('The regular expression pattern to search for in file contents'),
  path: z.string().optional().describe('The directory to search in. Defaults to the current working directory.'),
  include: z.string().optional().describe('File pattern to include in the search (e.g. "*.js", "*.{ts,tsx}")'),
});

export const stringifiedParametersSchema = zu.stringToJSON().pipe(
  parametersSchema,
);