import { Client as BaseMcpClient } from '@modelcontextprotocol/sdk/client/index.js'
import type { Tool, ToolCallHandler } from '@/lib/Services/ToolService/Types'
import jsonSchemaToZod from 'json-schema-to-zod'

import { fetchMcpConfig, type McpServerConfig } from './fetchMcpConfig'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import type { McpTool } from './Utils'
import type { ChatCompletionMessageToolCall, ChatCompletionTool, ChatCompletionToolMessageParam } from 'openai/resources/index.mjs'
import type { Simplify } from '@/lib/Types'
import { z } from 'zod'
import { dump, eternity } from '@/lib/Utils'
import { logger } from '../LogService'
import { serializeError } from 'serialize-error'
import type { SystemMessage, ToolMessage } from '@/lib/Domain'


type mcpConfigFile = { mcpServers: Record<string, McpServerConfig> }

const mcpConfig = await fetchMcpConfig()

const mcpConfigEntries =
  Object.entries(mcpConfig.mcpServers) as unknown as [string, McpServerConfig][]

type AnthroTool = Simplify<Awaited<ReturnType<(typeof BaseMcpClient)['prototype']['listTools']>>['tools'][number]>

class McpClient {
  public readonly name:      string;
  public readonly config:    McpServerConfig;
  public readonly whenReady: Promise<void>;
  public readonly tools:     ChatCompletionTool[] = []

  public readonly baseClient: BaseMcpClient;

  constructor(name: string, config: McpServerConfig) {
    this.name   = name
    this.config = config

    this.baseClient = new BaseMcpClient({
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
      this.tools = mcpTools.map((mcpTool) => openAiToolFromAnthroTool(name, mcpTool))
    })(this.baseClient)

    this.whenReady.catch(async (err) => {
      logger.log('error', 'Error in McpClient.whenReady', serializeError(err))
    })
  }
}

const mcpClients: Record<string, McpClient> = mcpConfigEntries.reduce(
  (acc, [name, mcpServerConfig]) => {
    const client = new McpClient(name, mcpServerConfig)
    return { ...acc, [name]: client }
  }, {}
)

// FIXME: look more into internally hosted MCP Servers
// mcpClients['mcp-agent-mode'] =
//   new McpClient('mcp-agent-mode', {
//     command: 'bun',
//     args:    ['run', 'McpServers/index.ts'],
//     env:     {},
//   })

await Promise.all(Object.values(mcpClients).map((mcpClient: McpClient) => mcpClient.whenReady))

export const ALL_MCP_COMPLETION_TOOLS = Object.values(mcpClients).flatMap((mcpClient: McpClient) => mcpClient.tools)
export const ALL_MCP_TOOLS =
  Object.values(mcpClients).flatMap(toolsFromMcpClient)

export function toolsFromMcpClient(mcpClient: McpClient): Tool[] {
  return mcpClient.tools.map((mcpTool) => {
    const name        = mcpTool.function.name
    const description = mcpTool.function.description ?? 'DESCRIPTION NOT FOUND'

    return {
      name,
      description: description + '\n\n' + dump(mcpTool.function.parameters!),
      argsSchema:   z.any(),
      handler:      fetchChatCompletionToolHandler(mcpClient.name),
    } satisfies Tool
  })
}

export function fetchChatCompletionToolHandler(name: string): ToolCallHandler {
  return (toolCall: ChatCompletionMessageToolCall) => processToolCall(toolCall)
}

export function openAiToolFromAnthroTool(serverName: string, mcpTool: AnthroTool): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name:        `${serverName}___${mcpTool.name}`,
      description: mcpTool.description,
      parameters:  mcpTool.inputSchema as Record<string, unknown>,
    }
  }
}

export async function processToolCall(toolCall: ChatCompletionMessageToolCall): Promise<(SystemMessage | ToolMessage)[]> {
  const [serverName, toolName] = toolCall.function.name.split('___')
  const toolArgs = JSON.parse(toolCall.function.arguments) as Record<string, unknown>

  const client = mcpClients[serverName]!
  logger.log('info', `Calling tool ${toolName} on server ${serverName}`, { toolArgs, client, mcpClients })

  const result = await client.baseClient.callTool({
    name:      toolName,
    arguments: toolArgs,
  });

  return [{
    tool_call_id: toolCall.id,
    content:      result.content as string,
    role:         'tool',
  }]
}

export const McpService = {
  fetchMcpToolHandler:    fetchChatCompletionToolHandler,
  getChatCompletionTools: () => Object.values(mcpClients).map((mcpClient: McpClient) => mcpClient.tools),
}
