import { defineConfig } from 'oxlint';

import { baseConfig } from '#src/base-config';

export const typescriptConfig = defineConfig({
  ...baseConfig,
  plugins: ['typescript'],
  rules: {
    // Correctness Rules
    // Suspicious Rules
    // Perf Rules

    // Restriction Rules
    'typescript/no-dynamic-delete': 'error',
    'typescript/no-empty-object-type': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-import-type-side-effects': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-non-null-asserted-nullish-coalescing': 'error',
    'typescript/no-non-null-assertion': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/non-nullable-type-assertion-style': 'error',
    'typescript/promise-function-async': 'error',
    'typescript/use-unknown-in-catch-callback-variable': 'error',

    // Pedantic Rules
    'typescript/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        minimumDescriptionLength: 10,
      },
    ],
    'typescript/ban-types': 'error',
    'typescript/no-confusing-void-expression': 'error',
    'typescript/no-deprecated': 'error',
    'typescript/no-misused-promises': 'error',
    'typescript/no-unsafe-argument': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/prefer-nullish-coalescing': 'error',
    'typescript/prefer-promise-reject-errors': 'error',
    'typescript/prefer-ts-expect-error': 'error',
    'typescript/related-getter-setter-pairs': 'error',
    'typescript/require-await': 'error',
    'typescript/restrict-plus-operands': [
      'error',
      {
        allowAny: false,
        allowBoolean: false,
        allowNullish: false,
        allowNumberAndString: false,
        allowRegExp: false,
      },
    ],
    'typescript/return-await': ['error', 'always'],
    'typescript/switch-exhaustiveness-check': [
      'error',
      {
        considerDefaultExhaustiveForUnions: true,
      },
    ],

    // Style Rules
    'typescript/adjacent-overload-signatures': 'error',
    'typescript/array-type': 'error',
    'typescript/ban-tslint-comment': 'error',
    'typescript/consistent-generic-constructors': 'error',
    'typescript/consistent-indexed-object-style': 'error',
    'typescript/consistent-type-definitions': 'error',
    'typescript/consistent-type-imports': 'error',
    'typescript/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    'typescript/no-inferrable-types': 'error',
    'typescript/prefer-for-of': 'error',
    'typescript/prefer-function-type': 'error',
    'typescript/prefer-optional-chain': 'error',
    'typescript/prefer-reduce-type-parameter': 'error',
    'typescript/prefer-return-this-type': 'error',
  },
});
