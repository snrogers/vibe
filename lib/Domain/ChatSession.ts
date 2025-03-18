import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionDeveloperMessageParam,
  ChatCompletionFunctionMessageParam,
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionToolMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources';


export type AssistantMessage = ChatCompletionAssistantMessageParam
export type ChatMessage      = ChatCompletionMessageParam
export type DeveloperMessage = ChatCompletionDeveloperMessageParam
export type SystemMessage    = ChatCompletionSystemMessageParam
export type ToolMessage      = ChatCompletionToolMessageParam
export type UserMessage      = ChatCompletionUserMessageParam

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

export const addAssistantMessage = (session: ChatSession, message: ChatMessage) => {
  return {
    ...session,
    messages: [...session.messages, message],
  }
}

export const addToolCallResults = (session: ChatSession, toolCallResults: ChatMessage[]) => {
  return {
    ...session,
    messages: [...session.messages, ...toolCallResults],
  }
}

export const getTranscript = (session: ChatSession): string => {
  return session.messages.map((m) => `
    ${m.role}:
    ${m.content}
  `).join('\n\n\n')
}

