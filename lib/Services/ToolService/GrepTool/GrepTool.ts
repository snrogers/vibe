import type { Tool } from '../Types';
import { handler } from './handler';
import { parametersSchema } from './Parameters';

export const JSON_SCHEMA = {
  "type": "object",
  "properties": {
    "pattern": {
      "type": "string",
      "description": "The regular expression pattern to search for in file contents"
    },
    "path": {
      "type": "string",
      "description": "The directory to search in. Defaults to the current working directory."
    },
    "include": {
      "type": "string",
      "description": "File pattern to include in the search (e.g. \"*.js\", \"*.{ts,tsx}\")"
    }
  },
  "required": ["pattern"]
};

const description = `
- Fast content search tool that works with any codebase size
- Searches file contents using regular expressions
- Supports full regex syntax (eg. "log.*Error", "function\\s+\\w+", etc.)
- Filter files by pattern with the include parameter (eg. "*.js", "*.{ts,tsx}")
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files containing specific patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead
`;

export const GrepTool = {
  name: 'grep',
  description,
  argsSchema: parametersSchema,
  jsonSchema: JSON_SCHEMA,
  handler,
} as const satisfies Tool;