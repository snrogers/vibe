import path from "path"

import { MCP_CONFIG_PATH } from "@/lib/Constants"
import { logger } from "../LogService"


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
  const absolutePath = path.resolve(MCP_CONFIG_PATH)

  logger.log('debug', `checking if ${absolutePath} exists`)
  const mcpConfigExists = await Bun.file(absolutePath).exists()


  if (!mcpConfigExists) {
    logger.log('debug', `creating ${absolutePath}`)
    await writeEmptyMcpConfig()
  }

  logger.log('debug', `reading ${absolutePath}`)
  const config =
    (await require(absolutePath)) as McpConfigDict

  logger.log('debug', `config`, config)

  return config
}


// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //
export const writeEmptyMcpConfig = async () => {
  await Bun.file(MCP_CONFIG_PATH).write(EMPTY_MCP_CONFIG)
}
