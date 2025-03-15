import React, { type FC } from 'react'
import { Box, Text } from 'ink'
import type { ChatMessage } from '../Domain/ChatSession'


interface MessageProps {
  message: ChatMessage
}
export const Message: FC<MessageProps> = ({ message }) => {
  const { role, content } = message
  if (content === undefined)       return <Text>NO CONTENT</Text>
  if (role !== 'user')             return <Text>UNIMPLMENTED ROLE</Text>
  if (typeof content !== 'string') return <Text>UNIMPLMENTED CONTENT</Text>

  return (
    <Box padding={1} marginBottom={1} borderStyle="round" borderColor="green">
      <Text>{content}</Text>
    </Box>
  )
}

