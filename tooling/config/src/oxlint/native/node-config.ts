import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const nodeConfig = defineConfig({
    ...baseConfig,
    plugins: ['node'],
    rules: {
        // Correctness Rules
        // Suspicious Rules
        // Perf Rules
        // Restriction Rules
        'node/no-process-env': 'error',

        // Pedantic Rules
        // Style Rules
    },
});
