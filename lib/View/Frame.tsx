import { Box } from "ink"
import type { ComponentProps, FC } from "react"


type FrameProps = ComponentProps<typeof Box>
export const Frame: FC<FrameProps> = (props) => {
  const { children, ...rest } = props

  return (
    <Box
      flexDirection="column"
      width="100%"
      height="100%"
      borderStyle="round"
      borderColor="yellow"
      padding={1}
      {...rest}
    >
      {children}
    </Box>
  )
}
