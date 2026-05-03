import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueNumber } from '#src/hooks/normalize-field-value-number';

describe('normalizeFieldValueNumber', () => {
  it('returns a number value unchanged', () => {
    expect(normalizeFieldValueNumber(42)).toBe(42);
  });

  it('returns 0 unchanged', () => {
    expect(normalizeFieldValueNumber(0)).toBe(0);
  });

  it('returns NaN (NaN is typeof number)', () => {
    expect(normalizeFieldValueNumber(NaN)).toBeNaN();
  });

  it('returns Infinity (typeof number)', () => {
    expect(normalizeFieldValueNumber(Infinity)).toBe(Infinity);
  });

  it('returns undefined for null input', () => {
    expect(normalizeFieldValueNumber(null)).toBeUndefined();
  });

  it('returns undefined for undefined input', () => {
    expect(normalizeFieldValueNumber(undefined)).toBeUndefined();
  });

  it('throws FormTypeError for string input', () => {
    expect(() => normalizeFieldValueNumber('42' as never)).toThrow(FormTypeError);
  });
});
