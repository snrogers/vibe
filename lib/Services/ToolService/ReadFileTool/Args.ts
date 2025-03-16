import { z } from "zod";
import zu from "zod_utilz";

export const ReadFileArgumentsSchema = z.object({
  file_path: z.string().describe("The path to the file to read."),
}).describe("Arguments for the ReadFileTool.");

export const StringifiedReadFileArgumentsSchema = zu.stringToJSON().pipe(ReadFileArgumentsSchema);
