import { z } from "zod"


export const EmbeddingResponseSchema = z.object({ embedding: z.array(z.number()) })

export const generateEmbedding = (content: string) => fetch(
  'http://localhost:11434/api/embeddings',
  {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ model: 'mxbai-embed-large', prompt: content })
  }
).then(response => EmbeddingResponseSchema.parse(response.json()))
