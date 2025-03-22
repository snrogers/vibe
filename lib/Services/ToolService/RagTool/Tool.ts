import type { Tool } from '../Types';
import { RagToolCommandSchema } from './Parameters';
import { handleRagToolCall } from './handler';

const description = `
Tool to save and retrieve data for retrieval-augmented generation.

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

export const RagTool: Tool = {
  name: "rag_tool",
  description,
  argsSchema: RagToolCommandSchema,
  jsonSchema,
  handler: handleRagToolCall,
};
