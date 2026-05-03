import { ZonedDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueZonedDateTime } from '#src/hooks/normalize-field-value-internationalized-zoned-date-time';

describe('normalizeFieldValueZonedDateTime', () => {
  it('converts a Temporal.ZonedDateTime (Chicago CDT, -05:00) to @intl ZonedDateTime with correct timezone and offset', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-05:00[America/Chicago]');
    const result = normalizeFieldValueZonedDateTime(value);
    expect(result).toBeInstanceOf(ZonedDateTime);
    expect(result?.timeZone).toBe('America/Chicago');
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
    expect(result?.hour).toBe(12);
    expect(result?.offset).toBe(-5 * 3600 * 1000);
  });

  it('passes an @internationalized/date ZonedDateTime through unchanged', () => {
    const value = parseZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]');
    expect(normalizeFieldValueZonedDateTime(value)).toBe(value);
  });

  it('returns undefined for null input', () => {
    expect(normalizeFieldValueZonedDateTime(null)).toBeUndefined();
  });

  it('throws FormTypeError for string input', () => {
    expect(() => normalizeFieldValueZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]' as never)).toThrow(
      FormTypeError,
    );
  });

  it('throws FormTypeError for a Temporal.PlainDate input', () => {
    const value = Temporal.PlainDate.from('2024-06-15');
    expect(() => normalizeFieldValueZonedDateTime(value as never)).toThrow(FormTypeError);
  });
});
