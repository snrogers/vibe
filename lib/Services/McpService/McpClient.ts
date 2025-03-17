import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import readline from "readline/promises";
import type { Tool } from "../ToolService/Types";
import { GROK_API_KEY } from "@/lib/Constants";
import type { ChatCompletionTool } from "openai/resources/index.mjs";
import type { UserMessage } from "@/lib/Domain/ChatSession";

/** Maybe more? */
type McpTool = {
  name:         string;
  description?: string;
  input_schema: any;
}

const openAiToolFromMcpTool = (mcpTool: McpTool): ChatCompletionTool => {
  return {
    type: 'function',
    function: {
      name:        mcpTool.name,
      description: mcpTool.description,
      parameters:  mcpTool.input_schema,
    }
  }
}


export class MCPClient {
  private mcp: Client;
  private transport: StdioClientTransport | null = null;
  private tools:     McpTool[] = [];

  constructor() {
    // Initialize Anthropic client and MCP client
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
    this.mcp.connect(this.transport);

    // List available tools
    const toolsResult = await this.mcp.listTools();
    this.tools = toolsResult.tools.map((tool) => {
      return {
        name:         tool.name,
        description:  tool.description,
        input_schema: tool.inputSchema,
      };
    });
    console.log(
      "Connected to server with tools:",
      this.tools.map(({ name }) => name),
    );
  }

  async connectToServer(serverScriptPath: string) {
    try {
      // Determine script type and appropriate command
      const isJs = serverScriptPath.endsWith(".js");
      const isPy = serverScriptPath.endsWith(".py");
      if (!isJs && !isPy) {
        throw new Error("Server script must be a .js
