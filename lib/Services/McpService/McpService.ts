import { MCPClient } from '@modelcontextprotocol/sdk';

export class McpService {
  private client: MCPClient;

  constructor(config: { serverUrl: string; apiKey?: string }) {
    this.client = new MCPClient({
      serverUrl: config.serverUrl,
      apiKey: config.apiKey, // Optional, depending on server requirements
    });
  }

  /** Retrieve context from the MCP Server by key */
  async getContext(key: string): Promise<any> {
    try {
      return await this.client.getContext(key);
    } catch (error) {
      console.error(`Error retrieving context for key "${key}":`, error);
      throw error;
    }
  }

  /** Store context on the MCP Server */
  async setContext(key: string, value: any): Promise<void> {
    try {
      await this.client.setContext(key, value);
    } catch (error) {
      console.error(`Error setting context for key "${key}":`, error);
      throw error;
    }
  }

  /** Delete context from the MCP Server */
  async deleteContext(key: string): Promise<void> {
    try {
      await this.client.deleteContext(key);
    } catch (error) {
      console.error(`Error deleting context for key "${key}":`, error);
      throw error;
    }
  }
}
