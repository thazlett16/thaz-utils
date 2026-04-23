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
        elementNamePattern: ['react', 'react-dom'],
        groupName: 'react',
      },
      {
        selector: 'type',
        elementNamePattern: ['react', 'react-dom'],
        groupName: 'type-react',
      },
      {
        elementNamePattern: ['@tanstack/**'],
        groupName: 'tanStack',
      },
      {
        selector: 'type',
        elementNamePattern: ['@tanstack/**'],
        groupName: 'type-tanStack',
      },
      {
        elementNamePattern: ['@thazstack/**'],
        groupName: 'thazstack',
      },
      {
        selector: 'type',
        elementNamePattern: ['@thazstack/**'],
        groupName: 'type-thazstack',
      },
    ],
    groups: [
      ['type-builtin'],
      ['builtin'],

      ['type-react'],
      ['react'],

      ['type-tanStack'],
      ['tanStack'],

      ['type-thazstack'],
      ['thazstack'],

      ['type-external'],
      ['external'],

      ['type-internal', 'type-subpath'],
      ['internal', 'subpath'],

      ['type-parent', 'type-sibling', 'type-index'],
      ['parent', 'sibling', 'index'],

      ['style'],

      ['unknown'],
    ],
  },
});
