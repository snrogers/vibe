import {z} from "zod";


export const RagDocumentSchema = z.object({
  _tag:      z.literal('RagDocument').optional(),
  embedding: z.array(z.number()),
  metadata:  z.record(z.any()),
  text:      z.string()
});
export type RagDocument = z.infer<typeof RagDocumentSchema>;

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
