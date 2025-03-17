import React, { memo, type FC } from 'react'
import { Box, Text } from 'ink'
import type { AssistantMessage, ChatMessage, ToolMessage } from '../Domain/ChatSession'
import { dump } from '../Utils'
import { useAppSelector } from '../App/AppProvider'
import { Frame } from './Frame'

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

  const toolCalls = (message as AssistantMessage).tool_calls

  if (typeof content === 'string') {
    const style = getRoleStyle(role)
    return <Text {...style.text}>{content}</Text>
  }

  return (
    <>
      <Frame>
        { typeof content === 'string'
          ? <Text>{content}</Text>
          : <Text>UNIMPLEMENTED CONTENT: {dump(content)}</Text>
        }
      </Frame>

      { toolCalls && toolCalls.length > 0 &&
        <Frame>
          <Text>TOOL CALLS: {dump(toolCalls)}</Text>
        </Frame>
      }

      <Frame>
        <Text>{ dump(message) }</Text>
      </Frame>
    </>
  )
}

const ToolCallContent: FC<{ message: AssistantMessage }> = (props) => {
  const { message } = props

  const toolCalls = message.tool_calls ?? []

  return (
    <Frame>
      { toolCalls.map((toolCall, idx) => (
        <Text key={idx}>
          {toolCall.function.name}: ({toolCall.function.arguments})
        </Text>
      ))}
    </Frame>
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
const UserMessageView: FC<MessageProps> = (props) => {
  const { message } = props

  return (
    <MessageCard role="user">
      <MessageContent message={message} />
    </MessageCard>
  )
}

const AssistantMessageView: FC<{ message: AssistantMessage }> = (props) => {
  const { message } = props

  const toolCalls = message.tool_calls ?? []

  return (
    <MessageCard role="assistant">
      <MessageContent message={message} />
      { toolCalls.length > 0 && <ToolCallContent message={message} /> }
    </MessageCard>
  )
}

const SystemMessageView: FC<MessageProps> = (props) => {
  const { message } = props

  return (
    <MessageCard role="system">
      <MessageContent message={message} />
    </MessageCard>
  )
}

const ToolMessageView: FC<MessageProps> = (props) => {
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

export const Message: FC<MessageProps> = memo(({ message }) => {
  const { role } = message

  if (role === 'user')      return <UserMessageView      message={message} />
  if (role === 'assistant') return <AssistantMessageView message={message} />
  if (role === 'system')    return <SystemMessageView    message={message} />
  if (role === 'tool')      return <ToolMessageView      message={message} />
  if (role === 'function')  return <Text>UNIMPLEMENTED ROLE</Text>

  return (
    <Frame>
      <MessageBadge role={role} />
      <Text>{ dump(message) }</Text>
    </Frame>
  )
})
