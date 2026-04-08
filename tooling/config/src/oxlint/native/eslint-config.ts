import { defineConfig } from 'oxlint';

import { baseConfig } from '../base-config';

export const eslintConfig = defineConfig({
    ...baseConfig,
    plugins: ['eslint'],
    rules: {
        // Correctness Rules
        // Suspicious Rules
        // Perf Rules

        // Restriction Rules
        'eslint/class-methods-use-this': 'error',
        'eslint/default-case': 'error',
        'eslint/no-alert': 'error',
        'eslint/no-bitwise': 'error',
        'eslint/no-console': [
            'error',
            {
                allow: ['error', 'warn'],
            },
        ],
        'eslint/no-div-regex': 'error',
        'eslint/no-empty': 'error',
        'eslint/no-empty-function': 'error',
        'eslint/no-eq-null': 'error',
        'eslint/no-iterator': 'error',
        'eslint/no-param-reassign': 'error',
        'eslint/no-plusplus': 'error',
        'eslint/no-proto': 'error',
        'eslint/no-regex-spaces': 'error',
        'eslint/no-sequences': 'error',
        'eslint/no-var': 'error',
        'eslint/no-void': [
            'error',
            {
                allowAsStatement: true,
            },
        ],
        'eslint/unicode-bom': 'error',

        // Pedantic Rules
        'eslint/accessor-pairs': 'error',
        'eslint/array-callback-return': 'error',
        'eslint/no-array-constructor': 'error',
        'eslint/no-case-declarations': 'error',
        'eslint/no-constructor-return': 'error',
        'eslint/no-else-return': 'error',
        'eslint/no-fallthrough': 'error',
        'eslint/no-inner-declarations': 'error',
        'eslint/no-lonely-if': 'error',
        'eslint/no-loop-func': 'error',
        'eslint/no-negated-condition': 'error',
        'eslint/no-new-wrappers': 'error',
        'eslint/no-object-constructor': 'error',
        'eslint/no-promise-executor-return': 'error',
        'eslint/no-prototype-builtins': 'error',
        'eslint/no-redeclare': 'error',
        'eslint/no-self-compare': 'error',
        'eslint/no-useless-return': 'error',
        'eslint/radix': 'error',
        'eslint/symbol-description': 'error',

        // Style Rules
        'eslint/curly': 'error',
        'eslint/default-case-last': 'error',
        'eslint/default-param-last': 'error',
        'eslint/func-names': 'error',
        'eslint/grouped-accessor-pairs': 'error',
        'eslint/guard-for-in': 'error',
        'eslint/no-extra-label': 'error',
        'eslint/no-implicit-coercion': 'error',
        'eslint/no-label-var': 'error',
        'eslint/no-lone-blocks': 'error',
        'eslint/no-multi-assign': 'error',
        'eslint/no-new-func': 'error',
        'eslint/no-return-assign': 'error',
        'eslint/no-script-url': 'error',
        'eslint/no-useless-computed-key': 'error',
        'eslint/operator-assignment': 'error',
        'eslint/prefer-destructuring': 'error',
        'eslint/prefer-exponentiation-operator': 'error',
        'eslint/prefer-numeric-literals': 'error',
        'eslint/prefer-object-has-own': 'error',
        'eslint/prefer-object-spread': 'error',
        'eslint/prefer-promise-reject-errors': 'error',
        'eslint/prefer-rest-params': 'error',
        'eslint/prefer-template': 'error',
    },
});
