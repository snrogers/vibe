export type Usage = {
  promptTokens:     number
  completionTokens: number
  reasoningTokens:  number
  totalTokens:      number
  promptTokensDetails: {
    textTokens:     number
    audioTokens:    number
    imageTokens:    number
    cachedTokens:   number
  }
}
