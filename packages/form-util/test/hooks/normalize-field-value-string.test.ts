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

  it('returns empty string for null input', () => {
    expect(normalizeFieldValueString(null)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(normalizeFieldValueString(undefined)).toBe('');
  });

  it('throws FormTypeError for number input', () => {
    expect(() => normalizeFieldValueString(42 as never)).toThrow(FormTypeError);
  });

  it('throws FormTypeError for object input', () => {
    expect(() => normalizeFieldValueString({} as never)).toThrow(FormTypeError);
  });
});
