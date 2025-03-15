import { Box, Text, useStdin } from "ink"
import { useState, type FC } from "react"

import type { AppStore } from "../App/AppStore"
import type { ChatMessage } from "../Domain/ChatSession"
import { Header } from "./Header"
import { InputField } from './InputField'
import { MessageList } from "./MessageList"
import { type appStore } from "../App"
import { useAppSelector, withAppProvider } from '../App/AppProvider'
import { DebugView } from "./DebugView"
import { ConfirmInput } from "@inkjs/ui"
import { ConfirmationModal } from "./ConfirmationModal"
import { pp } from "../Utils"
import { Frame } from "./Frame"


export const View: FC = withAppProvider(() => {
  const isDebugMode = useAppSelector((st) => st.debugMode)
  const isAwaitingConfirmation = useAppSelector((st) => st.awaitingConfirmation)
  const lastEvent = useAppSelector((st) => st.events.slice(-1)[0])

  return (
    <Box flexDirection="column" width="100%" height="100%">
      { isAwaitingConfirmation 
        ? <ConfirmationModal />
        : (
        <>
          <Header />

          <Box flexDirection="row" flexGrow={1} height="80%">
            {/* MessageList (Left or Full width depending on debug mode) */}
            <Box width={isDebugMode ? "50%" : "100%"} height="100%">
              <MessageList />
            </Box>

            {/* Debug View (Right, only if debug mode is enabled) */}
            {isDebugMode && <DebugView />}
          </Box>

          <InputField />

          { lastEvent && <Frame><Text>{pp(lastEvent)}</Text></Frame> }
        </>
      )}
    </Box>
  )
})
