import { oxfmtConfig } from '@thazstack/config/oxfmt';
import { fullConfig } from '@thazstack/config/oxlint';
import { defineConfig } from 'vite-plus';

export default defineConfig({
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
    ],
  },
  fmt: oxfmtConfig,
});
