import { AppStore } from './AppStore'

export const dispatchEvent = (event: string) => {
  AppStore.dispatch({ type: event })
}
