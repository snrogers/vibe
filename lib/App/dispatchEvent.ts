import { appStore } from './AppStore'

export const dispatchEvent = (event: string) => {
  appStore.dispatch({ type: event })
}
