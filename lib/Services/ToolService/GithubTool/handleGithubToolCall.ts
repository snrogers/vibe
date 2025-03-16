import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall } from "openai/resources";
import { logger } from "@/lib/Services/LogService";
import { StringifiedGithubToolArgsSchema } from "./Args";


export const handleGithubToolCall = async (toolCall: ChatCompletionMessageToolCall): Promise<ToolMessage> => {
  const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
  const args = StringifiedGithubToolArgsSchema.parse(argsJson);
  const { command } = args;

  logger.log('info', 'Handling GithubToolCall', { command });

  const spawnResult = Bun.spawn(['gh', ...command], { cwd: process.cwd() });
  await spawnResult.exited;

  const { stdout: stdoutBuffer, stderr: stderrBuffer, exitCode } = spawnResult;
  const stdout = await new Response(stdoutBuffer).text();
  const stderr = await new Response(stderrBuffer).text();

  let content = exitCode === 0 ? stdout : `Error: Command failed with exit code ${exitCode}\n${stderr}`;
  if (!content.trim()) {
    content = "Command executed successfully but produced no output.";
  }

  logger.log('info', 'Handled GithubToolCall', { command, content: content.substring(0, 100) });

  return {
    role: 'tool',
    tool_call_id,
    content,
  };
};
