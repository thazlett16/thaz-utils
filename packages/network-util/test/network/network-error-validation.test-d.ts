import type { StandardSchemaError } from '@ts-rest/core';
import { describe, expectTypeOf, test } from 'vite-plus/test';

import { isNetworkValidationError } from '#src/network/network-error-validation';

describe('isNetworkValidationError', () => {
  test('is a type guard narrowing to StandardSchemaError', () => {
    const unknown: unknown = null;
    if (isNetworkValidationError(unknown)) {
      expectTypeOf(unknown).toEqualTypeOf<StandardSchemaError>();
    }
  });

  test('return type is boolean', () => {
    expectTypeOf(isNetworkValidationError).returns.toEqualTypeOf<boolean>();
  });
});
