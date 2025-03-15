import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionToolMessageParam,
  Completions,
  ChatCompletionChunk
} from 'openai/resources';
import type { ChatCompletionStream } from 'openai/lib/ChatCompletionStream.mjs';
import type { Stream } from 'openai/streaming';

import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { dump } from '@/lib/Utils';
import { DEEPSEEK_API_KEY } from '@/lib/Constants';
import type { ChatSession } from '@/lib/Domain/ChatSession';

const MODEL = 'deepseek-chat';
const DEEPSEEK_CLIENT = new OpenAI({
  apiKey:   DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export const client = new OpenAI({
  apiKey:   DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export const streamChatCompletion = async (chatSession: ChatSession) => {
  const { messages } = chatSession

  const completion = await DEEPSEEK_CLIENT.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.5,
    max_tokens: 1000,
    stream: true,
  });

  return completion;
};

export const fetchChatCompletion = async (chatSession: ChatSession) => {
  const { messages } = chatSession

  const completion = await DEEPSEEK_CLIENT.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.5,
    max_tokens: 1000,
    stream: false,
  });

  return completion;
};

export const LlmService = {
  streamChatCompletion,
  fetchChatCompletion,
};
