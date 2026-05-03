import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueString } from '#src/hooks/normalize-field-value-string';

describe('normalizeFieldValueString', () => {
  it('returns a string value unchanged', () => {
    expect(normalizeFieldValueString('hello')).toBe('hello');
  });

  it('returns an empty string unchanged', () => {
    expect(normalizeFieldValueString('')).toBe('');
  });

  it('returns null for null input', () => {
    expect(normalizeFieldValueString(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(normalizeFieldValueString(undefined)).toBeNull();
  });

  it('throws FormTypeError for number input', () => {
    expect(() => normalizeFieldValueString(42 as never)).toThrow(FormTypeError);
  });

  it('throws FormTypeError for object input', () => {
    expect(() => normalizeFieldValueString({} as never)).toThrow(FormTypeError);
  });
});
