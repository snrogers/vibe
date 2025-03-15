// Use OpenAI's message types for compatibility
import type {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
  ChatCompletionToolMessageParam,
  Completions,
  ChatCompletionChunk
} from 'openai/resources';

// Use OpenAI's tool call types
import type { ChatCompletionMessageToolCall } from 'openai/resources';
import { dump } from '@/lib/Utils';
import type { ChatCompletionStream } from 'openai/lib/ChatCompletionStream.mjs';
import type { Stream } from 'openai/streaming.mjs';
import OpenAI from 'openai';
import { DEEPSEEK_API_KEY } from '../Constants';
import type { ChatSession } from '../Domain/ChatSession';

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
  throw new Error('Not implemented');
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
