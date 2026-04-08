import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const jsxA11yConfig = defineConfig({
    ...baseConfig,
    plugins: ['jsx-a11y'],
    rules: {
        // Correctness Rules
        // Suspicious Rules
        // Perf Rules
        // Restriction Rules
        // Pedantic Rules
        // Style Rules
    },
});
