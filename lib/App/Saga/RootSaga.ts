import { fork } from "typed-redux-saga"
import { WatchChatSaga } from "./ChatSaga"
import { EventLogSaga, WatchEventLogSaga } from "./EventLogSaga"

export const RootSaga = function * () {
  yield * fork(WatchChatSaga)
  yield * fork(WatchEventLogSaga)
}
