import type { Tool } from '../Types';
import { handler } from './handler';
import { parametersSchema } from './Parameters';


export const JSON_SCHEMA = {
  "type": "object",
  "properties": {
    "file_path": {
      "type": "string",
      "description": "The absolute path to the file to read"
    },
    "offset": {
      "type": "number",
      "description": "The line number to start reading from. Only provide if the file is too large to read at once"
    },
    "limit": {
      "type": "number",
      "description": "The number of lines to read. Only provide if the file is too large to read at once."
    }
  },
  "required": ["file_path"]
}

const description = `
  Tool to read file contents, supporting both text and image files.
`

export const FileReadTool = {
  name: 'file_read',
  description,
  argsSchema: parametersSchema,
  jsonSchema: JSON_SCHEMA,
  handler,
} as const satisfies Tool
