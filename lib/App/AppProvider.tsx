import { createContext, type ComponentProps, type ComponentType, type FC } from "react"
import { Provider as ReactReduxProvider } from 'react-redux'

import { appStore } from "./AppStore"

const AppReactContext = createContext(appStore)
type AppProviderProps = Omit<
  ComponentProps<typeof ReactReduxProvider>,
  'store'
>
export const AppProvider: FC<AppProviderProps> = (props) => (
  <ReactReduxProvider store={appStore} {...props }>
    {props.children}
  </ReactReduxProvider>
)

export const withAppProvider =
  <C extends ComponentType, P extends ComponentProps<C>>(Component: FC<P>) =>
    (props: P) => (
      <AppReactContext.Consumer>
        {(store) => (<Component {...props} store={store} />)}
      </AppReactContext.Consumer>
    )
