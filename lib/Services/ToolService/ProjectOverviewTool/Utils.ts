import * as path from 'path';
import ignore from 'ignore';
import * as fs from 'fs-extra';
import archy from 'archy';
import chalk from 'chalk';

// Define the structure of a tree node
interface TreeNode {
  label: string;
  nodes: Array<string | TreeNode>;
}

/**
 * Creates a function to determine if a file path should be ignored based on .gitignore.
 * @param rootDir - The root directory containing the .gitignore file
 * @returns A function that takes a file path and returns whether it should be ignored
 */
export async function getIgnoreFunction(rootDir: string): Promise<(filePath: string) => boolean> {
  const gitignorePath = path.join(rootDir, '.gitignore');
  try {
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
    const ig = ignore().add(gitignoreContent).add('.git');
    return (filePath: string) => ig.ignores(path.relative(rootDir, filePath));
  } catch (error) {
    // If .gitignore doesn't exist, return a function that ignores nothing
    return () => false;
  }
}

/**
 * Recursively builds a tree structure of the directory.
 * @param dirPath - The current directory path to process
 * @param ignoreFunc - Function to check if a path should be ignored
 * @param rootDir - The root directory for relative path calculations
 * @returns A promise resolving to the tree structure
 */
export async function buildTree(dirPath: string, ignoreFunc: (filePath: string) => boolean, rootDir: string): Promise<TreeNode> {
  const items = await fs.readdir(dirPath, { withFileTypes: true });
  const tree: TreeNode = {
    label: chalk.blue.bold(path.basename(dirPath)),
    nodes: []
  };

  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    const relativePath = path.relative(rootDir, itemPath);

    if (ignoreFunc(relativePath)) continue;

    if (item.isDirectory()) {
      const subtree = await buildTree(itemPath, ignoreFunc, rootDir);
      tree.nodes.push(subtree);
    } else if (item.isFile()) {
      tree.nodes.push(chalk.green(item.name));
    }
  }

  return tree;
}

/**
 * Prints the directory tree in an ASCII format.
 * @param tree - The tree structure to print
 */
export function printTree(tree: TreeNode): string {
  const archyTree = {
    label: chalk.blue.bold('.'),
    nodes: tree.nodes
  };

  return archy(archyTree);
}

/**
 * Orchestrates the drawing of the directory tree from the current working directory.
 */
export async function drawDirectoryTree(): Promise<void> {
  const rootDir = process.cwd();
  const ignoreFunc = await getIgnoreFunction(rootDir);
  const tree = await buildTree(rootDir, ignoreFunc, rootDir);
  console.log(printTree(tree));
}

// Run the function and handle any errors
drawDirectoryTree().catch((error) => {
  console.error(chalk.red('Error drawing directory tree:'), error);
});
