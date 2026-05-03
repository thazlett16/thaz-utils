import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValuePlainTime } from '#src/hooks/normalize-field-value-plain-time';

const aPlainTime = Temporal.PlainTime.from('12:00:00');
const aPlainDateTime = Temporal.PlainDateTime.from('2024-06-15T12:00:00');
const aZonedDateTime = Temporal.ZonedDateTime.from('2024-06-15T12:00:00+00:00[UTC]');
const aPlainDate = Temporal.PlainDate.from('2024-06-15');

describe('normalizeFieldValuePlainTime', () => {
  it('passes a Temporal.PlainTime through unchanged', () => {
    expect(normalizeFieldValuePlainTime(aPlainTime)).toBe(aPlainTime);
  });

  it('converts a Temporal.ZonedDateTime to Temporal.PlainTime', () => {
    const result = normalizeFieldValuePlainTime(aZonedDateTime);
    expect(result).toEqual(aZonedDateTime.toPlainTime());
    expect(result).toBeInstanceOf(Temporal.PlainTime);
  });

  it('converts a Temporal.PlainDateTime to Temporal.PlainTime', () => {
    const result = normalizeFieldValuePlainTime(aPlainDateTime);
    expect(result).toEqual(aPlainDateTime.toPlainTime());
    expect(result).toBeInstanceOf(Temporal.PlainTime);
  });

  it('returns null for null input', () => {
    expect(normalizeFieldValuePlainTime(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(normalizeFieldValuePlainTime(undefined)).toBeNull();
  });

  it('throws FormTypeError for Temporal.PlainDate input', () => {
    expect(() => normalizeFieldValuePlainTime(aPlainDate as never)).toThrow(FormTypeError);
  });
});
