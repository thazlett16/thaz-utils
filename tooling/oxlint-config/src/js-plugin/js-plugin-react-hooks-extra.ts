import { defineConfig } from 'oxlint';

import { baseConfig } from '#src/base-config';

export const jsPluginReactHooksExtraConfig = defineConfig({
  ...baseConfig,
  jsPlugins: [
    {
      name: 'js-plugin-react-hooks-extra',
      specifier: 'eslint-plugin-react-hooks-extra',
    },
  ],
  rules: {
    'js-plugin-react-hooks-extra/no-direct-set-state-in-use-effect': 'warn',
  },
});
