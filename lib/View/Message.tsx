import React, { type FC } from 'react'
import { Box, Text } from 'ink'
import type { ChatMessage } from '../Domain/ChatSession'
import { pp } from '../Utils'
import { useAppSelector } from '../App/AppProvider'




// ----------------------------------------------------------------- //
// Private Components
// ----------------------------------------------------------------- //
const MessageUser: FC<MessageProps> = (props) => {
  const { message } = props
  const { content } = message
  if (content === undefined)       return <Text>NO CONTENT</Text>
  if (typeof content !== 'string') return <Text>UNIMPLMENTED CONTENT: {pp(content)}</Text>

  return (
    <Box padding={1} marginBottom={1} borderStyle="round" borderColor="green">
      <Text>{content}</Text>
    </Box>
  )
}

const MessageAssistant: FC<MessageProps> = (props) => {
  const { message } = props
  const { content } = message
  if (content === undefined)       return <Text>NO CONTENT</Text>
  if (typeof content !== 'string') return <Text>UNIMPLMENTED CONTENT: {pp(content)}</Text>

  return (
    <Box padding={1} marginBottom={1} borderStyle="round" borderColor="yellow">
      <Text>{content}</Text>
    </Box>
  )
}

const MessageSystem: FC<MessageProps> = (props) => {
  const { message } = props
  const { content } = message

  const isDebugMode = useAppSelector((st) => st.debugMode)

  if (!isDebugMode) return null

  if (content === undefined)       return <Text>NO CONTENT</Text>
  if (typeof content !== 'string') return <Text>UNIMPLMENTED CONTENT: {pp(content)}</Text>

  return (
    <Box padding={1} marginBottom={1} borderStyle="round" borderColor="cyan">
      <Text>{content}</Text>
    </Box>
  )
}



// ----------------------------------------------------------------- //
// Public Component
// ----------------------------------------------------------------- //
interface MessageProps {
  message: ChatMessage
}
export const Message: FC<MessageProps> = ({ message }) => {
  const { role } = message
  if (role === 'user')      return <MessageUser      message={message} />
  if (role === 'assistant') return <MessageAssistant message={message} />
  if (role === 'system')    return <MessageSystem    message={message} />
  if (role === 'function')  return <Text>UNIMPLMENTED ROLE</Text>

  return <Text>UNIMPLMENTED ROLE</Text>
}

