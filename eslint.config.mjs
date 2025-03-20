// @ts-check

import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: '.',
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    }
  }
);

