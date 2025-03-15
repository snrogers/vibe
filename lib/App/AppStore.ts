import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { appReducer } from './AppReducer'
import { rootSaga } from './Saga'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()
// mount it on the Store
export const AppStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

// then run the saga
sagaMiddleware.run(mySaga)

// render the application
