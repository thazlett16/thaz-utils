import { CalendarDate, CalendarDateTime, Time, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueTime } from '#src/hooks/normalize-field-value-internationalized-time';

describe('normalizeFieldValueTime', () => {
  it('converts a Temporal.ZonedDateTime to Time', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-15T12:30:45-05:00[America/Chicago]');
    const result = normalizeFieldValueTime(value);
    expect(result).toBeInstanceOf(Time);
    expect(result?.hour).toBe(12);
    expect(result?.minute).toBe(30);
    expect(result?.second).toBe(45);
  });

  it('converts a Temporal.PlainDateTime to Time', () => {
    const value = Temporal.PlainDateTime.from('2024-06-15T09:30:45');
    const result = normalizeFieldValueTime(value);
    expect(result).toBeInstanceOf(Time);
    expect(result?.hour).toBe(9);
    expect(result?.minute).toBe(30);
    expect(result?.second).toBe(45);
  });

  it('converts a Temporal.PlainTime to Time', () => {
    const value = Temporal.PlainTime.from('14:15:30');
    const result = normalizeFieldValueTime(value);
    expect(result).toBeInstanceOf(Time);
    expect(result?.hour).toBe(14);
    expect(result?.minute).toBe(15);
    expect(result?.second).toBe(30);
  });

  it('converts an @internationalized/date ZonedDateTime to Time', () => {
    const value = parseZonedDateTime('2024-06-15T12:30:45-05:00[America/Chicago]');
    const result = normalizeFieldValueTime(value);
    expect(result).toBeInstanceOf(Time);
    expect(result?.hour).toBe(12);
    expect(result?.minute).toBe(30);
    expect(result?.second).toBe(45);
  });

  it('converts an @internationalized/date CalendarDateTime to Time', () => {
    const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45);
    const result = normalizeFieldValueTime(value);
    expect(result).toBeInstanceOf(Time);
    expect(result?.hour).toBe(9);
    expect(result?.minute).toBe(30);
    expect(result?.second).toBe(45);
  });

  it('passes a Time through unchanged', () => {
    const value = new Time(14, 15, 30);
    expect(normalizeFieldValueTime(value)).toBe(value);
  });

  it('returns undefined for null input', () => {
    expect(normalizeFieldValueTime(null)).toBeUndefined();
  });

  it('throws FormTypeError for a CalendarDate input', () => {
    const value = new CalendarDate('gregory', 2024, 6, 15);
    expect(() => normalizeFieldValueTime(value as never)).toThrow(FormTypeError);
  });
});
