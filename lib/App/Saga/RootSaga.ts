import { fork } from "typed-redux-saga"
import { ChatSaga } from "./ChatSaga"

export const RootSaga = function * () {
  yield * fork(ChatSaga)
}
