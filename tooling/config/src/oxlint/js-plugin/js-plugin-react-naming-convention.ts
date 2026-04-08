import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const jsPluginReactNamingConventionConfig = defineConfig({
    ...baseConfig,
    jsPlugins: [
        {
            name: 'js-plugin-react-naming-convention',
            specifier: 'eslint-plugin-react-naming-convention',
        },
    ],
    rules: {
        'js-plugin-react-naming-convention/context-name': 'warn',
        'js-plugin-react-naming-convention/ref-name': 'warn',
        'js-plugin-react-naming-convention/use-state': 'warn',
    },
});
