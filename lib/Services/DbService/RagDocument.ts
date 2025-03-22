export type RagDocument = {
  _tag?:     'RagDocument'
  embedding: number[]
  metadata:  Record<string, any>
  text:      string
};

type mkRagDocumentOpts = {
  embedding: number[]
  metadata:  Record<string, any>
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
