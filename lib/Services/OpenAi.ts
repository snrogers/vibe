
const MODEL = 'deepseek-chat';
const DEEPSEEK_CLIENT = new OpenAI({
  apiKey:   DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

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
import type { Task } from './Task';
import type { Stream } from 'openai/streaming.mjs';
