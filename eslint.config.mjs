// @ts-check
import tsEslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts'


export default tsEslint.config(
  tsEslint.configs.base,
  {
    plugins: {
      '@stylistic/ts': stylisticTs,
      '@typescript-eslint': tsEslint.plugin
    },
    languageOptions: {
      parser: tsEslint.parser
    },
    rules: {
      'no-unused-vars': 'off',
      '@stylistic/ts/object-curly-spacing': 'error',
      '@stylistic/ts/space-before-blocks': 'error',
      '@stylistic/ts/space-before-function-paren': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    }
  }
);
