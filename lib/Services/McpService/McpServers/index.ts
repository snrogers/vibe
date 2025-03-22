#!/usr/bin/env bun

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";



// Create an MCP server instance
const server = new McpServer({
  name: "mcp-agent-mode",
  version: "1.0.0"
});

const SET_MODE_DESCRIPTION = `
  Tool Description: "set-mode"

  This tool allows you, the agent, to set your operational mode,
  optimizing your behavior for different stages of the project.


  Choose from three distinct modes:

  CHATTING:
  In this mode, you will focus on brainstorming about the current project or answering questions to explore it further. Engage in open-ended discussions, spark creative ideas, and dig deeper into the project's possibilities.

  PLANNING:
  In this mode, you will be encouraged to use planning-related tools and think strategically. Focus on outlining steps, setting goals, and organizing tasks to create a clear roadmap for success.

  WORKING:
  In this mode, you will enter a relentless task-execution state. Prioritize focus and efficiency, working continuously without stopping until the task is fully completed.
  Select a mode to adapt your behavior accordingly.
`
// Define the "set-mode" tool
server.tool(
  "set-mode",
  SET_MODE_DESCRIPTION,
  {
    mode: z.enum(['CHATTING', 'PLANNING', 'WORKING'])
  },
  async ({ mode }) => {
    return {
      content: [{ type: "text", text: mode }]
    };
  }
);

// Set up the server to use stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
