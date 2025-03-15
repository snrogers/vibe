import { Args } from "@/parseArgs";

export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export const V_DEBUG =
  (process.env.V_DEBUG && (process.env.V_DEBUG === 'true'))
  || Args.debug
  || false;
