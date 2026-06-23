import { defineConfig } from 'vite-plus';

import { oxfmtConfig } from '@thazstack/oxfmt-config';
import { fullConfig, libraryCodeConfig } from '@thazstack/oxlint-config';

export default defineConfig({
  staged: {
    '*.{js,ts,tsx}': 'vp check --fix',
  },
  run: {
    cache: {
      scripts: false,
      tasks: false,
    },
    tasks: {
      check: {
        command: 'vp check',
        dependsOn: ['@thazstack/oxfmt-config#build', '@thazstack/oxlint-config#build'],
      },
    },
  },
  lint: {
    extends: [fullConfig, libraryCodeConfig],
    options: { typeAware: true, typeCheck: true },
  },
  fmt: oxfmtConfig,
});
