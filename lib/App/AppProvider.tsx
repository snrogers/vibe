import { createContext, useContext, useEffect, useMemo, useState, type ComponentProps, type ComponentType, type FC, type PropsWithChildren } from "react"
import { Provider as ReactReduxProvider } from 'react-redux'

import { appStore, type AppStore } from "./AppStore"
import type { Xf } from "../Types"
import type { AppState } from "./AppState"

const AppReactContext = createContext({ store: appStore })


// ----------------------------------------------------------------- //
// Provider Component
// ----------------------------------------------------------------- //
type AppProviderProps = PropsWithChildren<{
  store: AppStore
}>
export const AppProvider: FC<AppProviderProps> = (props) => {
  const { store, children } = props

  return (
    <AppReactContext.Provider value={{ store }} >
      {children}
    </AppReactContext.Provider>
  )
}

export const withAppProvider =
  <C extends ComponentType, P extends ComponentProps<C>>(Component: FC<P>) =>
    (props: P) => (
      <AppReactContext.Consumer>
        {(store) => (<Component {...props} store={store} />)}
      </AppReactContext.Consumer>
    )

// ----------------------------------------------------------------- //
// Hooks
// ----------------------------------------------------------------- //
export const useAppSelector = <T extends any>(selector: Xf<AppState, T>) => {
  const [state, setState] = useState(appStore.getState())

  const substate = useMemo(() => selector(state), [state, selector])

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setState(appStore.getState())
    })
    return unsubscribe
  },
  [appStore])

  return substate
}
