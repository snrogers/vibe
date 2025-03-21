import type { ModelProvider } from '../ModelProvider'
import { deepseekClient } from './DeepseekClient'
import { grokClient } from './GrokClient'


export function getLlmClient(modelProvider: ModelProvider) {
  switch (modelProvider) {
    case 'xai':
      return grokClient
    case 'deepseek':
      return deepseekClient
    default:
      throw new Error(`Unsupported model provider: ${modelProvider}`)
  }
}
