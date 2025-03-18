import type { ChatCompletionTool } from 'openai/resources'

/** Maybe more? */
export type McpTool = {
  name:         string;
  description?: string;
  inputSchema:  Record<string, unknown>;
}

