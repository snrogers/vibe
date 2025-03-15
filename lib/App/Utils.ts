import * as TReduxSaga from 'typed-redux-saga'
import * as ReactRedux from 'react-redux'

import type { AppEvent } from './AppEvent'
import type { AppState } from './AppReducer'
import type { Xf } from '../Types'



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



// ----------------------------------------------------------------- //
// React Redux Functions
// ----------------------------------------------------------------- //
export const useSelector = <T>(selector: (state: AppState) => T) =>
  ReactRedux.useSelector<AppState, T>(selector)
