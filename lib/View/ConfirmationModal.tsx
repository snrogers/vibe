import { Box, Text, useInput } from "ink"

import { Frame } from "./Frame"
import { useAppSelector } from "../App/AppProvider"
import { pp } from "../Utils"
import { appStore } from "../App";


export const ConfirmationModal = () => {
  const state = useAppSelector((st) => st);
  const lastMessage = state.chatSession.messages.slice(-1)[0];

  useInput((input, key) => {
    if (key.return) {
      appStore.dispatch({ type: 'TOOL_CONFIRMED', payload: { isConfirmed: true } });
    } else if (input) {
      appStore.dispatch({ type: 'TOOL_CONFIRMED', payload: { isConfirmed: false } });
    }
  });

  return (
    <Frame>
      <Text>Confirm Tool Call</Text>
      <Text>{pp(lastMessage)}</Text>
      <Text>Press Enter to confirm, any other key to cancel</Text>
    </Frame>
  );
};
