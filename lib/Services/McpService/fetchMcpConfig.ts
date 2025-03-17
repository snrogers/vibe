import { MCP_CONFIG_PATH } from "@/lib/Constants"


export type McpServerConfig = {
  command: string
  args:    string[]
  env:     Record<string, string>
}

export type VibeMcpConfig = {
  mcpServers: Record<string, McpServerConfig>
}

export type McpConfigDict = Record<string, McpServerConfig>


export const EMPTY_MCP_CONFIG = `
  module.exports = {
    mcpServers: {}
  }
`

export const fetchMcpConfig = async () => {
  const mcpConfigExists = await Bun.file(MCP_CONFIG_PATH).exists()

  if (!mcpConfigExists) await writeEmptyMcpConfig()

  const config =
    (await require('~/.vibe.mcpServers.js')) as McpConfigDict

  return config
}


// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //
export const writeEmptyMcpConfig = async () => {
  await Bun.file(MCP_CONFIG_PATH).write(EMPTY_MCP_CONFIG)
}
