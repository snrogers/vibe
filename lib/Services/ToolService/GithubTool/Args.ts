import { z } from "zod";
import { zu } from "zod_utilz";

export const GithubToolArgsSchema = z.object({
  command: z.array(z.string()).describe("The gh command as an array of strings, e.g., ['issue', 'list'] or ['pr', 'create', '--title', 'My PR', '--body', 'Details here']"),
}).describe("Arguments for the GithubTool.");

export const StringifiedGithubToolArgsSchema = zu.stringToJSON().pipe(GithubToolArgsSchema);
