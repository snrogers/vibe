import type { ChatCompletion } from "openai/resources/index.mjs"
import type { LlmClient } from "../Services/LlmService/LlmClient/LlmClient"
import type { Tool } from "../Services/ToolService/Types"
import type { ChatSession } from "./ChatSession"


export type AgentOpts = {
  client:       LlmClient
  systemPrompt: string
  prompt:       string
  tools:        Tool[]
}
export class Agent implements Agent {
  public readonly prompt:       string
  public readonly systemPrompt: string
  public readonly tools:        Tool[]
  public readonly chatSession:  ChatSession

  private readonly client:       LlmClient

  constructor(opts: AgentOpts) {
    this.client       = opts.client
    this.prompt       = opts.prompt
    this.systemPrompt = opts.systemPrompt
    this.tools        = opts.tools
    this.chatSession  = {
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user',   content: this.prompt },
      ]
    }
  }

  generateCompletion() {
    return this.client.generateCompletion(this.chatSession)
  }
}
