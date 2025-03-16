import React, { type FC } from 'react'
import { Box, Text } from 'ink'

export const Header: FC = () => {
  return (
    <Box
      borderStyle="round"
      borderColor="cyan"
      padding={1}
      width="100%"
      alignItems="center"
      justifyContent="center"
    >
      <Text bold color="cyan">Vibin!</Text>
    </Box>
  )
}
