/**
 * This File introduces some nasty coupling,
 * tying the LlmService to the ToolService
 */

import { buildTree, getIgnoreFunction, printTree } from "../../ToolService/ProjectOverviewTool/Utils";

export async function getProjectOverview() {
  const rootDir    = process.cwd();
  const ignoreFunc = await getIgnoreFunction(rootDir);
  const tree       = await buildTree(rootDir, ignoreFunc, rootDir);
  const result     = printTree(tree);
  return `
<ProjectOverview>
${result.trim()}
</ProjectOverview>
  `.trim()
}
