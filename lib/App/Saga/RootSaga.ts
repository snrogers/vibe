import { fork } from "typed-redux-saga"
import { WatchHandleInputSaga } from "./HandleInputSaga"
import { logger } from "@/lib/Services/LogService"
import { eternity } from "@/lib/Utils"
import {call} from "../Utils"
import {initSaga} from "./InitSaga"
import {serializeError} from "serialize-error"
import {watchSaveChatSessionSaga} from "./SaveChatSessionSaga"

export const RootSaga = function * () {
  while (true) {
    try {
      // Blocking call to initialize
      yield* call(initSaga);

      yield * fork(watchSaveChatSessionSaga)
      yield * fork(WatchHandleInputSaga)

      // Wait here until something EXPLODES
      yield eternity
    } catch (error) {
      logger.log(
        'error',
        'RootSaga->FAILED',
        { error: serializeError(error) },
      )
    }
  }
}
