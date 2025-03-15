import { fork } from "typed-redux-saga"
import { ChatSaga } from "./ChatSaga"
import { EventLogSaga } from "./EventLogSaga"

export const RootSaga = function * () {
  yield * fork(ChatSaga)
  yield * fork(EventLogSaga)
}
