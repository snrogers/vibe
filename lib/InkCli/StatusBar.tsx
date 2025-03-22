import { Box, Text } from "ink"
import type { FC } from "react"
import { Spinner } from "@inkjs/ui"

import { useAppSelector } from "../App/AppProvider"


export const StatusBar: FC = () => {
  const inspectMode = useAppSelector((state) => state.inspectMode)
  const inProgress  = useAppSelector((state) => state.inProgress)
  const usage       = useAppSelector((state) => state.usage)

  return (
    <>
      <Box width="100%">
        <Box borderStyle="single" borderRight borderColor="white" >
          <Text>
            (F1) Help
          </Text>
        </Box>

        <Box borderStyle="single" borderRight borderColor="white">
          <Text color={inspectMode ? 'yellow' : 'whiteBright'}>
            (F2) Inspector
          </Text>
        </Box>

        <Box borderStyle="single" borderRight borderColor="white">
          <Text color={inProgress ? 'yellow' : 'whiteBright'}>
            (F3) Prompt Template
          </Text>
        </Box>
      </Box>

      {/** Status info */}
      <Box>
        { inProgress
          ? <Spinner label="Thinking..." />
          : <Text>{ JSON.stringify(usage) }</Text>
        }
      </Box>
    </>
  )
}
