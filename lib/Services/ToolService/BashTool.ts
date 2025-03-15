import { appStore } from "@/lib/App";
import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";

export const BashTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'bash',
    description: 'Execute bash commands to access shell functionality (e.g., file operations, system info). Returns command output or error if it fails.',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The bash command to execute (e.g., "ls -l", "cat file.txt").',
        },
      },
      required: ['command'],
    },
  },
};

export const handleBashToolCall = async (toolCall: ChatCompletionMessageToolCall): Promise<ToolMessage> => {
  console.log(`Handling bash tool call: ${JSON.stringify(toolCall, null, 2)}`);

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

  appStore.dispatch({ type: 'debug/log', payload: { message: `Running command: ${commandToRun}` } })
  const cwd = process.cwd();

  const { stdout: stdoutBuffer, stderr: stderrBuffer, exitCode } = Bun.spawnSync({
    cmd: ['bash', '-c', commandToRun],
    cwd,
  });

  const stdout = new TextDecoder().decode(stdoutBuffer);
  const stderr = new TextDecoder().decode(stderrBuffer);

  // Provide informative content even if empty
  let content = exitCode === 0 ? stdout : `Error: Command failed with exit code ${exitCode}\n${stderr}`;

  if (!content.trim()) {
    content = "Command executed successfully but produced no output.";
  }

  console.log(`Command result (exitCode=${exitCode}): ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);

  return {
    tool_call_id: toolCall.id,
    role: 'tool',
    content,
  };
};
