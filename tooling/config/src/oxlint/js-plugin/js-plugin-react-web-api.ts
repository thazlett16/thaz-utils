import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const jsPluginReactWebAPIConfig = defineConfig({
  ...baseConfig,
  jsPlugins: [
    {
      name: 'js-plugin-react-web-api',
      specifier: 'eslint-plugin-react-web-api',
    },
  ],
  rules: {
    'js-plugin-react-web-api/no-leaked-event-listener': 'warn',
    'js-plugin-react-web-api/no-leaked-interval': 'warn',
    'js-plugin-react-web-api/no-leaked-resize-observer': 'warn',
    'js-plugin-react-web-api/no-leaked-timeout': 'warn',
  },
});
