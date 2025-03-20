import * as TRS from 'typed-redux-saga'
import * as ReactRedux from 'react-redux'
// @ts-expect-error
import * as RSCore from '@redux-saga/core'
// @ts-expect-error
import { eventChannel } from '@redux-saga/core'
// @ts-expect-error
import { Channel } from '@redux-saga/core'

import { makeTake, makeTakeEvery, makeTakeLatest, makeTakeLeading } from 'redux-saga-ts'
import type { SagaGenerator } from 'typed-redux-saga'

import type { AppEvent, AppEventDict, AppEventPayloadDict, AppEventType } from './AppEvent'
import type { Simplify, Xf } from '../Types'
import type { AppState } from './AppState'


type AnySagaGeneratorFn = (...args: any[]) => TRS.SagaGenerator<any, any>
type UnknownSagaGenerator   = TRS.SagaGenerator<unknown, any>

type SagaWatcherCb<ET extends AppEventType> =
  (payload: AppEventDict<ET>) => UnknownSagaGenerator

// ----------------------------------------------------------------- //
// Typed Redux Functions
// ----------------------------------------------------------------- //
export const all    = TRS.all
export const call   = TRS.call
export const cancel = TRS.cancel
export const put    = TRS.put<AppEvent>
export const race   = TRS.race

/** @deprecated unsafe */
export const select      = TRS.select // FIXME: make safe

export const take        = makeTake<AppEvent>()
export const takeEvery   = makeTakeEvery<AppEvent>()
export const takeLatest  = makeTakeLatest<AppEvent>()
export const takeLeading = makeTakeLeading<AppEvent>()


// Custom Redux-Saga Functions
export function channelFromAsyncIterable<T>(iterable: AsyncIterable<T>) {
  let cancelled = false;

  const a = eventChannel((emit: any) => {
    (async () => {
      for await (const value of iterable) {
        if (cancelled) return;
        emit(value);
      }

      emit(RSCore.END);
    })();

    return () => { cancelled = true };
  });

  return a as Channel
}

export function * mapAsyncIterable<T, U extends AnySagaGeneratorFn>(iterable: AsyncIterable<T>, mapperSaga: U) {
  const asyncIterator: AsyncIterator<T> = iterable[Symbol.asyncIterator]()
  const values:        U[]              = []

  while (true) {
    const iterResultP = asyncIterator.next()
    // @ts-expect-error because simple iterators don't type well
    const iterResult = (yield iterResultP)
    const value      = iterResult.value
    const done       = iterResult.done
    if (done) break

    const mappedValue = yield * mapperSaga(value)
    values.push(mappedValue)
  }

  return values
}


// ----------------------------------------------------------------- //
// React Redux Functions
// ----------------------------------------------------------------- //
export const useSelector = <T>(selector: (state: AppState) => T) =>
  ReactRedux.useSelector<AppState, T>(selector)

export const END = RSCore.END as any
