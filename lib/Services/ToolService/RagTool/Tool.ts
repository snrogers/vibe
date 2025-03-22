import type { Tool } from '../Types';
import { RagToolCommandSchema } from './Parameters';
import { handleRagToolCall } from './handler';

const description = `
Tool to save and retrieve data for retrieval-augmented generation.

IMPORTANT: When the User asks for information, always check this tool first.

IMPORTANT: Use this tool liberally when planning a task.
           Always look up relevant information from this tool before searching elsewhere.
           Whenever you have to do any research to perform a task,
           save the relevant information to this tool.

Accepts a command object with:
  - type: "save" or "retrieve"
  - data: string (required for "save")
  - metadata: Record<string, any> (optional for "save") - additional metadata to store with the data
  - query: string (required for "retrieve")

Example for save:
  { "type": "save", "data": "Some data to save", "metadata": { "category": "notes", "tags": ["important"] } }

Example for retrieve:
  { "type": "retrieve", "query": "search query" }
`;

const jsonSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["save", "retrieve"],
      description: "The type of command: 'save' or 'retrieve'"
    },
    data: {
      type: "string",
      description: "The data to save (required if type is 'save')"
    },
    metadata: {
      type: "object",
      description: "Additional metadata to store with the data (optional for 'save')"
    },
    query: {
      type: "string",
      description: "The query to retrieve data (required if type is 'retrieve')"
    }
  },
  required: ["type"]
};

export const RagTool = {
  name: "rag_tool",
  description,
  argsSchema: RagToolCommandSchema,
  jsonSchema,
  handler: handleRagToolCall,
} as const satisfies Tool;
