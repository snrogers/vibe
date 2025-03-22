
export const fetchEmbedding = (content: string) => fetch(
  'http://localhost:11434/api/embeddings',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'mxbai-embed-large', prompt: content })
  }
).then(response => response.json())
