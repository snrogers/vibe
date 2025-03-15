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
  const { command } = JSON.parse(toolCall.function.arguments);
  const cwd = process.cwd();

  const { stdout: stdoutBuffer, stderr: stderrBuffer, exitCode } = Bun.spawnSync({
    cmd: ['bash', '-c', command],
    cwd,
  });

  const stdout = new TextDecoder().decode(stdoutBuffer);
  const stderr = new TextDecoder().decode(stderrBuffer);
  const content = exitCode === 0 ? stdout : `Error: Command failed with exit code ${exitCode}\n${stderr}`;

  return {
    tool_call_id: toolCall.id,
    role: 'tool',
    content,
  };
};
