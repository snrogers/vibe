import { Box, Text } from "ink"

import { InputField } from './InputField'
import { useState, type FC } from "react"
import { MessageList } from "./MessageList"
import { Header } from "./Header"
import { type appStore } from "../App"
import type { AppStore } from "../App/AppStore"
import { withAppProvider } from '../App/AppProvider'
import type { AppState } from '../App/AppReducer'
import { useSelector } from "@/lib/App/Utils"


export const View: FC = withAppProvider(() => {
  const messages  = useSelector((st) => st.chatSession.messages)
  const [inputValue, setInputValue] = useState("")

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
