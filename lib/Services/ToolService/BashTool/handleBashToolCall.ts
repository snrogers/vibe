import type { SystemMessage, ToolMessage } from "@/lib/Domain/ChatSession";
import type { ChatCompletionMessageToolCall } from "openai/resources";

import { appStore } from "@/lib/App";
import { logger } from "@/lib/Services/LogService";

import { StringifiedBashToolArgsSchema } from "./Args";

type BashResult = {
  exitCode: number | null
  stdout:   string
  stderr:   string
}

export const REMINDER = `
  If you have made any edits with this tool call, please check to make sure they have been applied correctly!
`

export const handleBashToolCall = async (toolCall: ChatCompletionMessageToolCall): Promise<(ToolMessage | SystemMessage)[]> => {
  logger.log('info', `Handling bash tool call: ${JSON.stringify(toolCall, null, 2)}`);

  const { function: { arguments: argsJson }, id: tool_call_id } = toolCall;
  const { command } = StringifiedBashToolArgsSchema.parse(argsJson);

  // ----------------------------------------------------------------- //
  // We do a little safety
  // TODO: REMOVE SAFETY
  // ----------------------------------------------------------------- //
  if (command.startsWith('git')) throw new Error('Git commands are not allowed');

  // and then we do a little commanding
  const { exitCode, stdout, stderr } = await runCommand(command);

  // Provide informative content even if empty
  let content = exitCode === 0 ? stdout : `Error: Command failed with exit code ${exitCode}\n${stderr}`;

  if (!content.trim()) {
    content = "Command executed successfully but produced no output.";
  }

  logger.log('info', `Command result (exitCode=${exitCode}): ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`);

  return [{
    tool_call_id: toolCall.id,
    role: 'tool',
    content: formatResponse({ exitCode, stdout, stderr }),
  }];
};


// ----------------------------------------------------------------- //
// Helpers
// ----------------------------------------------------------------- //

export const getReminder = (isError: boolean): string => {
  if (isError) {
    return `
Your command returned a non-zero exit code.
Please check the output for any errors.

If you were editing a file, read the file contents again to make sure you didn't accidentally make any unintended changes.

Don't just repeat the same failed command again. Instead, try to understand what went wrong and fix it.

If you can't figure out what went wrong, please ask the User for help.
`.trim()
  }
  return `
If you have made any edits with this tool call, please check to make sure they have been applied correctly!

  `
}


const formatResponse = (result: BashResult): string => {
  const { exitCode, stdout, stderr } = result;

  return `
<Reminder>
  ${REMINDER}
</Reminder>
<Output>
  <ExitCode>${exitCode}</ExitCode>
  <Stdout>${stdout.trim()}</Stdout>
  <Stderr>${stderr.trim()}</Stderr>
</Output>
  `.trim();
}

const runCommand = async (command: string) => {
  const cwd = process.cwd();

  const spawnResult = Bun.spawn({
    cmd: ['bash', '-c', command],
    cwd,
  });

  await spawnResult.exited;

  const { stdout: stdoutBuffer, stderr: stderrBuffer, exitCode } = spawnResult;
  const stdout = await new Response(stdoutBuffer).text();
  const stderr = await new Response(stderrBuffer).text();

  return {
    exitCode,
    stdout,
    stderr,
  };
}
