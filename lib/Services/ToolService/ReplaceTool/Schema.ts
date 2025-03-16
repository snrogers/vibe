export const ReplaceToolSchema = {
  type: 'object',
  properties: {
    file_path: { type: 'string', description: 'The path to the file to modify.' },
    search_string: { type: 'string', description: 'The string to search for in the file.' },
    replace_string: { type: 'string', description: 'The string to replace the search string with.' }
  },
  required: ['file_path', 'search_string', 'replace_string']
};