import * as TReduxSaga from 'typed-redux-saga'
import * as ReactRedux from 'react-redux'

import type { AppEvent } from './AppEvent'
import type { Xf } from '../Types'
import type { AppState } from './AppState'


// @ts-expect-error
import { eventChannel } from '@redux-saga/core'
import { Channel } from 'redux-saga'


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

  const a = eventChannel(async (emit: any) => {
    for await (const value of iterable) {
      emit(value);
    }
  });

  return a as Channel
}



// ----------------------------------------------------------------- //
// React Redux Functions
// ----------------------------------------------------------------- //
export const useSelector = <T>(selector: (state: AppState) => T) =>
  ReactRedux.useSelector<AppState, T>(selector)

