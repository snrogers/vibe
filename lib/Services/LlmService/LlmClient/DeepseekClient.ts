import OpenAI from "openai";
import { DEEPSEEK_API_KEY } from "@/lib/Constants";


export const DEEPSEEK_MODEL = 'deepseek-chat';
const openAiClient = new OpenAI({
  apiKey:   DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
});

export const deepseekClient = {
  generateCompletion: openAiClient.chat.completions.create,
}
