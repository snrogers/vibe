import type {
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionToolMessageParam,
} from 'openai/resources';

import type {ChatMessage} from './Message';



export type ChatMessageRole = ChatMessage['role']

export type ChatSession = {
  _tag?: 'ChatSession'
  id?: string
  messages: Array<ChatMessage>
}

export const mkChatSession = (opts: { id?: string, messages: ChatMessage[] }) => {
  return {
    _tag: 'ChatSession' as const,
    id: opts.id,
    messages: opts.messages,
  }
}

export const mkEmptyChatSession = (): ChatSession => ({
  _tag: 'ChatSession' as const,
  messages: [],
})


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
export type AssistantMessage = ChatCompletionAssistantMessageParam;
export type SystemMessage   = ChatCompletionSystemMessageParam;
export type ToolMessage    = ChatCompletionToolMessageParam;
