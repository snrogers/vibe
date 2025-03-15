import OpenAI from "openai";
import { GROK_API_KEY } from "@/lib/Constants";


export const GROK_MODEL = 'grok-2-latest';
export const grokClient = new OpenAI({
  apiKey:   GROK_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

