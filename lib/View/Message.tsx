import React, { type FC } from 'react'
import { Box, Text } from 'ink'


interface MessageProps {
  text: string
}
export const Message: FC<MessageProps> = ({ text }) => {
  return (
    <Box padding={1} marginBottom={1} borderStyle="round" borderColor="green">
      <Text>{text}</Text>
    </Box>
  )
}

