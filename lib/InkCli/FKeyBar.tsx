import { Box, Text } from "ink"
import type { FC } from "react"


export const FKeyBar: FC = () => {
  return (
    <Box width="100%" borderStyle="round" borderColor="cyan">
      <Box borderStyle="single" borderRight borderColor="white" >
        <Text>(F1)Help</Text>
      </Box>

      <Box borderStyle="single" borderRight borderColor="white">
        <Text>(F2)Inspector</Text>
      </Box>
  </Box>
  )
}
