import {
  useEffect,
  useMemo,
  useState
} from "react"

import { appStore } from "./AppStore"
import type { Xf } from "../Types"
import type { AppState } from "./AppState"



// ----------------------------------------------------------------- //
// Hooks
// ----------------------------------------------------------------- //
export const useAppSelector = <T extends any>(selector: Xf<AppState, T>) => {
  const [state, setState] = useState(appStore.getState())

  const subState = useMemo(() => selector(state), [state, selector])

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => {
      setState(appStore.getState())
    })
    return unsubscribe
  },
  [appStore])

  return subState
}
