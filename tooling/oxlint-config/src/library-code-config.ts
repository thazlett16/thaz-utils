import { defineConfig } from 'oxlint';

import { baseConfig } from './base-config';

export const libraryCodeConfig = defineConfig({
  ...baseConfig,
  overrides: [
    {
      files: ['**/packages/**/*.{ts,tsx}', '**/tooling/**/*.{ts,tsx}'],

      rules: {
        // In library code we need to disable this as there has to be barrel export points.
        'oxc/no-barrel-file': 'off',

        // In library code we need to return undefined for certain cases.
        'unicorn/no-useless-undefined': 'off',

        // In library code there may be private methods marked with underscore outside our control (valibot)
        'eslint/no-underscore-dangle': 'off',
      },
    },
  ],
});
