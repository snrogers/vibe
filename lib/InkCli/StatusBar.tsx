import { Box, Text } from "ink"
import type { FC } from "react"
import { useAppSelector } from "../App/AppProvider"
import { Spinner } from "@inkjs/ui"


export const StatusBar: FC = () => {
  const inspectMode = useAppSelector((state) => state.inspectMode)
  const inProgress = useAppSelector((state) => state.inProgress)

  return (
    <>
      <Box width="100%">
        <Box borderStyle="single" borderRight borderColor="white" >
          <Text>
            (F1)Help
          </Text>
        </Box>

        <Box borderStyle="single" borderRight borderColor="white">
          <Text color={inspectMode ? 'yellow' : 'whiteBright'}>
            (F2)Inspector
          </Text>
        </Box>
      </Box>

      {/** Status info */}
      <Box>
        { inProgress && <Spinner label="Thinking..." /> }
      </Box>
    </>
  )
}
