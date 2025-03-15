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

interface MessageBadgeProps {
  role: string
}
const MessageBadge: FC<MessageBadgeProps> = ({ role }) => {
  const style = getRoleStyle(role)

  return (
    <Box
      borderStyle="round"
      borderColor={style.border.color}
      paddingRight={1}
    >
      <Text bold color={style.badge.color}>{style.badge.text}</Text>
    </Box>
  )
}

interface MessageContentProps {
  message: ChatMessage
}
const MessageContent: FC<MessageContentProps> = ({ message }) => {
  const { role, content } = message
  if (typeof content === 'string') {
    const style = getRoleStyle(role)
    return <Text {...style.text}>{content}</Text>
  }

  return <Text>UNIMPLEMENTED CONTENT: {pp(content)}</Text>
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
const UserMessage: FC<MessageProps> = (props) => {
  const { message } = props

  return (
    <MessageCard role="user">
      <MessageContent message={message} />
    </MessageCard>
  )
}

const AssistantMessage: FC<MessageProps> = (props) => {
  const { message } = props

  return (
    <MessageCard role="assistant">
      <MessageContent message={message} />
    </MessageCard>
  )
}

const SystemMessage: FC<MessageProps> = (props) => {
  const { message } = props

  return (
    <MessageCard role="system">
      <MessageContent message={message} />
    </MessageCard>
  )
}

const ToolMessage: FC<MessageProps> = (props) => {
  const { message } = props

  return (
    <MessageCard role="tool">
      <MessageContent message={message} />
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

  if (role === 'user')      return <UserMessage      message={message} />
  if (role === 'assistant') return <AssistantMessage message={message} />
  if (role === 'system')    return <SystemMessage    message={message} />
  if (role === 'tool')      return <ToolMessage      message={message} />
  if (role === 'function')  return <Text>UNIMPLEMENTED ROLE</Text>

  return <Text>UNIMPLEMENTED ROLE</Text>
}
