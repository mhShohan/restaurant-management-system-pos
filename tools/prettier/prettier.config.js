/**
 * Industry-grade Prettier configuration
 * Optimized for TypeScript, React, Next.js projects
 */

/** @type {import('prettier').Config} */
const config = {
  // Core formatting options
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Range formatting (for partial file formatting)
  rangeStart: 0,
  rangeEnd: Infinity,

  // Parser options
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',

  // HTML formatting
  htmlWhitespaceSensitivity: 'css',

  // Vue.js support (if needed)
  vueIndentScriptAndStyle: false,

  // End of line handling
  endOfLine: 'auto',

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // Plugin configuration
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  // Import sorting configuration
  importOrder: [
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
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],

  // File type overrides
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        printWidth: 100,
        proseWrap: 'always',
        tabWidth: 2,
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: ['package.json'],
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: ['*.css', '*.scss', '*.less'],
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },
    {
      files: ['*.html'],
      options: {
        printWidth: 120,
        tabWidth: 2,
        bracketSameLine: true,
      },
    },
  ],
};

export default config;
