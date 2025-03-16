import { zu } from "zod_utilz";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";
import { ReadFileArgumentsSchema } from "./Schema";
import { logger } from "@/lib/Services/LogService";
import { z } from "zod";
import type { Tool } from "../Types";

const description = `
  Read the contents of a file given its path.
  Returns the contents of the file as a string.
  ALWAYS use the absolute path to the file.

  <example>
    { "file_path": "/Users/someDude/hisProject/thatFile.txt" }
  </example>
`

export const ReadFileTool = {
  name: 'read_file',
  description,
  argsSchema: ReadFileArgumentsSchema,
  handler:    handleReadFileToolCall,
} as const satisfies Tool


