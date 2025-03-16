import { z } from 'zod';

export const WriteFileArgumentsSchema = z.object({
  file_path: z.string(),
  content: z.string(),
});
