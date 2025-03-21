import { all, call, cancelled, put, select, take, takeEvery, takeLatest } from 'typed-redux-saga'
import { serializeError } from 'serialize-error'

import type { AppEvent, PROMPT_SUBMITTED } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppState'
import type { ToolMessage } from '@/lib/Domain/ChatSession'
import { LlmService } from '@/lib/Services/LlmService'
import { StreamCompletionSaga } from '@/lib/App/Saga/StreamCompletionSaga'
import { ToolService } from '@/lib/Services/ToolService'
import { logger } from '@/lib/Services/LogService'

import { ToolCallLoopSaga } from './ToolCallLoopSaga'
import { type Agent, mkAgent } from '@/lib/Domain/Agent'
import { grokClient } from '@/lib/Services/LlmService/LlmClient'
import type { Tool } from '@/lib/Services/ToolService/Types'
import type { ToolDef } from '@/lib/Services/ToolService/ToolDef'




// GAME PLAN:
// This Saga runs from the point the user says something,
// until the Asistant is finished responding and we
// return control to the user.
//
// That currently includes:
// - handling tool calls
//
// but in the future:
// - Deploying Agent Swarms
// - Mediating Agent Debates
// - Automatic Compaction


const TOOL_CALL_LIMIT = 5

type AgentTaskSagaOtps = {
  model:        string
  prompt:       string
  systemPrompt: string
  tools:        ToolDef[]
}
export function * AgentTaskSaga(opts: AgentTaskSagaOtps) {
  try {
    const {
      model,
      prompt,
      systemPrompt,
      tools
    } = opts

    const agent = mkAgent({
      modelName:      model,
      modelProvider: 'xai',
      tools,
    })

    yield * put({
      type: 'AGENT_TASK_STARTED',
      payload: {
        model,
        prompt,
        systemPrompt,
        toolNames: tools.map((tool) => tool.name)
      }
    })
    const chatSession = agent.chatSession

    // ----------------------------------------------------------------- //
    // Fetch a Completion
    // ----------------------------------------------------------------- //
    const completionResult = yield * StreamCompletionSaga({ chatSession })
    const { assistantMessage } = completionResult
    yield * put({ type: 'AGENT_COMPLETION_SUCCESS', payload: { message: assistantMessage } })

    // ----------------------------------------------------------------- //
    // Handle Any Tool Calls
    // ----------------------------------------------------------------- //
    let toolCalls = assistantMessage.tool_calls ?? []
    if (toolCalls.length) yield * ToolCallLoopSaga({ assistantMessage, toolCalls })

    // ----------------------------------------------------------------- //
    // Then we're done
    // ----------------------------------------------------------------- //
    yield * put({ type: 'AGENT_TASK_SUCCESS', payload: { message: assistantMessage } })
  } catch (error) {
    if (yield * cancelled()) {
      yield * put({ type: 'AGENT_TASK_FAILURE', payload: { error: serializeError(error) } })
      return
    }
    yield * put({ type: 'AGENT_TASK_FAILURE', payload: { error: serializeError(error) } })
    console.error(error)
  }
}
