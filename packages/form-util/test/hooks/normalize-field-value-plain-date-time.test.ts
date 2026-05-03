import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValuePlainDateTime } from '#src/hooks/normalize-field-value-plain-date-time';

const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

describe('normalizeFieldValuePlainDateTime', () => {
  it('passes a Temporal.PlainDateTime through unchanged', () => {
    expect(normalizeFieldValuePlainDateTime(aPlainDateTime)).toBe(aPlainDateTime);
  });

  it('converts a Temporal.ZonedDateTime to Temporal.PlainDateTime', () => {
    const result = normalizeFieldValuePlainDateTime(aZonedDateTime);
    expect(result).toEqual(aZonedDateTime.toPlainDateTime());
    expect(result).toBeInstanceOf(Temporal.PlainDateTime);
  });

  it('returns null for null input', () => {
    expect(normalizeFieldValuePlainDateTime(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(normalizeFieldValuePlainDateTime(undefined)).toBeNull();
  });

  it('throws FormTypeError for Temporal.PlainDate input', () => {
    expect(() => normalizeFieldValuePlainDateTime(aPlainDate as never)).toThrow(FormTypeError);
  });
});
