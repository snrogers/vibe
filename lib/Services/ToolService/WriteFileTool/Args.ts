import { z } from 'zod';
import { zu } from 'zod_utilz';

export const WriteFileArgumentsSchema = z.object({
  file_path: z.string().describe('The path to the file to write.'),
  content:   z.string().describe('The content to write to the file.'),
}).describe('Arguments for the WriteFileTool.');


export const StringifiedWriteFileArgumentsSchema = 
  zu.stringToJSON().pipe(WriteFileArgumentsSchema);
