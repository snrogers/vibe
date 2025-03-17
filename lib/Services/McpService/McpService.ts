import { Client as MCPClient } from '@modelcontextprotocol/sdk/client/index.js'
import { fetchMcpConfig, type McpServerConfig } from './fetchMcpConfig'


type mcpConfigFile = { mcpServers: Record<string, McpServerConfig> }

const mcpConfig = await fetchMcpConfig()

const entries   = Object.entries(mcpConfig.mcpServers) as unknown as [string, McpServerConfig][]

console.log('entries', entries)

const mcpClients = Object.entries(mcpConfig.mcpServers).reduce(
  (acc, [name, mcpServerConfig]) => {
    const client =  new MCPClient({
      name: 'Vibe',
      version: '0.0.0',
    })

    client.connect(mcpServerConfig)

    return { ...acc, [mcpServerConfig.command]: client }
  }, {}
)

export function fetchMcpServers() {
  return []
}

export function fetchMcpPrompts() {
  return []
}
