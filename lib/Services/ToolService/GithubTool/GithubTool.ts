import type { Tool } from '../Types';
import { GithubToolArgsSchema } from './Args';
import { handleGithubToolCall } from './handleGithubToolCall';

const description = `
Perform Github operations using the gh CLI tool.
Provide the command as an array of strings, where the first element is the subcommand, followed by options and arguments.
For example:
- To list issues: ["issue", "list"]
- To create a pull request: ["pr", "create", "--title", "My PR", "--body", "Details here"]
The tool will execute the gh command and return the output.
`;

export const GithubTool = {
  name: 'github',
  description,
  argsSchema: GithubToolArgsSchema,
  handler: handleGithubToolCall,
} as const satisfies Tool;
