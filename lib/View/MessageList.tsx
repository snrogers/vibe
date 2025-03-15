import { type FC } from "react";
import { Box } from "ink";
import { Frame } from "./Frame";
import { Message } from "./Message";
import { MessagePartial } from "./MessagePartial";
import { useAppSelector } from "../App/AppProvider";

export const MessageList: FC = () => {
  const messages = useAppSelector((st) => st.chatSession.messages);
  const completionDelta = useAppSelector((st) => st.completionDelta);

  return (
    <Frame height="100%" overflow="hidden">
      {messages.map((message, idx) => (
        <Message key={idx} message={message} />
      ))}
      {completionDelta && <MessagePartial partial={completionDelta} />}
    </Frame>
  );
};
