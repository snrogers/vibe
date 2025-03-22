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
import type { CompletionOpts, StreamCompletionOpts } from './LlmClient/LlmClient';
import { logger } from '../LogService';
import type { ModelProvider } from './ModelProvider';
import type { ToolDef } from '../ToolService/ToolDef';
import { getCompletionTool } from '../ToolService/getTool';


type StreamChatCompletionOpts = {
  modelProvider?: ModelProvider
  modelName?: string
  toolChoice?: 'auto' | 'required' | 'none'
  tools?: ToolDef[]
}
export const streamChatCompletion =
  async (chatSession: ChatSession, opts: StreamChatCompletionOpts = {}) => {
    const { messages } = chatSession

    const toolChoice    = opts.toolChoice    ?? 'auto'
    const modelProvider = opts.modelProvider ?? 'xai'
    const modelName     = opts.modelName     ?? 'grok-latest'
    const tools         = opts.tools?.map(getCompletionTool) ?? ALL_COMPLETION_TOOLS

    const completionOpts = {
      temperature: 0.5,
      max_tokens:  8192 * 1,
      tools,
      tool_choice: toolChoice,
      stream:      true,
    } satisfies StreamCompletionOpts

    logger.log('info', 'LlmService.streamChatCompletion', { completionOpts })

    const completionStream = await grokClient.generateCompletion(
      chatSession,
      completionOpts
    );

    return completionStream;
  };

export const LlmService = {
  streamChatCompletion,
};
