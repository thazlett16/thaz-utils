import { defineConfig } from 'oxfmt';

export const oxfmtConfig = defineConfig({
    // These values can clash with editorconfig so keep in sync
    endOfLine: 'lf',
    printWidth: 120,
    tabWidth: 4,
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
        groups: [
            ['type-import'],

            ['value-builtin'],

            ['type-external'],
            ['value-external'],

            ['type-internal'],
            ['value-internal'],

            ['type-index'],
            ['value-index'],

            ['type-sibling'],
            ['value-sibling'],

            ['type-parent'],
            ['value-parent'],

            ['unknown'],
        ],
    },
});
