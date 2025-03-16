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
import type { ChatCompletionMessageToolCall } from 'openai/resources';
import type { Stream } from 'openai/streaming';

import { dump } from '@/lib/Utils';
import { DEEPSEEK_API_KEY } from '@/lib/Constants';
import type { ChatSession } from '@/lib/Domain/ChatSession';

import { BashTool } from '../ToolService/BashTool';
import { DEEPSEEK_MODEL, deepseekClient } from './DeepseekClient';
import { GROK_MODEL, grokClient } from './GrokClient';
import { ProjectOverviewTool } from '../ToolService/ProjectOverviewTool';
import { ALL_TOOLS } from '../ToolService';


const MODEL  = GROK_MODEL
const client = grokClient

export const streamChatCompletion = async (chatSession: ChatSession) => {
  const { messages } = chatSession

  const completionStream = await client.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.5,
    max_tokens: 8192 / 2,
    tools: ALL_TOOLS,
    tool_choice: 'auto',
    stream: true,
  });

  return completionStream;
};

export const fetchChatCompletion = async (chatSession: ChatSession) => {
  const { messages } = chatSession

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.5,
    max_tokens: 1000,
    tools: [BashTool, ProjectOverviewTool],
    stream: false,
  });

  return completion;
};

export const LlmService = {
  streamChatCompletion,
  fetchChatCompletion,
};
