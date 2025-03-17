import { Client as BaseMcpClient } from '@modelcontextprotocol/sdk/client/index.js'
import type { Tool } from '@/lib/Services/ToolService/Types'

import { fetchMcpConfig, type McpServerConfig } from './fetchMcpConfig'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { eternity } from '@/lib/Utils'
import type { McpTool } from './Utils'
import type { ChatCompletionTool } from 'openai/resources/index.mjs'
import type { Simplify } from '@/lib/Types'


type mcpConfigFile = { mcpServers: Record<string, McpServerConfig> }

const mcpConfig = await fetchMcpConfig()

const mcpConfigEntries =
  Object.entries(mcpConfig.mcpServers) as unknown as [string, McpServerConfig][]


type AnthroTool = Simplify<Awaited<ReturnType<(typeof BaseMcpClient)['prototype']['listTools']>>['tools'][number]>

class McpClient {
  readonly name:      string;
  readonly config:    McpServerConfig;
  readonly whenReady: Promise<void>;

  public readonly tools: ChatCompletionTool[] = []

  private readonly client: BaseMcpClient;

  constructor(name: string, config: McpServerConfig) {
    this.name   = name
    this.config = config

    this.client = new BaseMcpClient({
      name: 'Vibe',
      version: '0.0.0',
    })

    const transport = new StdioClientTransport({
      command: config.command,
      args:    config.args,
    })

    this.whenReady = (async (client: BaseMcpClient) => {
      await client.connect(transport)
      const { tools: mcpTools } = await client.listTools()

      console.log('readying', { name, mcpTools })

      this.tools = mcpTools.map(openAiToolFromAnthroTool)
    })(this.client)

    this.whenReady.catch(async (err) => {
      console.error('Error in McpClient.whenReady', err)
      await eternity
    })
  }
}

const mcpClients: Record<string, BaseMcpClient> = mcpConfigEntries.reduce(
  (acc, [name, mcpServerConfig]) => {
    const client = new McpClient(name, mcpServerConfig)
    return { ...acc, [mcpServerConfig.command]: client }
  }, {}
)

export function fetchMcpPrompts() {
  // FIXME: implement
}

export function fetchMcpTool(name: string): Tool {
  const client = mcpClients[name]
  if (!client) {
    throw new Error(`No client found for tool ${name}`)
  }
  return toolFromMcpClient(client);
}

export const openAiToolFromAnthroTool = (mcpTool: AnthroTool): ChatCompletionTool => {
  return {
    type: 'function',
    function: {
      name:        mcpTool.name,
      description: mcpTool.description,
      parameters:  mcpTool.inputSchema as Record<string, unknown>,
    }
  }
}

export function toolFromMcpClient(mcpClient: McpClient): Tool {
  const { name  } = mcpClient
  const description = mcpClient.prompt

  return {
    name:         mcpClient.name,
    description,
    handler:      mcpClient.callTool.bind(mcpClient),
  }
}

export const McpService = {
  fetchMcpPrompts,
  fetchMcpTool,
}


// ----------------------------------------------------------------- //
// FIXME: DELETE BELOW THIS
// ----------------------------------------------------------------- //

console.log('mcpConfig', mcpConfig)
const [name, mcpServerConfig] = mcpConfigEntries[0]!
const client = new McpClient(name, mcpServerConfig)
await client.whenReady

console.log('Ready', { clientTools: client.tools })

await eternity
