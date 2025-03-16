import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources/index.mjs";
import { z } from "zod";
import { zu } from "zod_utilz";
import { logger } from "../../LogService";

export const CurlTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'curl',
    description: 'Make an HTTP request using curl. The body should be a string, and the content type can be specified in the headers (e.g., "Content-Type": "application/json" for JSON).',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to make the request to.',
        },
        method: {
          type: 'string',
          description: 'The HTTP method to use (e.g., GET, POST, PUT, DELETE).',
          enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        },
        headers: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Optional headers to include in the request (e.g., {"Authorization": "Bearer token"}).',
        },
        query_params: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Optional query parameters to append to the URL (e.g., {"key": "value"}).',
        },
        body: {
          type: 'string',
          description: 'Optional request body for methods like POST or PUT (e.g., a JSON string).',
        },
      },
      required: ['url', 'method'],
    },
  },
};

// ----------------------------------------------------------------- //
// Handler
// ----------------------------------------------------------------- //

export const CurlArgumentsSchema = z.object({
  url: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']),
  headers: z.record(z.string()).optional(),
  query_params: z.record(z.string()).optional(),
  body: z.string().optional(),
});
const StringifiedArgumentsSchema = zu.stringToJSON().pipe(CurlArgumentsSchema);

export const handleCurlToolCall = async (
  toolCall: ChatCompletionMessageToolCall
): Promise<ToolMessage> => {
  try {
    const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
    const args = StringifiedArgumentsSchema.parse(argsJson);
    const { url, method, headers = {}, query_params = {}, body } = args;

    logger.log('info', 'Handling CurlToolCall', { url, method });

    // Build the URL with query parameters
    const fullUrl = buildUrl(url, query_params);

    // Construct headers options for curl
    const headersOptions = Object.entries(headers).flatMap(([key, value]) => ['-H', `${key}: ${value}`]);

    // Construct body option if present
    const bodyOption = body ? ['-d', body] : [];

    // Build curl command arguments
    const curlArgs = ['-X', method, ...headersOptions, ...bodyOption, fullUrl];

    // Execute curl using Bun.spawn
    const spawnResult = Bun.spawn(['curl', ...curlArgs]);
    await spawnResult.exited;

    const { stdout: stdoutBuffer, stderr: stderrBuffer, exitCode } = spawnResult;
    const stdout = await new Response(stdoutBuffer).text();
    const stderr = await new Response(stderrBuffer).text();

    // Determine response content
    let content = exitCode === 0 ? stdout : `Error: Curl failed with exit code ${exitCode}\n${stderr}`;
    if (!content.trim()) {
      content = 'Curl executed successfully but produced no output.';
    }

    logger.log('info', 'Handled CurlToolCall', { url, method, content: content.substring(0, 100) });

    return {
      role: 'tool',
      tool_call_id,
      content,
    };
  } catch (error) {
    logger.log('error', 'Error handling CurlToolCall', error);

    if (error instanceof z.ZodError) {
      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: `Error parsing arguments: ${error.message}`,
      };
    }
    if (error instanceof Error) {
      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: `Error handling CurlToolCall: ${error.message}`,
      };
    }
    throw error;
  }
};

// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //
function buildUrl(baseUrl: string, queryParams: Record<string, string> | undefined): string {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return baseUrl;
  }
  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
}
