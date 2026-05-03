import { describe, expect, it } from 'vitest';

import { normalizeFieldValueString } from '#src/hooks/normalize-field-value-string';

describe('normalizeFieldValueString', () => {
  it('returns a string value unchanged', () => {
    expect(normalizeFieldValueString('hello')).toBe('hello');
  });

  it('returns an empty string unchanged', () => {
    expect(normalizeFieldValueString('')).toBe('');
  });

  it('returns undefined for null input (does not throw)', () => {
    expect(normalizeFieldValueString(null)).toBeUndefined();
  });

  it('returns undefined for undefined input (does not throw)', () => {
    expect(normalizeFieldValueString(undefined)).toBeUndefined();
  });
});
