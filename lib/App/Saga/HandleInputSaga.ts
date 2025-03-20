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

    const isPrompt = !input.startsWith('/')
    if (isPrompt) {
      yield * put({ type: 'PROMPT_SUBMITTED', payload: { prompt: input } })
      yield * ChatSaga({ prompt: input })
      return
    }

    if (input.startsWith('/compact')) {
      const session = yield * select((state: AppState) => state.chatSession)
      yield * CompactionSaga({ session })
    }

    if (input.startsWith('/reset')) {
      yield * put({ type: 'ChatSessionReset' })
      return
    }

    if (input.startsWith('/recover')) {
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
  console.log('WatchHandleInputSaga->START', { takeLatest,  })
  yield * takeLatest(
    'INPUT_SUBMITTED',
    ({ payload }) => HandleInputSaga(payload)
  )
}
