import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Implementation } from "@modelcontextprotocol/sdk/types.js";

// process.exit immediately if this ifle is not the entry point
if (process.argv[1] !== __filename) {
  process.exit(0);
}


export const transport = new StdioClientTransport({
  command: "bunx",
  args: ['-y', '@mcp-get-community/server-curl']
});

const client = new Client(
  {
    name: "VIBE",
    version: "0.0.0"
  } satisfies Implementation,
  {
    capabilities: {
      prompts:   {},
      resources: {},
      tools:     {}
    }
  }
);

await client.connect(transport);

// List prompts
const prompts = await client.listPrompts();

// Get a prompt
const prompt = await client.getPrompt(
  "example-prompt",
  { arg1: "value" }
);

// List resources
const resources = await client.listResources();

// Read a resource
const resource = await client.readResource(
  "file:///example.txt"
);

// Call a tool
const result = await client.callTool({
  name: "example-tool",
  arguments: {
    arg1: "value"
  }
});
