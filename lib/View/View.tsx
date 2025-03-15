import { Box, Text, useStdin } from "ink"
import { useState, type FC } from "react"

import type { AppState } from '../App/AppReducer'
import type { AppStore } from "../App/AppStore"
import type { ChatMessage } from "../Domain/ChatSession"
import { Header } from "./Header"
import { InputField } from './InputField'
import { MessageList } from "./MessageList"
import { type appStore } from "../App"
import { useAppSelector, withAppProvider } from '../App/AppProvider'


export const View: FC = withAppProvider(() => {
  const messages  = useAppSelector((st) => st.chatSession.messages)
  // const messages  = [] as ChatMessage[]
  const [inputValue, setInputValue] = useState("")

  const { isRawModeSupported } = useStdin()

  const handleSubmit = (value: string) => {
    setInputValue("")
  }

  return (
    <Box flexDirection="column" width="100%" height="100%">
      <Header />

      <MessageList messages={messages} />

      <InputField
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
      />
    </Box>
  )
})
