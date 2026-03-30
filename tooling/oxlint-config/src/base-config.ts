import { defineConfig } from 'oxlint';

export const baseConfig = defineConfig({
  categories: {
    correctness: 'error',
    suspicious: 'error',
    perf: 'error',
    restriction: 'off',
    pedantic: 'off',
    style: 'off',
    nursery: 'off',
  },
  env: {
    builtin: true,
    browser: true,
    es2023: true,
    node: true,
  },
});
