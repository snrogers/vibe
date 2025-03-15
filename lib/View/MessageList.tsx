import React, { type FC } from 'react'
import { Box } from 'ink'
import { Message } from './Message';
import type { ChatMessage } from '../Domain/ChatSession';
import { useAppSelector } from '../App/AppProvider';
import { MessagePartial } from './MessagePartial';

export const MessageList: FC = (props) => {
  const messages        = useAppSelector((st) => st.chatSession.messages)
  const completionDelta = useAppSelector((st) => st.completionDelta)

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

      {completionDelta && (
        <MessagePartial partial={completionDelta} />
      )}
    </Box>
  )
}
