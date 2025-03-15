import { call, put, select, take, takeEvery } from 'typed-redux-saga'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '../AppState'
import { StreamCompletionSaga } from './StreamCompletionSaga'


export function * ChatSaga() {
  while (true) {
    try {
      const userPrompt = yield * take<AppEvent>('PROMPT_SUBMITTED')

      const chatSession = yield * select((state: AppState) => state.chatSession)
      // const completion  = yield * call(
      //   LlmService.fetchChatCompletion,
      //   chatSession,
      // )

      const completion = yield * StreamCompletionSaga({ chatSession })
      console.log('completion', completion)

      const response = completion.choices[0].message

      // TODO: Handle Tool Calls

      yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: response } })
    } catch (error) {
      yield * put({ type: 'CHAT_COMPLETION_FAILURE', payload: { error } })
      console.error(error)
    }
  }
}
