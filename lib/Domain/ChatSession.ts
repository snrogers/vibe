import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionDeveloperMessageParam,
  ChatCompletionFunctionMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources';


export type ChatMessage = ChatCompletionMessageParam

export type ChatMessageRole = ChatMessage['role']

export type ChatSession = {
  id?: string
  messages: Array<ChatMessage>
}

export const addUserMessage = (session: ChatSession, message: string) => {
  const userMessage: ChatMessage = {
    role:    'user',
    content: message,
  }

  return {
    ...session,
    messages: [...session.messages, userMessage],
  }
}
