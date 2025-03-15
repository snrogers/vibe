import type { ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources";


export const BashTool: ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'bash',
    description: 'Run bash commands',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The command to run',
        },
      },
      required: ['command'],
    },
  }
};

export const handleBashToolCall = async (toolCall: ChatCompletionMessageToolCall): Promise<ToolMessage> => {
  const { name, arguments: argString } = toolCall.function
  const args = JSON.parse(argString)
  const cwd = process.cwd()

  const { stdout: stdoutBuffer, stderr: stderrBuffer } = Bun.spawnSync(args, {
    // args:  ['-c', args.command],
    cwd,
    // env:   process.env,
  })

  const stdout = new TextDecoder().decode(stdoutBuffer)
  const stderr = new TextDecoder().decode(stderrBuffer)

  return {
    tool_call_id: toolCall.id,
    role:         'tool',
    content:      stdout,
  }
}
