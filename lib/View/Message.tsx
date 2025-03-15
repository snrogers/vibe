import React, { type FC } from 'react'
import { Box, Text } from 'ink'
import type { ChatMessage } from '../Domain/ChatSession'
import { pp } from '../Utils'
import { useAppSelector } from '../App/AppProvider'

// ----------------------------------------------------------------- //
// Role Badges and Styling
// ----------------------------------------------------------------- //
const getRoleStyle = (role: string) => {
  switch (role) {
    case 'user':
      return {
        badge: {
          text: '👤 You',
          color: 'green',
        },
        border: {
          style: 'round',
          color: 'green'
        },
        text: {
          color: 'white'
        }
      }
    case 'assistant':
      return {
        badge: {
          text: '🤖 AI',
          color: 'yellow',
        },
        border: {
          style: 'round',
          color: 'yellow'
        },
        text: {
          color: 'white'
        }
      }
    case 'system':
      return {
        badge: {
          text: '⚙️ System',
          color: 'cyan',
        },
        border: {
          style: 'round',
          color: 'cyan'
        },
        text: {
          color: 'cyan',
          dimColor: true
        }
      }
    default:
      return {
        badge: {
          text: `🔧 ${role}`,
          color: 'blue',
        },
        border: {
          style: 'round',
          color: 'blue'
        },
        text: {
          color: 'white'
        }
      }
  }
}

// ----------------------------------------------------------------- //
// Message Badge Component
// ----------------------------------------------------------------- //
interface MessageBadgeProps {
  role: string
}

const MessageBadge: FC<MessageBadgeProps> = ({ role }) => {
  const style = getRoleStyle(role)

  return (
    <Box
      paddingX={1}
      borderStyle="round"
      borderColor={style.border.color}
    >
      <Text bold color={style.badge.color}>{style.badge.text}</Text>
    </Box>
  )
}

// ----------------------------------------------------------------- //
// Message Card Component (to abstract away repeated markup)
// ----------------------------------------------------------------- //
interface MessageCardProps {
  role: string
  children: React.ReactNode
}

const MessageCard: FC<MessageCardProps> = ({ role, children }) => {
  const style = getRoleStyle(role)

  return (
    <Box
      flexDirection="column"
      padding={1}
      marginBottom={1}
      borderStyle={style.border.style as any}
      borderColor={style.border.color}
      width="100%"
    >
      <Box marginBottom={1}>
        <MessageBadge role={role} />
      </Box>

      {children}
    </Box>
  )
}

// ----------------------------------------------------------------- //
// Private Components
// ----------------------------------------------------------------- //
const MessageUser: FC<MessageProps> = (props) => {
  const { message } = props
  const { content } = message
  const style = getRoleStyle('user')

  if (content === undefined) return <Text>NO CONTENT</Text>
  if (typeof content !== 'string') return <Text>UNIMPLEMENTED CONTENT: {pp(content)}</Text>

  return (
    <MessageCard role="user">
      <Text {...style.text}>{content}</Text>
    </MessageCard>
  )
}

const MessageAssistant: FC<MessageProps> = (props) => {
  const { message } = props
  const { content } = message
  const style = getRoleStyle('assistant')

  if (content === undefined) return <Text>NO CONTENT</Text>
  if (typeof content !== 'string') return <Text>UNIMPLEMENTED CONTENT: {pp(content)}</Text>

  return (
    <MessageCard role="assistant">
      <Text {...style.text}>{content}</Text>
    </MessageCard>
  )
}

const MessageSystem: FC<MessageProps> = (props) => {
  const { message } = props
  const { content } = message
  const style = getRoleStyle('system')

  const isDebugMode = useAppSelector((st) => st.debugMode)

  if (!isDebugMode) return null

  if (content === undefined) return <Text>NO CONTENT</Text>
  if (typeof content !== 'string') return <Text>UNIMPLEMENTED CONTENT: {pp(content)}</Text>

  return (
    <MessageCard role="system">
      <Text {...style.text}>{content}</Text>
    </MessageCard>
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
  if (role === 'function')  return <Text>UNIMPLEMENTED ROLE</Text>

  return <Text>UNIMPLEMENTED ROLE</Text>
}
