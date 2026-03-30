import { defineConfig } from 'oxlint';

import { baseConfig } from '#src/base-config';

export const importConfig = defineConfig({
  ...baseConfig,
  plugins: ['import'],
  rules: {
    // Correctness Rules
    // Suspicious Rules
    'import/no-unassigned-import': [
      'error',
      {
        allow: ['**/*.css'],
      },
    ],

    // Perf Rules
    // Restriction Rules
    'import/no-amd': 'error',
    'import/no-commonjs': 'error',
    'import/no-cycle': 'error',
    'import/no-default-export': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-webpack-loader-syntax': 'error',

    // Pedantic Rules
    // Style Rules
    'import/consistent-type-specifier-style': 'error',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-default': 'error',
  },
});
