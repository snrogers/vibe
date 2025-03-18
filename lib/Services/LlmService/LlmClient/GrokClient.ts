import OpenAI from "openai";
import type { APIPromise } from "openai/core"
import type { ChatCompletion, ChatCompletionChunk, ChatCompletionTool } from "openai/resources"
import type { Stream } from "openai/streaming"
import type { Completions } from "openai/resources/completions"

import { GROK_API_KEY } from "@/lib/Constants";
import type { ChatSession } from "@/lib/Domain/ChatSession";
import type { Simplify } from "@/lib/Types";

import { LlmClient, type CompletionOpts, type StreamCompletionOpts } from "./LlmClient";


export const GROK_MODEL = 'grok-2-latest';
const openAiClient = new OpenAI({
  apiKey:  GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export class GrokClient extends LlmClient {
  getModel() { return GROK_MODEL }

  generateCompletion(chatSession: ChatSession, completionOpts?: StreamCompletionOpts): APIPromise<Stream<ChatCompletionChunk>>
  generateCompletion(chatSession: ChatSession, completionOpts?: CompletionOpts) {
    return openAiClient.chat.completions.create({
      model:    this.getModel(),
      messages: chatSession.messages,
      ...completionOpts
    })
  }
}

export const grokClient = new GrokClient()
