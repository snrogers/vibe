import { Box, Text } from "ink";
import { type FC } from "react";
import { Header } from "./Header";
import { InputField } from "./InputField";
import { MessageList } from "./MessageList";
import { DebugView } from "./DebugView";
import { ConfirmationModal } from "./ConfirmationModal";
import { Frame } from "./Frame";
import { useAppSelector, withAppProvider } from "../App/AppProvider";
import { pp } from "../Utils";

export const View: FC = () => {
  const isDebugMode = useAppSelector((st) => st.debugMode);
  const isAwaitingConfirmation = useAppSelector((st) => st.awaitingConfirmation);
  const lastEvent = useAppSelector((st) => st.events.slice(-1)[0]);

  return (
    <Box flexDirection="column" width="100%" height="100%">
      {isAwaitingConfirmation ? (
        <ConfirmationModal />
      ) : (
        <>
          <Header />
          <Box flexDirection="row" flexGrow={1}>
            <Box width={isDebugMode ? "50%" : "100%"} height="100%">
              <MessageList />
            </Box>
            {isDebugMode && <DebugView />}
          </Box>

          <InputField />

          {lastEvent && (
            <Frame>
              <Text>{pp(lastEvent)}</Text>
            </Frame>
          )}
        </>
      )}
    </Box>
  );
}
