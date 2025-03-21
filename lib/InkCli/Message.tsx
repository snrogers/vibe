import React, { Fragment, memo, useMemo, type FC } from 'react'
import { Box, Text } from 'ink'
import { dump } from '../Utils'
import { useAppSelector } from '../App/AppProvider'
import { Frame } from './Frame'
import { useTerminalDimensions } from './useTerminalDimensions'
import type { ChatMessage, AssistantMessage } from '@/lib/Domain'

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
  const { role, content } = message;

  // Handle string content
  if (typeof content === 'string') {
    const style = getRoleStyle(role);
    return <Text {...style.text}>{content}</Text>;
  }

  // Handle array content (e.g., from tool responses)
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((part, index) => {
          if (part.type === 'text') return <Text key={index}>{part.text}</Text>;
          else                      return <Text key={index}>Unsupported content type: {part.type}</Text>;
        })}
      </>
    );
  }

  return (
    <Frame>
      <Text>{ dump(content) }</Text>
    </Frame>
  );
};

const ToolCallContent: FC<{ message: AssistantMessage }> = (props) => {
  const { message } = props

  const args = useMemo(
    () => {
      try {
        return JSON.parse(message.tool_calls?.[0].function.arguments ?? '')
      } catch (error) {
        return { invalidArgs: message.tool_calls?.[0].function.arguments ?? 'NOARGS' }
      }
    }, [message]
    )

  const toolCalls = message.tool_calls ?? []

  return (
    <Frame>
      { toolCalls.map((toolCall, idx) => (
        <Fragment key={idx}>
          <Box>
            <Text>Tool: </Text>
            <Text key={idx} color="redBright">
              {toolCall.function.name}:
            </Text>
          </Box>

          { Object.entries(args).map(([key, val], idx) => (
            <Box key={`${idx}-arg`}>
              <Text key={idx} color="blue">
                {key}:
              </Text>

              <Text key={`${idx}-val`}>
                {dump(val)}
              </Text>
            </Box>
          ))}
      </Fragment>
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

  const { columns, rows } = useTerminalDimensions()

  return (
    <Box
      flexDirection="column"
      marginBottom={1}
      borderStyle={style.border.style as any}
      borderColor={style.border.color}
      width={columns - 2}
    >
      <Box width={columns - 2} marginBottom={1}>
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
  if (role === 'function')  return <ToolMessageView      message={message} />

  return (
    <Frame>
      <MessageBadge role={role} />
      <Text>{ dump(message) }</Text>
    </Frame>
  )
})
