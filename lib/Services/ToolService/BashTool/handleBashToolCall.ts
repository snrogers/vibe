import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall } from "openai/resources";
import { appStore } from "@/lib/App";
import { logger } from "@/lib/Services/LogService";

export const handleBashToolCall = async (toolCall: ChatCompletionMessageToolCall): Promise<ToolMessage> => {
  logger.log('info', `Handling bash tool call: ${JSON.stringify(toolCall, null, 2)}`);

  // Parse arguments properly
  let commandToRun = "";
  try {
    // Try parsing as JSON first
    const parsedArgs = JSON.parse(toolCall.function.arguments || "{}");
    commandToRun = parsedArgs.command || "echo 'No command specified'";
  } catch (error) {
    // If not valid JSON, try using the raw arguments string
    commandToRun = toolCall.function.arguments.trim() || "echo 'No command specified'";
  }

  logger.log('debug', `Running command: ${commandToRun}`);
  const cwd = process.cwd();

  const spawnResult = Bun.spawn({
    cmd: ['bash', '-c', commandToRun],
    cwd,
  });

  await spawnResult.exited;

  const { stdout: stdoutBuffer, stderr: stderrBuffer, exitCode } = spawnResult;
  const stdout = await new Response(stdoutBuffer).text();
  const stderr = await new Response(stderrBuffer).text();

  // Provide informative content even if empty
  let content = exitCode === 0 ? stdout : `Error: Command failed with exit code ${exitCode}\n${stderr}`;

  if (!content.trim()) {
    content = "Command executed successfully but produced no output.";
  }

  logger.log('info', `Command result (exitCode=${exitCode}): ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);

  return {
    tool_call_id: toolCall.id,
    role: 'tool',
    content,
  };
};
