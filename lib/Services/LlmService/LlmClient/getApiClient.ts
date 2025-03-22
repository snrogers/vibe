import {exhaustiveCheck} from "@/lib/Utils"
import OpenAI from "openai"


export type LlmApi = 'openai'
export type LlmConfig = {
  api:     LlmApi,
  model:   string,
  baseUrl: string,
  apiKey:  string,
}

export function getApiClient(clientConfig: LlmConfig) {
  const { api, apiKey, baseUrl } = clientConfig
  switch (api) {
    case 'openai': {
      return new OpenAI({
        apiKey:   apiKey,
        baseURL:  baseUrl,
      })
    }
    default: {
      exhaustiveCheck(api)
      throw new Error(`Unsupported API: ${api}`)
    }
  }
}
