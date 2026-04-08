import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const promiseConfig = defineConfig({
    ...baseConfig,
    plugins: ['promise'],
    rules: {
        // Correctness Rules
        // Suspicious Rules
        // Perf Rules
        // Restriction Rules
        'promise/catch-or-return': 'error',
        'promise/spec-only': 'error',

        // Pedantic Rules
        // Style Rules
        'promise/prefer-await-to-callbacks': 'error',
        'promise/prefer-await-to-then': 'error',
        'promise/prefer-catch': 'error',
    },
});
