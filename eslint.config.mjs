// @ts-check

import tseslint from 'typescript-eslint';

export default tseslint.config(
  tseslint.configs.base,
  {
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: '.',
      }
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    }
  }
);

