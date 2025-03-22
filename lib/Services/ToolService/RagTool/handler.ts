import type { ChatCompletionMessageToolCall } from "openai/resources";
import type { ToolMessage } from "@/lib/Domain";
import { RagToolCommandSchema } from "./Parameters";
import { DbService } from "@/lib/Services/DbService";
import { generateEmbedding } from "./fetchEmbedding";
import { mkRagDocument, type RagDocument } from "@/lib/Services/DbService/RagDocument";

export async function handleRagToolCall(toolCall: ChatCompletionMessageToolCall): Promise<ToolMessage[]> {
  const { function: { arguments: argsStr }, id: tool_call_id } = toolCall;
  const args = RagToolCommandSchema.parse(JSON.parse(argsStr));

  try {
    // Ensure DB is initialized
    await DbService.init();

    if (args.type === "save") {
      // Generate embedding for the text data
      const { embedding } = await generateEmbedding(args.data);

      // Create a RagDocument
      const document = mkRagDocument({
        embedding,
        text: args.data,
        metadata: {
          file_path: "rag_tool_data",
          updated_at: new Date().toISOString(),
          ...(args.metadata || {})
        }
      });

      // Save to database
      await DbService.saveDocument(document);

      return [{
        role: 'tool',
        tool_call_id,
        content: `Data successfully saved with ${embedding.length} dimensional embedding vector and ${args.metadata ? 'custom metadata' : 'default metadata only'}`
      }];
    } else if (args.type === "retrieve") {
      // Generate embedding for the query
      const { embedding } = await generateEmbedding(args.query);

      // Semantic search using vector similarity
      const result = await DbService.findDocumentByVector(embedding) as RagDocument;

      if (!result) {
        return [{
          role: 'tool',
          tool_call_id,
          content: "No matching data found for the query"
        }];
      }

      return [{
        role: 'tool',
        tool_call_id,
        content: `Retrieved data: ${result.text}\nMetadata: ${JSON.stringify(result.metadata)}`
      }];
    } else {
      throw new Error("Invalid command type");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return [{
      role: 'tool',
      tool_call_id,
      content: `Error processing RAG tool request: ${errorMessage}`
    }];
  }
}
