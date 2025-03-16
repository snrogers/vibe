import { useMemo, type FC } from "react";
import { Box } from "ink";
import { Frame } from "./Frame";
import { Message } from "./Message";
import { MessagePartial } from "./MessagePartial";
import { useAppSelector } from "../App/AppProvider";
import { DebugView } from "./DebugView";

export const MessageList: FC = () => {
  const messages = useAppSelector((st) => st.chatSession.messages);
  const completionDelta = useAppSelector((st) => st.completionDelta);
  const debugMode = useAppSelector((st) => st.debugMode);

  const trimmedMessages = useMemo(
    () => messages.slice(-10), [messages]
  )

  return (
    <Box flexDirection="row" flexGrow={1} overflowY="hidden">
      <Box width={debugMode ? "50%" : "100%"}>
        <Frame>
          {trimmedMessages.map((message, idx) => (
            <Message key={idx} message={message} />
          ))}

          {completionDelta && <MessagePartial partial={completionDelta} />}
        </Frame>
      </Box>

      {debugMode && <DebugView />}
    </Box>
  );
};
