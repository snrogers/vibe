import { Args } from "@/parseArgs";

export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
export const GROK_API_KEY     = process.env.GROK_API_KEY;
export const ENV              = process.env.NODE_ENV;
export const PWD =
  Args.pwd
  ?? process.env.PWD
  ?? process.cwd()

export const V_DEBUG =
  Args.debug
  || (process.env.V_DEBUG && (process.env.V_DEBUG === 'true'))
  || false;
