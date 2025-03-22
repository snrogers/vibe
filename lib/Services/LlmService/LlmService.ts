import type { ChatSession } from '@/lib/Domain/ChatSession';

import { ALL_COMPLETION_TOOLS } from '../ToolService';
import { grokClient } from './LlmClient'
import type { StreamCompletionOpts } from './LlmClient/LlmClient';
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
    const toolChoice    = opts.toolChoice ?? 'auto'
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
