import { Box, Text } from "ink"

import { Frame } from "./Frame"
import { useAppSelector } from "../App/AppProvider"
import { pp } from "../Utils"


export const ConfirmationModal = () => {
  const state = useAppSelector((st) => st)
  const lastMessage = state.chatSession.messages[state.chatSession.messages.length - 1]

  return (
    <Frame>
      <Text>Confirmation Modal</Text>
      <Text>This is a confirmation modal</Text>
      <Text>Press Enter to confirm</Text>
      <Text>Press Any Other Key to cancel</Text>

      <Box>
        <Text>{pp(lastMessage)}</Text>
      </Box>
    </Frame>
  )
}
