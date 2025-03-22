import { put, type SagaGenerator } from "typed-redux-saga";
import { serializeError } from "serialize-error";
import { logger } from "@/lib/Services/LogService";

import type { PROMPT_SUBMITTED } from "../AppEvent";
import { select, takeLatest } from "../Utils";
import { ChatSaga } from "./ChatSaga";
import type { AppState } from "../AppState";
import { CompactionSaga } from "./CompactionSaga";


type HandleInputSagaOpts = {
  input: string
}
export function * HandleInputSaga(opts: HandleInputSagaOpts): SagaGenerator<any, any> {
  try {
    logger.log('info', 'HandleInputSaga->START', { opts })
    const { input } = opts

    // Because I constantly say "exit" instead of
    // just ctrl+c -ing out of the app
    if (input === 'exit') process.exit(0)

    logger.log('info', '1')

    const isPrompt = !input.startsWith('/')
    if (isPrompt) {
      yield * put({ type: 'PROMPT_SUBMITTED', payload: { prompt: input } })
      yield * ChatSaga({ prompt: input })
      return
    }

    logger.log('info', '2')

    if (input.startsWith('/compact')) {
      logger.log('info', 'input.startsWith(/compact)')
      const session = yield * select((state: AppState) => state.chatSession)
      yield * CompactionSaga({ session })
    } else {
      logger.log('info', 'input.startsWith(/compact) FAILED', { input })
    }

    logger.log('info', '3')

    if (input.startsWith('/reset')) {
      logger.log('info', 'input.startsWith(/reset)')
      yield * put({ type: 'ChatSessionReset' })
      return
    }

    logger.log('info', '4')

    if (input.startsWith('/recover')) {
      logger.log('info', 'input.startsWith(/recover)')
      yield * put({ type: 'ChatSessionRecover' })
      return
    }
  } catch (error) {
    logger.log(
      'error',
      'HandleInputSaga->FAILED',
      { error: serializeError(error) }
    )
  }
}

export function * WatchHandleInputSaga() {
  yield * takeLatest(
    'INPUT_SUBMITTED',
    ({ payload }) => HandleInputSaga(payload)
  )
}
