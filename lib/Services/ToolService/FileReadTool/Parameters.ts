import { z } from "zod";
import { zu } from "zod_utilz";

export const parametersSchema = z.strictObject({
  file_path: z.string().describe('The absolute path to the file to read'),
  offset: z
    .number()
    .optional()
    .describe(
      'The line number to start reading from. Only provide if the file is too large to read at once'
    ),
  limit: z
    .number()
    .optional()
    .describe(
      'The number of lines to read. Only provide if the file is too large to read at once.'
    ),
});

export const stringifiedParametersSchema = zu.stringToJSON().pipe(
  parametersSchema,
);
