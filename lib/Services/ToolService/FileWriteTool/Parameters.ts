import { z } from 'zod';
import { zu } from 'zod_utilz';

export const parametersSchema = z.strictObject({
  file_path: z.string().describe('The absolute path to the file to write (must be absolute, not relative)'),
  content: z.string().describe('The content to write to the file'),
});

export const stringifiedParametersSchema = zu.stringToJSON().pipe(
  parametersSchema,
);