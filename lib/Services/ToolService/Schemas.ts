import { z } from "zod";
import * as path from 'path';

export const filepathWithin = (parentDir: string) =>
  z.string()
    .refine((filepath) => path.isAbsolute(filepath), {
      message: 'Filepath must be an absolute path',
    })
    .refine((filepath) => !path.relative(parentDir, filepath).startsWith('..'), {
      message: `Filepath must be within the parent directory ${parentDir}`,
    }).describe('Filepath within some parent directory')
