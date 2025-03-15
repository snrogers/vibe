import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { appReducer } from './AppReducer'
import { rootSaga } from './Saga'
import { createContext, type ComponentProps, type FC } from 'react'

const sagaMiddleware = createSagaMiddleware()

export type AppStore  = typeof appStore
export const appStore = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)




