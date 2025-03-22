import { CWD } from "@/lib/Constants"
import { cancelled } from "typed-redux-saga"
import { logger } from "@/lib/Services/LogService"
import { mkChatSession } from "@/lib/Domain/ChatSession"
import { serializeError } from "serialize-error"

import { StreamCompletionSaga } from "./StreamCompletionSaga"
import { ToolCallLoopSaga } from "./ToolCallLoopSaga"
import { call, put, race, take } from "../Utils"


type PlanningSagaOpts = {
  prompt: string
}
export function * PlanningSaga(opts: PlanningSagaOpts) {
  logger.log('info', 'PlanningSaga->START', { opts })

  const { cancel } = yield * race({
    cancel: take('PLANNING_COMPLETION_CANCEL'),
    success: call(function * () {
      try {
        const { prompt } = opts
        yield * put({ type: 'PLANNING_COMPLETION_STARTED', payload: { message: prompt } })

        const systemPrompt = yield * call(fetchPromptTemplate)

        const chatSession = mkChatSession({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: prompt },
          ]
        })

        // ----------------------------------------------------------------- //
        // Fetch a Completion
        // ----------------------------------------------------------------- //
        const completionResult = yield * StreamCompletionSaga({ chatSession })
        const { assistantMessage, usage } = completionResult

        // ----------------------------------------------------------------- //
        // Handle Any Tool Calls
        // ----------------------------------------------------------------- //
        let toolCalls = assistantMessage.tool_calls ?? []
        if (toolCalls.length) yield * ToolCallLoopSaga({ assistantMessage, toolCalls })

        // ----------------------------------------------------------------- //
        // Done!
        // ----------------------------------------------------------------- //
        yield * put({ type: 'PLANNING_COMPLETION_SUCCESS', payload: { assistantMessage, usage } })
      } catch (error) {
        if (yield * cancelled()) {
          yield * put({ type: 'PLANNING_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
          return
        }
        yield * put({ type: 'PLANNING_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
        console.error(error)
      }
    })
  })

  if (cancel) {
    logger.log('info', 'PlanningSaga->CANCELLED', { cancel })
  }

  logger.log('info', 'PlanningSaga->END', { cancel })


}

async function fetchPromptTemplate() {
  const file = Bun.file(`${CWD}/prompts/researchAndPlanTask.xml`)
  return file.text()
}

function formatPrompt(promptTemplate: string, prompt: string) {
  return promptTemplate.replace('{-{TASK_DESCRIPTION}-}', prompt)
}
