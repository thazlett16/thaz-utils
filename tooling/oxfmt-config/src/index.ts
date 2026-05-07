import { defineConfig } from 'oxfmt';

export const oxfmtConfig = defineConfig({
  // These values can clash with editorconfig so keep in sync
  endOfLine: 'lf',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,

  // Everything else after
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  singleAttributePerLine: true,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',

  overrides: [
    {
      files: ['*.json', '*.jsonc', '*.json5'],
      options: {
        trailingComma: 'none',
      },
    },
  ],

  sortImports: {
    order: 'asc',
    newlinesBetween: true,
    internalPattern: ['@src/', '@test/', '@mock/', '#src/', '#test/', '#mock/'],

    customGroups: [
      {
        elementNamePattern: ['oxfmt', 'oxlint', 'oxlint-tsgolint'],
        groupName: 'oxc',
      },
      // {
      //   elementNamePattern: [
      //     'tsdown',
      //     'rolldown',
      //     'rollup-*',
      //     'rolldown-*',
      //   ],
      //   groupName: 'tsdown',
      // },
      {
        elementNamePattern: ['vite-plus', 'vite', 'vitest', '@vite/*', '@vitest/*', '@vitejs/*', 'vite-*', 'vitest-*'],
        groupName: 'vite',
      },
      {
        elementNamePattern: ['react', 'react-dom'],
        groupName: 'react',
      },
      {
        elementNamePattern: ['@tanstack/**'],
        groupName: 'tanStack',
      },
      {
        elementNamePattern: ['@thazstack/**'],
        groupName: 'thazstack',
      },
    ],
    groups: [
      ['builtin'],

      ['oxc'],

      ['vite'],

      ['react'],

      ['tanStack'],

      ['thazstack'],

      ['external'],

      ['internal', 'subpath'],

      ['parent', 'sibling', 'index'],

      ['style'],

      ['unknown'],
    ],
  },
});
