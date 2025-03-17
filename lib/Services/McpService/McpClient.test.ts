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

class MCPClient {
  mcp:       Client;
  transport: StdioClientTransport | null = null;
  tools:     McpTool[] = [];

  constructor() {
    this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
  }

  /**
   * Connect to an MCP server
   * @param serverScriptPath - Path to the server script (.py or .js)
   */
  async connectToServer(serverScriptPath: string) {
    try {
      // Determine script type and appropriate command
      const isJs = serverScriptPath.endsWith(".js");
      const isPy = serverScriptPath.endsWith(".py");

      const command = isPy
        ? process.platform === "win32"
          ? "python"
          : "python3"
        : process.execPath;

      // Initialize transport and connect to server
      this.transport = new StdioClientTransport({
        command: 'bunx',
        args: ['-y', '@mcp-get-community/server-curl']
      });
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
    } catch (e) {
      console.log("Failed to connect to MCP server: ", e);
      throw e;
    }
  }

  async processQuery(query: string) {
    /**
     * Process a query using Claude and available tools
     *
     * @param query - The user's input query
     * @returns Processed response as a string
     */
    const messages: UserMessage[] = [
      {
        role: "user",
        content: query,
      },
    ];

    // Initial Claude API call
    const response = await this.client.chat.completions.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages,
      tools: this.tools.map(openAiToolFromMcpTool),
    });

    // Process response and handle tool calls
    const finalText = [];
    const toolResults = [];

    for (const content of response.content) {
      if (content.type === "text") {
        finalText.push(content.text);
      } else if (content.type === "tool_use") {
        // Execute tool call
        const toolName = content.name;
        const toolArgs = content.input as { [x: string]: unknown } | undefined;

        const result = await this.mcp.callTool({
          name: toolName,
          arguments: toolArgs,
        });
        toolResults.push(result);
        finalText.push(
          `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`,
        );

        // Continue conversation with tool results
        messages.push({
          role: "user",
          content: result.content as string,
        });

        finalText.push(
          response.content[0].type === "text" ? response.content[0].text : "",
        );
      }
    }

    return finalText.join("\n");
  }

  async chatLoop() {
    /**
     * Run an interactive chat loop
     */
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      console.log("\nMCP Client Started!");
      console.log("Type your queries or 'quit' to exit.");

      while (true) {
        const message = await rl.question("\nQuery: ");
        if (message.toLowerCase() === "quit") {
          break;
        }
        const response = await this.processQuery(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }

  async cleanup() {
    /**
     * Clean up resources
     */
    await this.mcp.close();
  }
}

async function main() {
  if (require.main !== module) process.exit(1);

  console.log('process.argv', process.argv)

  const mcpClient = new MCPClient();
  try {
    console.log('connecting to server')
    await mcpClient.connectToServer(process.argv[2]);
    console.log('connected to server')

    const tools = await mcpClient.mcp.listTools()

    console.log('tools', tools)

    console.log('calling tool')
    const result = await mcpClient.mcp.callTool({
      name: 'curl',
      arguments: {
        url: 'https://www.example.com'
      }
    })

    console.log('tool result', result)

    await new Promise(() => {})
  } catch (e) {
    console.log('error', e)
  } finally {
    await mcpClient.cleanup();
    process.exit(0);
    await new Promise(() => {})
  }
}

main();
