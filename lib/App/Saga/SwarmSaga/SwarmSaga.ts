import type { AssistantMessage, ChatSession } from "@/lib/Domain/ChatSession"
import type { Tool } from "@/lib/Services/ToolService/Types"
import type { ChatCompletionChunk } from "openai/resources"
import { identity, last } from "rambdax"

import { Agent } from "@/lib/Domain/Agent"
import { all } from "@/lib/App/Utils"
import { grokClient } from "@/lib/Services/LlmService/LlmClient"


const makeAgent:     any = identity
const AgentTaskSaga: any = identity


type SwarmSagaOtps = {
  model:        string
  numAgents:    number
  prompt:       string
  systemPrompt: string
  tools:        Tool[]
}
/** FIXME: Actually implement SwarmSaga */
export function * SwarmSaga(opts: SwarmSagaOtps) {
  const { model, numAgents, prompt, systemPrompt, tools } = opts

  const agents: any[] = Array(numAgents).map(() => (new Agent({
    systemPrompt,
    prompt,
    tools,
    client: grokClient
  })))

  yield * all(agents.map((agent) => AgentTaskSaga({ agent })))

  const results = agents.map(
    (agent) => agent.chatSession.map(
      (chatSession: { messages: any }) => last(chatSession.messages)
    )
  )

  return results as AssistantMessage[]
}
