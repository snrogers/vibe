import React, { type FC } from 'react'
import { Box } from 'ink'
import { Message } from './Message';
import type { ChatMessage } from '../Domain/ChatSession';

interface MessageListProps {
  messages: ChatMessage[]
}
export const MessageList: FC<MessageListProps> = (props) => {
  const { messages } = props

  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      width="100%"
      overflowY="hidden"
    >
      {messages.map((message, idx) => (
        <Message key={idx} message={message} />
      ))}
    </Box>
  )
}
