import { fork } from "typed-redux-saga"
import { WatchChatSaga } from "./ChatSaga"
import { EventLogSaga, WatchEventLogSaga } from "./EventLogSaga"
import { WatchHandleInputSaga } from "./HandleInputSaga"
import { logger } from "@/lib/Services/LogService"
import { eternity } from "@/lib/Utils"

export const RootSaga = function * () {
  while (true) {
    try {
      // TODO: Some kinda Onboarding flow

      yield * fork(WatchHandleInputSaga)

      yield * fork(WatchEventLogSaga)

      // Wait here until something EXPLODES
      yield eternity
    } catch (error) {
      logger.log('error', 'RootSaga->FAILED', { error })
    }
  }
}
