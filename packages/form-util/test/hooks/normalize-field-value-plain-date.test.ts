import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValuePlainDate } from '#src/hooks/normalize-field-value-plain-date';

const aPlainDate = Temporal.PlainDate.from('2024-06-15');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const anInstant = Temporal.Instant.from('2024-06-15T12:00:00Z');

describe('normalizeFieldValuePlainDate', () => {
  it('passes a Temporal.PlainDate through unchanged', () => {
    expect(normalizeFieldValuePlainDate(aPlainDate)).toBe(aPlainDate);
  });

  it('converts a Temporal.ZonedDateTime to Temporal.PlainDate', () => {
    const result = normalizeFieldValuePlainDate(aZonedDateTime);
    expect(result).toEqual(aZonedDateTime.toPlainDate());
    expect(result).toBeInstanceOf(Temporal.PlainDate);
  });

  it('converts a Temporal.PlainDateTime to Temporal.PlainDate', () => {
    const result = normalizeFieldValuePlainDate(aPlainDateTime);
    expect(result).toEqual(aPlainDateTime.toPlainDate());
    expect(result).toBeInstanceOf(Temporal.PlainDate);
  });

  it('returns null for null input', () => {
    expect(normalizeFieldValuePlainDate(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(normalizeFieldValuePlainDate(undefined)).toBeNull();
  });

  it('throws FormTypeError for string input', () => {
    expect(() => normalizeFieldValuePlainDate('2024-06-15' as never)).toThrow(FormTypeError);
  });

  it('throws FormTypeError for Temporal.Instant input', () => {
    expect(() => normalizeFieldValuePlainDate(anInstant as never)).toThrow(FormTypeError);
  });
});
