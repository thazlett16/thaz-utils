import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const vitestConfig = defineConfig({
  ...baseConfig,
  plugins: ['vitest'],
  rules: {
    // Correctness Rules
    // Suspicious Rules
    // Perf Rules
    // Restriction Rules
    // Pedantic Rules
    'vitest/no-conditional-in-test': 'error',

    // Style Rules
    'vitest/consistent-test-it': 'error',
    'vitest/consistent-vitest-vi': 'error',
    'vitest/no-alias-methods': 'error',
    'vitest/no-duplicate-hooks': 'error',
    'vitest/no-identical-title': 'error',
    'vitest/no-import-node-test': 'error',
    'vitest/no-interpolation-in-snapshots': 'error',
    'vitest/no-mocks-import': 'error',
    'vitest/no-test-prefixes': 'error',
    'vitest/no-test-return-statement': 'error',
    'vitest/no-unneeded-async-expect-function': 'error',
    'vitest/prefer-called-once': 'error',
    'vitest/prefer-called-with': 'error',
    'vitest/prefer-comparison-matcher': 'error',
    'vitest/prefer-each': 'error',
    'vitest/prefer-equality-matcher': 'error',
    'vitest/prefer-expect-resolves': 'error',
    'vitest/prefer-hooks-in-order': 'error',
    'vitest/prefer-hooks-on-top': 'error',
    'vitest/prefer-lowercase-title': 'error',
    'vitest/prefer-mock-promise-shorthand': 'error',
    'vitest/prefer-spy-on': 'error',
    'vitest/prefer-strict-equal': 'error',
    'vitest/prefer-to-be': 'error',
    'vitest/prefer-to-be-falsy': 'error',
    'vitest/prefer-to-be-object': 'error',
    'vitest/prefer-to-be-truthy': 'error',
    'vitest/prefer-to-contain': 'error',
    'vitest/prefer-to-have-length': 'error',
    'vitest/prefer-todo': 'error',
    'vitest/require-hook': 'error',
    'vitest/require-top-level-describe': 'error',
  },
});
