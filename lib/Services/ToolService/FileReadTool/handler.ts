import type { ChatCompletionMessageToolCall } from "openai/resources/index.mjs";
import path from 'path';
import type { BunFile } from "bun";

import { stringifiedParametersSchema } from "./Parameters";
import type { ToolMessage, SystemMessage } from "@/lib/Domain";
import { FileContext } from "../FileContext";


const MAX_OUTPUT_SIZE  = 0.25 * 1024 * 1024; // 0.25MB in bytes
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']);
const _MAX_IMAGE_SIZE   = 3.75 * 1024 * 1024; // 5MB in bytes, accounting for base64 encoding

export const handler = async (toolCall: ChatCompletionMessageToolCall): Promise<(ToolMessage|SystemMessage)[]> => {
  const { function: { arguments: argsStr }, id: tool_call_id } = toolCall;
  const args = stringifiedParametersSchema.parse(argsStr);
  const { file_path, offset = 1, limit } = args;

  const fullFilePath = path.resolve(file_path);

  const file = Bun.file(fullFilePath);
  const fileExists = await file.exists();

  if (!fileExists) {
    return [
      { role: 'tool', tool_call_id, content: `File does not exist: ${file_path}` },
      { role: 'system', content: 'Use the project overview tool to locate the file and try again.' },
    ]
  }

  const ext = path.extname(fullFilePath).toLowerCase();

  if (IMAGE_EXTENSIONS.has(ext)) {
    // Handle image files
    const imageData = await readImage(file, ext);
    const content = [imageData];
    return [{ role: 'tool', content: JSON.stringify(content), tool_call_id }];
  } else {
    // Handle text files
    const stats = await file.stat()
    const fileSize = stats.size;

    // Enforce size limits for text files without offset/limit
    if (fileSize > MAX_OUTPUT_SIZE && offset === 1 && limit === undefined) {
      throw new Error(formatFileSizeError(fileSize));
    }

    // Adjust offset to 0-based indexing
    const lineOffset = offset === 0 ? 0 : offset - 1;
    const { content, lineCount: _lineCount } = await readTextContent(file, lineOffset, limit);

    // Check output size after reading
    if (content.length > MAX_OUTPUT_SIZE) {
      throw new Error(formatFileSizeError(content.length));
    }

    // Update file access timestamp in the shared context
    FileContext.fileAccessTimestamps[fullFilePath] = Date.now();

    const formattedContent = addLineNumbers(content, offset);
    return [
      { role: 'tool', content: formattedContent, tool_call_id },
    ] satisfies ToolMessage[]
  }
};


/** Formats an error message for files exceeding size limits */
function formatFileSizeError(sizeInBytes: number): string {
  return `File content (${Math.round(
    sizeInBytes / 1024
  )}KB) exceeds maximum allowed size (${Math.round(
    MAX_OUTPUT_SIZE / 1024
  )}KB). Please use offset and limit parameters to read specific portions of the file, or use the GrepTool to search for specific content.`;
}

/** Reads an image file and returns it as a base64-encoded block */
async function readImage(
  file: BunFile,
  ext: string
): Promise<{ type: 'image'; source: { type: 'base64'; data: string; media_type: string } }> {
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  return {
    type: 'image',
    source: {
      type: 'base64',
      data: base64,
      media_type: `image/${ext.slice(1)}`,
    },
  };
}

/** Adds line numbers to text content starting from a given line number */
function addLineNumbers(content: string, startLine: number): string {
  const contentStr = content
    .split('\n')
    .map((line, index) => `<Line number=${startLine + index}>${line}</Line>`)
    .join('\n');

  return `
    <FileContent>
      ${contentStr}
    </FileContent>
  `.trim();
}

/** Reads text content from a file with optional offset and limit */
async function readTextContent(
  file: BunFile,
  offset: number,
  limit?: number
): Promise<{ content: string; lineCount: number; totalLines: number }> {
  const content = await file.text()
  const lines   = content.split('\n');
  const start   = offset;
  const end     = limit !== undefined ? start + limit : lines.length;
  const slicedLines = lines.slice(start, end);

  return {
    content:    slicedLines.join('\n'),
    lineCount:  slicedLines.length,
    totalLines: lines.length,
  };
}
