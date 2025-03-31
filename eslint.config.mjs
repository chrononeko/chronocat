import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import { globalIgnores } from 'eslint/config'
import globals from 'globals'
import { resolve } from 'node:path'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  includeIgnoreFile(resolve(import.meta.dirname, '.gitignore')),
  globalIgnores(['**/*.d.ts'], 'Ignore external TypeScript definitions'),
  js.configs.recommended,
  typescriptEslint.configs.strictTypeChecked,
  typescriptEslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  eslintPluginReactHooks.configs['recommended-latest'],
  eslintPluginPrettierRecommended,
  // {
  //   files: ['**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}'],
  // },
  {
    rules: {
      'import/no-default-export': 'error',
      'import/consistent-type-specifier-style': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-dynamic-delete': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
)
