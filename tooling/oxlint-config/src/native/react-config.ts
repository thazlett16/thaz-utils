import { defineConfig } from 'oxlint';

import { baseConfig } from '#src/base-config';

export const reactConfig = defineConfig({
  ...baseConfig,
  plugins: ['react', 'react-perf'],
  rules: {
    // Correctness Rules
    'react/no-children-prop': 'off',

    // Suspicious Rules
    'react/react-in-jsx-scope': 'off',

    // Perf Rules
    'react-perf/jsx-no-jsx-as-prop': 'off',
    'react-perf/jsx-no-new-array-as-prop': 'off',
    'react-perf/jsx-no-new-function-as-prop': 'off',
    'react-perf/jsx-no-new-object-as-prop': 'off',

    // Restriction Rules
    'react/button-has-type': 'error',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx'],
      },
    ],
    'react/no-danger': 'error',
    'react/no-unknown-property': 'error',
    'react/only-export-components': 'error',

    // Pedantic Rules
    'react/checked-requires-onchange-or-readonly': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/no-unescaped-entities': 'error',
    'react/rules-of-hooks': 'error',

    // Style Rules
    'react/jsx-fragments': 'error',
    'react/jsx-pascal-case': 'error',
    'react/self-closing-comp': 'error',
  },
});
