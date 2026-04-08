import { defineConfig } from 'oxlint';

import { baseConfig } from './base-config';

export const configFileConfig = defineConfig({
    ...baseConfig,
    rules: {
        // Correctness Rules
        // Suspicious Rules
        // Perf Rules
        // Restriction Rules
        // Pedantic Rules
        // Style Rules
    },
    overrides: [
        {
            files: ['**/*.config.ts'],

            rules: {
                'import/no-default-export': 'off',
            },
        },
    ],
});
