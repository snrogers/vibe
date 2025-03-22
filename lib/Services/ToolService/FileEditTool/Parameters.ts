import { z } from "zod";
import { zu } from "zod_utilz";

export const parametersSchema = z.strictObject({
  file_path: z.string().describe('The absolute path to the file to modify'),
  old_string: z.string().describe('The text to replace'),
  new_string: z.string().describe('The text to replace it with'),
});

export const stringifiedParametersSchema = zu.stringToJSON().pipe(
  parametersSchema,
);