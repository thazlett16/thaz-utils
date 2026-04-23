import { oxfmtConfig } from '@thazstack/oxfmt-config';
import { fullConfig } from '@thazstack/oxlint-config';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  run: {
    cache: {
      scripts: false,
      tasks: false,
    },
    tasks: {
      build: {
        command: 'vp run build -r',
      },
      'build:no-cache': {
        command: 'vp run build -r --no-cache',
      },
      check: {
        command: 'vp check',
        dependsOn: ['@thazstack/oxfmt-config#build', '@thazstack/oxlint-config#build'],
      },
      'check:fix': {
        command: 'vp check --fix',
        dependsOn: ['@thazstack/oxfmt-config#build', '@thazstack/oxlint-config#build'],
      },
    },
  },
  lint: {
    extends: [fullConfig],
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ['**/packages/**/*.ts', '**/tooling/**/*.ts'],
        rules: {
          // In library code we need to disable this as there has to be barrel export points.
          'oxc/no-barrel-file': 'off',
          // In library code we need to return undefined for certain cases.
          'unicorn/no-useless-undefined': 'off',
        },
      },
      {
        files: ['**/*.test.ts', '**/*.test-d.ts'],
        rules: {
          'typescript/no-unsafe-argument': 'off',
          'typescript/no-unsafe-assignment': 'off',
          'unicorn/consistent-function-scoping': 'off',
        },
      },
    ],
  },
  fmt: oxfmtConfig,
});
