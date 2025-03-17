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
import { ALL_COMPLETION_TOOLS } from '../ToolService';


const MODEL  = GROK_MODEL
const client = grokClient

type StreamChatCompletionOpts = {
  model?: string
  toolChoice?: 'auto' | 'required' | 'none'
}
export const streamChatCompletion =
  async (chatSession: ChatSession, opts: StreamChatCompletionOpts = {}) => {
    const { messages } = chatSession
    const toolChoice = opts.toolChoice ?? 'auto'
    const model      = opts.model      ?? MODEL

    const completionStream = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.5,
      max_tokens:  8192 * 4,
      tools:       ALL_COMPLETION_TOOLS,
      tool_choice: 'auto',
      stream:      true,
    });

    return completionStream;
  };

export const LlmService = {
  streamChatCompletion,
};
