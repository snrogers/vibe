import { call, cancelled, put, select, take, takeEvery } from 'typed-redux-saga'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '../AppState'
import { StreamCompletionSaga } from './StreamCompletionSaga'
import { serializeError } from 'serialize-error'


export function * ChatSaga() {
  while (true) {
    try {
      const userPrompt = yield * take<AppEvent>('PROMPT_SUBMITTED')

      const chatSession = yield * select((state: AppState) => state.chatSession)
      const message = yield * StreamCompletionSaga({ chatSession })

      // TODO: Handle Tool Calls

      yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message } })
    } catch (error) {
      if (yield * cancelled()) {
        yield * put({ type: 'debug/cancelled', payload: { error: serializeError(new Error('wtf why are we here in ChatSaga->cancelled?')) } })
        yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(new Error('wtf why are we here in ChatSaga->cancelled?')) } })
        return
      }
      yield * put({ type: 'debug/error', payload: { error: serializeError(new Error('wtf why are we here in ChatSaga->error?NOTcancelled')) } })
      yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error: serializeError(error) } })
      console.error(error)
    }
  }
}
