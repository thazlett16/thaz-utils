import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const jsdocConfig = defineConfig({
    ...baseConfig,
    plugins: ['jsdoc'],
    rules: {
        // Correctness Rules
        // Suspicious Rules
        // Perf Rules
        // Restriction Rules
        'jsdoc/check-access': 'error',
        'jsdoc/empty-tags': 'error',

        // Pedantic Rules
        // Style Rules
    },
});
