import { Box, Text } from "ink"
import { InputField } from './InputField'
import { useState, type FC } from "react"
import { MessageList } from "./MessageList"
import { Header } from "./Header"

const messages = Array(20).fill(0).map((_, i) => ({ id: i, text: `Message ${i}` }))

export const View: FC = () => {
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
}
