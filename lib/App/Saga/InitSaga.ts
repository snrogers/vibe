import { call, put } from 'typed-redux-saga';
import { DbService } from '@/lib/Services/DbService'

export function* initSaga() {
  yield * call(DbService.init);
  const chatSession = yield* call(DbService.loadChatSession);
  if (chatSession) {
    yield* put({ type: 'CHAT_SESSION_LOADED', payload: { chatSession } });
  }
}
