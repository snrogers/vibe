import { z } from "zod";

export const RagToolCommandSchema = z.union([
  z.object({
    type: z.literal("save"),
    data: z.string(),
    metadata: z.record(z.string(), z.any()).optional(),
  }),
  z.object({
    type: z.literal("retrieve"),
    query: z.string(),
  }),
]);

export type RagToolCommand = z.infer<typeof RagToolCommandSchema>;
