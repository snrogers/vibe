import { LlmService } from '@/lib/Services/LlmService'
import { ToolService } from '@/lib/Services/ToolService'
import type { ChatCompletionMessageToolCall } from 'openai/resources'
import { call, put } from 'typed-redux-saga'
import { take } from '../Utils'
import type { TOOL_CONFIRMED } from '../AppEvent'

type ToolCallSagaOpts = {
  toolCall: ChatCompletionMessageToolCall
}

export function * ToolCallSaga(opts: ToolCallSagaOpts) {
  const { toolCall } = opts
  const { name, arguments: args } = toolCall.function

  const toolHandler = ToolService.getToolHandler(name)

  yield * put({ type: 'TOOL_REQUEST_CONFIRMATION', payload: { toolCall } })
  const confirmationEvent = (yield * take('TOOL_CONFIRMED')) as TOOL_CONFIRMED
  const { isConfirmed } = confirmationEvent.payload

  if (!isconfirmed) process.exit(420)

  console.log('WE MADE IT WOOOOOOOOOOOOOOOO')
  console.log(toolCall)
  console.log(args)
  process.exit(420)

  await eternity


  const result = yield * call(toolHandler, toolCall)

  return result
}
