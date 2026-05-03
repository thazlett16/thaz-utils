import { CalendarDate, CalendarDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueCalendarDateTime } from '#src/hooks/normalize-field-value-internationalized-calendar-date-time';

describe('normalizeFieldValueCalendarDateTime', () => {
  it('converts a Temporal.ZonedDateTime to CalendarDateTime', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-15T12:30:45-05:00[America/Chicago]');
    const result = normalizeFieldValueCalendarDateTime(value);
    expect(result).toBeInstanceOf(CalendarDateTime);
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
    expect(result?.hour).toBe(12);
    expect(result?.minute).toBe(30);
    expect(result?.second).toBe(45);
  });

  it('converts a Temporal.PlainDateTime to CalendarDateTime', () => {
    const value = Temporal.PlainDateTime.from('2024-06-15T09:30:45');
    const result = normalizeFieldValueCalendarDateTime(value);
    expect(result).toBeInstanceOf(CalendarDateTime);
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
    expect(result?.hour).toBe(9);
    expect(result?.minute).toBe(30);
    expect(result?.second).toBe(45);
  });

  it('converts an @internationalized/date ZonedDateTime to CalendarDateTime', () => {
    const value = parseZonedDateTime('2024-06-15T12:30:45-05:00[America/Chicago]');
    const result = normalizeFieldValueCalendarDateTime(value);
    expect(result).toBeInstanceOf(CalendarDateTime);
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
    expect(result?.hour).toBe(12);
    expect(result?.minute).toBe(30);
    expect(result?.second).toBe(45);
  });

  it('passes a CalendarDateTime through unchanged', () => {
    const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45);
    expect(normalizeFieldValueCalendarDateTime(value)).toBe(value);
  });

  it('returns undefined for null input', () => {
    expect(normalizeFieldValueCalendarDateTime(null)).toBeUndefined();
  });

  it('throws FormTypeError for a CalendarDate input', () => {
    const value = new CalendarDate('gregory', 2024, 6, 15);
    expect(() => normalizeFieldValueCalendarDateTime(value as never)).toThrow(FormTypeError);
  });
});
