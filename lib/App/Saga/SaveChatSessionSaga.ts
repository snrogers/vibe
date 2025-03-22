import { DbService } from '@/lib/Services/DbService';
import type { AppState } from '@/lib/App/AppState';
import {call, select, takeEvery} from '../Utils';

export function * watchSaveChatSessionSaga() {
  yield * takeEvery(['PROMPT_SUBMITTED', 'CHAT_COMPLETION_SUCCESS', 'TOOLS_COMPLETE'], function * () {
    const chatSession = yield * select((state: AppState) => state.chatSession);
    yield * call(DbService.saveChatSession, chatSession);
  });
}
