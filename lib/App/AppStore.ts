import { configureStore } from '@reduxjs/toolkit'

// FIXME: Fix the types, but ignoring the types here has really small locality
// @ts-expect-error
import createSagaMiddleware from '@redux-saga/core'

import { appReducer } from './AppReducer'
import { RootSaga } from './Saga'

const sagaMiddleware = createSagaMiddleware()

export type AppStore  = typeof appStore
export const appStore = configureStore({
  reducer:    appReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

sagaMiddleware.run(RootSaga)
