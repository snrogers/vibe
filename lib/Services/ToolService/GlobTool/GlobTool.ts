import type { Tool } from '../Types';
import { handler } from './handler';
import { parametersSchema } from './Parameters';

export const JSON_SCHEMA = {
  "type": "object",
  "properties": {
    "pattern": {
      "type": "string",
      "description": "The glob pattern to match files against"
    },
    "path": {
      "type": "string",
      "description": "The directory to search in. Defaults to the current working directory."
    }
  },
  "required": ["pattern"]
};

const description = `
- Fast file pattern matching tool that works with any codebase size
- Supports glob patterns like "**/*.js" or "src/**/*.ts"
- Returns matching file paths sorted by modification time
- Use this tool when you need to find files by name patterns
- When you are doing an open ended search that may require multiple rounds of globbing and grepping, use the Agent tool instead
`;

export const GlobTool = {
  name: 'glob',
  description,
  argsSchema: parametersSchema,
  jsonSchema: JSON_SCHEMA,
  handler,
} as const satisfies Tool;