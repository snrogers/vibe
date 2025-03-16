import { Box, Text } from "ink";
import { memo, useMemo, type FC } from "react";
import { Header } from "./Header";
import { InputField } from "./InputField";
import { MessageList } from "./MessageList";
import { DebugView } from "./DebugView";
import { ConfirmationModal } from "./ConfirmationModal";
import { Frame } from "./Frame";
import { useAppSelector, withAppProvider } from "../App/AppProvider";
import { pp } from "../Utils";
import { useTerminalDimensions } from "./useTerminalDimensions";

export const View: FC = () => {
  const state = useAppSelector((st) => st)
  const { awaitingConfirmation, debugMode, events } = state
  const lastEvent = useMemo(() => events[events.length - 1], [events])

  const { columns, rows } = useTerminalDimensions()

  return (
    <Box flexDirection="column" width={columns} height={rows} overflowY="hidden">
      {awaitingConfirmation ? (
        <ConfirmationModal />
      ) : (
        <>
          <Header />

          <MessageList />

          <InputField />
        </>
      )}
    </Box>
  );
}
