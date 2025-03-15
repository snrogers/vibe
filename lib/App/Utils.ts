import * as TReduxSaga from 'typed-redux-saga'
import * as ReactRedux from 'react-redux'
// @ts-expect-error
import * as RSCore from '@redux-saga/core'
// @ts-expect-error
import { eventChannel } from '@redux-saga/core'
// @ts-expect-error
import { Channel } from 'redux-saga'

import type { AppEvent } from './AppEvent'
import type { Xf } from '../Types'
import type { AppState } from './AppState'



type AnySagaGeneratorFn = (...args: any[]) => TReduxSaga.SagaGenerator<any, any>

// ----------------------------------------------------------------- //
// Typed Redux Functions
// ----------------------------------------------------------------- //
export const all         = TReduxSaga.all
export const call        = TReduxSaga.call
export const cancel      = TReduxSaga.cancel
export const put         = TReduxSaga.put<AppEvent>
export const race        = TReduxSaga.race
export const select      = TReduxSaga.select // FIXME: make safe
export const take        = TReduxSaga.take<AppEvent>
export const takeEvery   = TReduxSaga.takeEvery
export const takeLatest  = TReduxSaga.takeLatest
export const takeLeading = TReduxSaga.takeLeading

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
  const asyncIterator:AsyncIterator<any> = iterable[Symbol.asyncIterator]()
  const values = []

  while (true) {
    const iterResultP = asyncIterator.next()
    // @ts-expect-error
    const iterResult = (yield iterResultP)
    const value = iterResult.value
    const done = iterResult.done
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
