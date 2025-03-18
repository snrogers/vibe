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
import { ProjectOverviewTool } from '../ToolService/ProjectOverviewTool';
import { ALL_COMPLETION_TOOLS } from '../ToolService';
import { grokClient } from './LlmClient'


type StreamChatCompletionOpts = {
  model?: string
  toolChoice?: 'auto' | 'required' | 'none'
}
export const streamChatCompletion =
  async (chatSession: ChatSession, opts: StreamChatCompletionOpts = {}) => {
    const { messages } = chatSession
    const toolChoice = opts.toolChoice ?? 'auto'

    const completionStream = await grokClient.generateCompletion(chatSession, {
      temperature: 0.5,
      max_tokens:  8192 * 4,
      tools:       ALL_COMPLETION_TOOLS,
      tool_choice: toolChoice,
      stream:      true,
    });

    return completionStream;
  };

export const LlmService = {
  streamChatCompletion,
};
