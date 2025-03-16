import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import { logger } from "../../LogService";
import { StringifiedCurlArgumentsSchema } from "./Args";

// ----------------------------------------------------------------- //
// Handler
// ----------------------------------------------------------------- //
export async function handleCurlToolCall(
  toolCall: ChatCompletionMessageToolCall
): Promise<ToolMessage> {
  const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
  const args = StringifiedCurlArgumentsSchema.parse(argsJson);
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
