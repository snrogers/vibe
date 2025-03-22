import { Box, Static } from "ink";
import { type FC } from "react";
import { identity, reverse, splitAt } from "rambdax";

import { InputField } from "./InputField";
import { Message } from "./Message";
import { MessagePartial } from "./MessagePartial";
import { StatusBar } from "./StatusBar";
import { appStore } from "../App";
import { logger } from "../Services/LogService";
import { useAppSelector } from "../App/AppProvider";
import { useFunctionKeys } from "./useFunctionKeys";

export const View: FC = () => {
  const {
    chatSession: { messages: unfilteredMessages },
    completionDelta,
    inspectMode,
  } = useAppSelector(identity)

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

  const [ recentMessagesReversed, oldMessagesReversed ] = splitAt(10, reverse(messages))
  const oldMessages    = reverse(oldMessagesReversed)
  const recentMessages = reverse(recentMessagesReversed)

  return (
    <>
      <Static items={oldMessages} style={{ width: '100%' }}>
        {(message, idx) => (<Message key={idx} message={message} />)}
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
