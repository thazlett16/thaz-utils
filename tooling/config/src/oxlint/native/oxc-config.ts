import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const oxcConfig = defineConfig({
    ...baseConfig,
    plugins: ['oxc'],
    rules: {
        // Correctness Rules
        // Suspicious Rules
        // Perf Rules
        // Restriction Rules

        // Pedantic Rules
        'oxc/no-barrel-file': 'error',

        // Style Rules
    },
});
