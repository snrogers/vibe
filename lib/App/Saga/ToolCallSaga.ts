import { LlmService } from '@/lib/Services/LlmService'
import { ToolService } from '@/lib/Services/ToolService'
import type { ChatCompletionMessageToolCall } from 'openai/resources'
import { call } from 'typed-redux-saga'

type ToolCallSagaOpts = {
  toolCall: ChatCompletionMessageToolCall
}

export function * ToolCallSaga(opts: ToolCallSagaOpts) {
  const { toolCall } = opts
  const { name, arguments: args } = toolCall.function

  const toolHandler = ToolService.getToolHandler(name)

  const result = yield * call(toolHandler, toolCall)

  return result
}
