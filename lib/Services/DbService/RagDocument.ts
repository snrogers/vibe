export type RagDocument = {
  _tag?:     'RagDocument'
  embedding: number[]
  metadata:  { file_path: string, updated_at: string }
  text:      string
};

type mkRagDocumentOpts = {
  embedding: number[]
  metadata:  { file_path: string, updated_at: string }
  text:      string
};
export const mkRagDocument = (opts: mkRagDocumentOpts): RagDocument =>{
  const { embedding, metadata, text } = opts;

  return {
    _tag: 'RagDocument',
    embedding,
    metadata,
    text
  };
};
