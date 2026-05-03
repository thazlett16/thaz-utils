import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueInstant } from '#src/hooks/normalize-field-value-instant';

const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

describe('normalizeFieldValueInstant', () => {
  it('passes a Temporal.Instant through unchanged', () => {
    expect(normalizeFieldValueInstant(anInstant)).toBe(anInstant);
  });

  it('converts a Temporal.ZonedDateTime to Temporal.Instant via toInstant()', () => {
    const result = normalizeFieldValueInstant(aZonedDateTime);
    expect(result).toEqual(aZonedDateTime.toInstant());
    expect(result).toBeInstanceOf(Temporal.Instant);
  });

  it('returns null for null input', () => {
    expect(normalizeFieldValueInstant(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(normalizeFieldValueInstant(undefined)).toBeNull();
  });

  it('throws FormTypeError for string input', () => {
    expect(() => normalizeFieldValueInstant('2024-06-15T12:00:00Z' as never)).toThrow(FormTypeError);
  });

  it('throws FormTypeError for Temporal.PlainDate input', () => {
    expect(() => normalizeFieldValueInstant(aPlainDate as never)).toThrow(FormTypeError);
  });
});
