import { Box, Static, Text } from "ink";
import { memo, useMemo, type FC } from "react";
import { InputField } from "./InputField";
import { MessageList } from "./MessageList";
import { DebugView } from "./DebugView";
import { ConfirmationModal } from "./ConfirmationModal";
import { Frame } from "./Frame";
import { useAppSelector, withAppProvider } from "../App/AppProvider";
import { dump } from "../Utils";
import { useTerminalDimensions } from "./useTerminalDimensions";
import { Message } from "./Message";
import { MessagePartial } from "./MessagePartial";
import { identity } from "rambdax";
import { FKeyBar } from "./FKeyBar";

export const View: FC = () => {
  const state = useAppSelector((st) => st)
  const { awaitingConfirmation, debugMode, events } = state
  const lastEvent = useMemo(() => events[events.length - 1], [events])

  const { columns, rows } = useTerminalDimensions()

  const { chatSession: { messages }, completionDelta } =
    useAppSelector(identity)

  return (
    <>
      <Static items={messages} style={{ width: '100%' }}>
        {(message) => (<Message message={message} />)}
      </Static>

      {completionDelta && <MessagePartial partial={completionDelta} />}

      <InputField />

      <FKeyBar />
    </>
  );
}
