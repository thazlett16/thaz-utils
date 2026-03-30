import { defineConfig } from 'oxlint';

import { baseConfig } from './base-config';
import { configFileConfig } from './config-file-config';
import { jsPluginReactHooksExtraConfig } from './js-plugin/js-plugin-react-hooks-extra';
import { jsPluginReactNamingConventionConfig } from './js-plugin/js-plugin-react-naming-convention';
import { jsPluginReactWebAPIConfig } from './js-plugin/js-plugin-react-web-api';
import { jsPluginTanStackQueryConfig } from './js-plugin/js-plugin-tanstack-query';
import { jsPluginTanStackRouterConfig } from './js-plugin/js-plugin-tanstack-router';
import { eslintConfig } from './native/eslint-config';
import { importConfig } from './native/import-config';
import { jsdocConfig } from './native/jsdoc-config';
import { jsxA11yConfig } from './native/jsx-a11y-config';
import { nodeConfig } from './native/node-config';
import { oxcConfig } from './native/oxc-config';
import { promiseConfig } from './native/promise-config';
import { reactConfig } from './native/react-config';
import { typescriptConfig } from './native/typescript-config';
import { unicornConfig } from './native/unicorn-config';
import { vitestConfig } from './native/vitest-config';

export const fullConfig = defineConfig({
  ...baseConfig,
  plugins: [
    ...eslintConfig.plugins,
    ...importConfig.plugins,
    ...jsdocConfig.plugins,
    ...jsxA11yConfig.plugins,
    ...nodeConfig.plugins,
    ...oxcConfig.plugins,
    ...promiseConfig.plugins,
    ...reactConfig.plugins,
    ...typescriptConfig.plugins,
    ...unicornConfig.plugins,
    ...vitestConfig.plugins,
  ],
  jsPlugins: [
    ...jsPluginReactHooksExtraConfig.jsPlugins,
    ...jsPluginReactNamingConventionConfig.jsPlugins,
    ...jsPluginReactWebAPIConfig.jsPlugins,
    ...jsPluginTanStackQueryConfig.jsPlugins,
    ...jsPluginTanStackRouterConfig.jsPlugins,
  ],
  rules: {
    ...eslintConfig.rules,
    ...importConfig.rules,
    ...jsdocConfig.rules,
    ...jsxA11yConfig.rules,
    ...nodeConfig.rules,
    ...oxcConfig.rules,
    ...promiseConfig.rules,
    ...reactConfig.rules,
    ...typescriptConfig.rules,
    ...unicornConfig.rules,
    ...vitestConfig.rules,

    ...jsPluginReactHooksExtraConfig.rules,
    ...jsPluginReactNamingConventionConfig.rules,
    ...jsPluginReactWebAPIConfig.rules,
    ...jsPluginTanStackQueryConfig.rules,
    ...jsPluginTanStackRouterConfig.rules,
  },
  extends: [configFileConfig],
});
