import { describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueNumber } from '#src/hooks/normalize-field-value-number';

describe('normalizeFieldValueNumber', () => {
  test('returns a number value unchanged', () => {
    expect(normalizeFieldValueNumber(42)).toBe(42);
  });

  test('returns 0 unchanged', () => {
    expect(normalizeFieldValueNumber(0)).toBe(0);
  });

  test('returns NaN (NaN is typeof number)', () => {
    expect(normalizeFieldValueNumber(Number.NaN)).toBeNaN();
  });

  test('returns Infinity (typeof number)', () => {
    expect(normalizeFieldValueNumber(Infinity)).toBe(Infinity);
  });

  test('returns undefined for null input', () => {
    expect(normalizeFieldValueNumber(null)).toBeUndefined();
  });

  test('returns undefined for undefined input', () => {
    expect(normalizeFieldValueNumber(undefined)).toBeUndefined();
  });

  test('throws FormTypeError for string input', () => {
    expect(() => normalizeFieldValueNumber('42' as never)).toThrow(FormTypeError);
  });
});
