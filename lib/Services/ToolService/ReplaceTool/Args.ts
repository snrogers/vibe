import { z } from "zod";
import { zu } from "zod_utilz";

export const ReplaceToolSchema = z.object({
  file_path:      z.string().describe('The path to the file to modify.'),
  search_string:  z.string().describe('The string to search for in the file.'),
  replace_string: z.string().describe('The string to replace the search string with.'),
})

export const StringifiedReplaceArgumentsSchema = zu.stringToJSON().pipe(
  ReplaceToolSchema,
);
