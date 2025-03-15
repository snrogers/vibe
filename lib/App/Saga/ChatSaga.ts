import { call, put, select, take, takeEvery } from 'typed-redux-saga'

import { LlmService } from '@/lib/Services/LlmService'
import type { AppEvent } from '@/lib/App/AppEvent'
import type { AppState } from '@/lib/App/AppReducer'


function * chatSaga() {
  const userPrompt = yield * take<AppEvent>('PROMPT_SUBMITTED')

  const chatSession = yield * select((state: AppState) => state.chatSession)
  const completion  = yield * call(
    LlmService.fetchChatCompletion,
    chatSession,
  )

  const response = completion.choices[0].message

  yield * put({ type: 'CHAT_COMPLETION_SUCCESS', payload: { message: response } })

}
