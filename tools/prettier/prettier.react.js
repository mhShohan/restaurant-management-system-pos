/**
 * React-specific Prettier configuration
 * Enhanced rules for React and JSX development
 */
import baseConfig from './prettier.config.js';

/** @type {import('prettier').Config} */
const reactConfig = {
  ...baseConfig,

  // React/JSX specific overrides
  jsxSingleQuote: true,
  bracketSameLine: false,

  // Enhanced React import ordering
  importOrder: [
    // React and React-related packages first
    '^react$',
    '^react-dom$',
    '^react/',
    '^react-dom/',
    // Next.js imports
    '^next/',
    // Node.js built-ins
    '^node:',
    // External packages
    '^@?\\w',
    // Internal packages (workspace packages)
    '^@repo/',
    // Relative imports - parent directories
    '^\\.\\./',
    // Relative imports - current directory
    '^\\.',
    // Style imports last
    '^.+\\.css$',
    '^.+\\.scss$',
    '^.+\\.module\\.(css|scss)$',
  ],

  overrides: [
    ...baseConfig.overrides,
    {
      files: ['*.tsx', '*.jsx'],
      options: {
        printWidth: 80,
        tabWidth: 2,
        bracketSameLine: false,
        jsxSingleQuote: true,
      },
    },
    {
      files: ['*.stories.@(js|jsx|ts|tsx)'],
      options: {
        printWidth: 100,
      },
    },
    {
      files: ['*.test.@(js|jsx|ts|tsx)', '*.spec.@(js|jsx|ts|tsx)'],
      options: {
        printWidth: 120,
      },
    },
  ],
};

export default reactConfig;
