import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const jsPluginTanStackRouterConfig = defineConfig({
  ...baseConfig,
  jsPlugins: [
    {
      name: 'js-plugin-tanstack-router',
      specifier: '@tanstack/eslint-plugin-router',
    },
  ],
  rules: {
    'js-plugin-tanstack-router/create-route-property-order': 'error',
  },
});
