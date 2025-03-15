
import { call, put, select, take, takeEvery } from 'typed-redux-saga'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '../AppState'


export function * StreamCompletionSaga() {
  while (true) {
    try {
      const completion  = yield * call(
        LlmService.streamChatCompletion,
        chatSession,
      )

      const response = completion.choices[0].message

      // TODO: Handle Tool Calls

      yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: response } })
    } catch (error) {
      yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error } })
      console.error(error)
    }
  }
}
