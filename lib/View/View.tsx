import { Box, Text } from "ink";
import { useMemo, type FC } from "react";
import { Header } from "./Header";
import { InputField } from "./InputField";
import { MessageList } from "./MessageList";
import { DebugView } from "./DebugView";
import { ConfirmationModal } from "./ConfirmationModal";
import { Frame } from "./Frame";
import { useAppSelector, withAppProvider } from "../App/AppProvider";
import { pp } from "../Utils";

export const View: FC = () => {
  const state = useAppSelector((st) => st)
  const { awaitingConfirmation, debugMode, events } = state
  const lastEvent = useMemo(() => events[events.length - 1], [events])

  return (
    <Box flexDirection="column" width="100%" height="100%">
      {awaitingConfirmation ? (
        <ConfirmationModal />
      ) : (
        <>
          <Header />
          <Box flexDirection="row" flexGrow={1}>
            <Box width={debugMode ? "50%" : "100%"} height="100%">
              <MessageList />
            </Box>
            {debugMode && <DebugView />}
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
