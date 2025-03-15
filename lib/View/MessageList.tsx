import React, { type FC } from 'react'
import { Box } from 'ink'
import { Message } from './Message';

interface MessageListProps {
  messages: Array<{ id: number; text: string }>
}

export const MessageList: FC<MessageListProps> = ({ messages }) => {
  return (
    <Box
      flexDirection="column"
      flexGrow={1}
      width="100%"
      overflowY="hidden"
    >
      {messages.map(message => (
        <Message key={message.id} text={message.text} />
      ))}
    </Box>
  )
}
