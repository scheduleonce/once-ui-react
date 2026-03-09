/* eslint-disable @typescript-eslint/no-require-imports */

const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  // Global ignores
  {
    ignores: ['**/dist/', '**/node_modules/', '**/storybook-static/', '**/.next/', '**/build/', '**/coverage/'],
  },

  // Main configuration
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        NodeJS: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },

    rules: {
      // Base JavaScript rules
      'no-unused-vars': 'off',
      'no-undef': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'error',

      // React rules
      'react/jsx-key': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // React Hooks rules (more lenient)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules (more lenient)
      'jsx-a11y/role-supports-aria-props': 'warn',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier configuration
  prettier,

  // Stories files - allow console
  {
    files: ['**/*.stories.@(js|jsx|ts|tsx)'],
    rules: {
      'no-console': 'off',
    },
  },
];
