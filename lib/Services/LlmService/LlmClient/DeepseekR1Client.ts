import { DEEPSEEK_API_KEY } from "@/lib/Constants";
import type {CompletionOpts} from "./LlmClient";
import type {ChatSession} from "@/lib/Domain";

import {getApiClient, type LlmConfig} from "./getApiClient";


export const DEEPSEEK_MODEL = 'deepseek-r1';

export const deepseekR1ClientConfig: LlmConfig = {
  api:     'openai',
  model:    DEEPSEEK_MODEL,
  baseUrl: 'https://api.deepseek.com/v1',
  apiKey:   DEEPSEEK_API_KEY!,
}

export function generateCompletion(client: LlmConfig, chatSession: ChatSession, completionOpts?: CompletionOpts) {
  const { model } = client
  const oaiClient = getApiClient(client)

  return oaiClient.chat.completions.create({
    model,
    messages: chatSession.messages,
    ...completionOpts
  })
}

export const DeepseekR1Client = {
  generateCompletion,
}
