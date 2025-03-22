/** Maintain record of recent file access to
 *  prevent unnecessary file reads and writes */
export const FileContext = {
  fileAccessTimestamps: {} as Record<string, number>
};
