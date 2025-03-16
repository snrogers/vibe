import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import { logger } from "@/lib/Services/LogService";
import { z } from "zod";
import { zu } from "zod_utilz";

import type { Tool } from "../Types";
import { ReplaceToolSchema, StringifiedReplaceArgumentsSchema } from "./Args";
import { handleReplaceToolCall } from "./handleReplaceToolCall";

// FIXME: IMPORTANT: REPLACE ONLY THE FIRST OCCURRENCE OF THE SEARCH STRING
const description = `
  Replace EVERY occurrence of a search string with a replacement string in a file.
  Returns the new content of the file after the replacement.

  <example>
    {
      "file_path":      "/Users/someDude/hisProject/thatFile.txt",
      "search_string":  "old text",
      "replace_string": "new text"
    }
  </example>
`


export const ReplaceTool = {
  name:        'replace',
  description,
  argsSchema:  ReplaceToolSchema,
  handler:     handleReplaceToolCall,
} as const satisfies Tool
