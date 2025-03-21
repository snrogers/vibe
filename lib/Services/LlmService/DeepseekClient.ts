import OpenAI from "openai";
import type { APIPromise } from "openai/core.mjs";
import type { ChatCompletionChunk } from "openai/resources/index.mjs";
import type { Stream } from "openai/streaming.mjs";

import { LlmClient, type StreamCompletionOpts, type CompletionOpts } from "./LlmClient/LlmClient";
import { DEEPSEEK_API_KEY } from "@/lib/Constants";
import type { ChatSession } from "@/lib/Domain/ChatSession";


export const DEEPSEEK_MODEL = 'deepseek-chat';
export const openAiClient = new OpenAI({
  apiKey:  DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export class DeepseekClient extends LlmClient {
  getModel() { return DEEPSEEK_MODEL }

  generateCompletion(chatSession: ChatSession, completionOpts?: StreamCompletionOpts): APIPromise<Stream<ChatCompletionChunk>>
  generateCompletion(chatSession: ChatSession, completionOpts?: CompletionOpts) {
    return openAiClient.chat.completions.create({
      model:    this.getModel(),
      messages: chatSession.messages,
      ...completionOpts
    })
  }
}

export const deepseekClient = new DeepseekClient()
