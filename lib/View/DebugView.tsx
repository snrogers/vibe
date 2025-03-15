import React, { type FC } from 'react'
import { Box, Text } from 'ink'

import { pp } from '../Utils'
import type { AnyEvent } from '../App/AppEvent'
import { useAppSelector } from '../App/AppProvider'
import { Frame } from './Frame'


export const DebugView: FC = () => {
  const appState = useAppSelector((st) => st)
  const { events } = appState

  return (
    <Frame height="80%">
      <Box marginBottom={1}>
        <Text bold color="yellow">Debug Mode</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text bold underline color="yellow">State:</Text>
        <Text>{pp(appState)}</Text>
      </Box>

      <Box flexDirection="column">
        <Text bold underline color="yellow">Events:</Text>
        {events.length === 0 ? (
          <Text color="gray">No events dispatched yet</Text>
        ) : (
          events.map((event, idx) => (
            <Text key={idx} color="white">{pp(event)}</Text>
          ))
        )}
      </Box>
    </Frame>
  )
}
