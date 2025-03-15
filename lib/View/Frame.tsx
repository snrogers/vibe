import { Box } from "ink";
import type { ComponentProps, FC } from "react";

type FrameProps = ComponentProps<typeof Box>;
export const Frame: FC<FrameProps> = (props) => {
  const { children, height, ...rest } = props;

  return (
    <Box
      flexDirection="column"
      width="100%"
      height={height}
      borderStyle="round"
      borderColor="yellow"
      padding={1}
      {...rest}
    >
      {children}
    </Box>
  );
};
