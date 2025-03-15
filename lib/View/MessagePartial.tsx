import React, { type FC } from 'react'
import { Box, Text } from 'ink'
import type { PartialCompletion } from '../App/Saga/StreamCompletionSaga'
import { pp } from '../Utils'

interface MessagePartialProps {
  partial: PartialCompletion
}

export const MessagePartial: FC<MessagePartialProps> = ({ partial }) => {
  const style = {
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

  return (
    <Box
      flexDirection="column"
      marginBottom={1}
      borderStyle={style.border.style as any}
      borderColor={style.border.color}
      width="100%"
    >
      <Box marginBottom={1}>
        <Box
          borderStyle="round"
          borderColor={style.border.color}
          paddingRight={1}
        >
          <Text bold color={style.badge.color}>{style.badge.text}</Text>
        </Box>
      </Box>

      {/* Show the streamed content */}
      {partial.content && (
        <Text {...style.text}>{partial.content}</Text>
      )}

      {/* Cursor indicator to show it's still streaming */}
      <Text color="yellow">▋</Text>
    </Box>
  )
}
