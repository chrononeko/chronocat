const { resolve } = require('node:path')

module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [resolve(__dirname, 'tsconfig.json')],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  rules: {
    'require-await': 'off',
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
    'no-unused-vars': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'import/no-default-export': 'error',
    'import/consistent-type-specifier-style': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
  },
}
