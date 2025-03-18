import { Box, Static, Text } from "ink";
import { useInput } from 'ink'
import { useDispatch } from 'react-redux'
import { memo, useEffect, useMemo, type FC } from "react";
import { identity, reverse, splitAt } from "rambdax";

import { ConfirmationModal } from "./ConfirmationModal";
import { DebugView } from "./DebugView";
import { Frame } from "./Frame";
import { InputField } from "./InputField";
import { Message } from "./Message";
import { MessageList } from "./MessageList";
import { MessagePartial } from "./MessagePartial";
import { StatusBar } from "./StatusBar";
import { appStore } from "../App";
import { dump } from "../Utils";
import { logger } from "../Services/LogService";
import { useAppSelector, withAppProvider } from "../App/AppProvider";
import { useFunctionKeys } from "./useFunctionKeys";
import { useTerminalDimensions } from "./useTerminalDimensions";

export const View: FC = () => {
  const {
    awaitingConfirmation,
    chatSession: { messages: unfilteredMessages },
    completionDelta,
    debugMode,
    events,
    inspectMode,
  } = useAppSelector(identity)


  logger.log('info', 'View->render', { inspectMode })

  const lastEvent = useMemo(() => events[events.length - 1], [events])

  const { columns, rows } = useTerminalDimensions()

  useFunctionKeys((key) => {
    logger.log('info', 'View', { key, inspectMode })
    if (key !== 'F2')  return

    appStore.dispatch({
      type: 'SET_INSPECT_MODE',
      payload: { inspectMode: !inspectMode }
    } as const)
  })

  // ----------------------------------------------------------------- //
  // View
  // ----------------------------------------------------------------- //
  const messages =
    inspectMode
      ? unfilteredMessages
      : unfilteredMessages.filter((m) => !['tool', 'function', 'system'].includes(m.role))

  const [ recentMessagesReversed, oldMessagesReversed ] = splitAt(5, reverse(messages))
  const oldMessages    = reverse(oldMessagesReversed)
  const recentMessages = reverse(recentMessagesReversed)

  return (
    <>
      <Static items={oldMessages} style={{ width: '100%' }}>
        {(message) => (<Message message={message} />)}
      </Static>

      <Box flexDirection="column">
        {recentMessages.map((message, idx) => (<Message key={idx} message={message} />))}
      </Box>

      {completionDelta && <MessagePartial partial={completionDelta} />}

      <InputField />

      <StatusBar />
    </>
  );
}
