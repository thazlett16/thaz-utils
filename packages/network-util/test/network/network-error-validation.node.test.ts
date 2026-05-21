import { StandardSchemaError } from '@ts-rest/core';
import { describe, expect, test } from 'vite-plus/test';

import { isNetworkValidationError } from '#src/network/network-error-validation';

describe('isNetworkValidationError', () => {
  test('returns true for StandardSchemaError', () => {
    const error = new StandardSchemaError([{ message: 'invalid' }]);
    expect(isNetworkValidationError(error)).toBeTruthy();
  });

  test('returns false for plain Error', () => {
    expect(isNetworkValidationError(new Error('oops'))).toBeFalsy();
  });

  test('returns false for null', () => {
    expect(isNetworkValidationError(null)).toBeFalsy();
  });

  test('returns false for undefined', () => {
    expect(isNetworkValidationError(undefined)).toBeFalsy();
  });

  test('returns false for plain object', () => {
    expect(isNetworkValidationError({ message: 'oops' })).toBeFalsy();
  });

  test('returns false for string', () => {
    expect(isNetworkValidationError('error')).toBeFalsy();
  });
});
