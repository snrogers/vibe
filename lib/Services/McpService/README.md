# McpService

The `McpService` manages interactions with the Model Context Protocol (MCP) in the Vibe application. It handles configuration and communication with MCP servers, enhancing LLM interactions by providing additional context or tools via the MCP framework.

## Key Features

- **Server Configuration**: Loads and manages MCP server settings from `$HOME/vibe.mcpServers.js`.
- **Tool Integration**: Registers MCP-specific tools with the `ToolService`, making them available to the LLM.
- **Context Management**: Enhances LLM interactions by providing MCP-driven context, such as project-specific data or external resources.

## Integration with the Application

The `McpService` integrates with Vibe through:

- **ToolService**: Dynamically fetches MCP tool handlers via `fetchMcpToolHandler` in `ToolService.ts`, extending the toolset available to the LLM.
- **Configuration**: Reads server configurations from `$HOME/vibe.mcpServers.js`, allowing runtime customization of MCP interactions.
- **LLM Enhancement**: Provides additional context or tools to the `LlmService`, improving the quality of LLM responses.

## Usage

To use the `McpService`:

1. Configure MCP servers in `$HOME/vibe.mcpServers.js`:
   ```javascript
   module.exports = {
     mcpServers: {
       server1: { url: 'https://mcp.example.com' }
     }
   };
   ```
2. Initialize the application—`McpService` automatically registers tools and configures itself during startup.
3. The LLM can then use MCP tools transparently via `ToolService`.

Example tool call handled by `McpService`:
```typescript
ToolService.executeToolCall({ function: { name: 'mcp_tool', arguments: '{}' } });
```

## Configuration

The primary configuration file is `$HOME/vibe.mcpServers.js`, which should export an object with server details. The `McpService` loads this at runtime using `MCP_CONFIG_PATH` from `Constants.ts`.

## Error Handling

The service manages errors such as:
- **Connection Failures**: Logs server connection issues and falls back to default behavior if MCP is unavailable.
- **Invalid Config**: Reports parsing errors for `vibe.mcpServers.js` via `LogService`.
- **Tool Errors**: Delegates error handling to `ToolService`'s `withStandardErrorHandling` for MCP tools.

## Extending the Service

To extend `McpService`:

1. **Add Servers**: Update `$HOME/vibe.mcpServers.js` with new MCP server entries.
2. **New Tools**: Define additional MCP tools in `McpService.ts` and register them in `ALL_MCP_TOOLS`.
3. **Context Features**: Enhance `fetchMcpToolHandler` to support new context types or MCP functionalities.

This adaptability supports evolving MCP integrations within Vibe.
