import { CalendarDate, CalendarDateTime, parseZonedDateTime } from '@internationalized/date';
import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, test } from 'vite-plus/test';

import { FormTypeError } from '#src/error';
import { normalizeFieldValueCalendarDate } from '#src/hooks/normalize-field-value-internationalized-calendar-date';

describe('normalizeFieldValueCalendarDate', () => {
  test('converts a Temporal.ZonedDateTime (Chicago CDT) to CalendarDate with correct year/month/day', () => {
    const value = Temporal.ZonedDateTime.from('2024-06-15T12:00:00-05:00[America/Chicago]');
    const result = normalizeFieldValueCalendarDate(value);
    expect(result).toBeInstanceOf(CalendarDate);
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
  });

  test('converts a Temporal.PlainDateTime to CalendarDate with correct date components', () => {
    const value = Temporal.PlainDateTime.from('2024-06-15T09:30:45');
    const result = normalizeFieldValueCalendarDate(value);
    expect(result).toBeInstanceOf(CalendarDate);
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
  });

  test('converts a Temporal.PlainDate to CalendarDate', () => {
    const value = Temporal.PlainDate.from('2024-06-15');
    const result = normalizeFieldValueCalendarDate(value);
    expect(result).toBeInstanceOf(CalendarDate);
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
  });

  test('converts an @internationalized/date ZonedDateTime to CalendarDate', () => {
    const value = parseZonedDateTime('2024-06-15T12:00:00-05:00[America/Chicago]');
    const result = normalizeFieldValueCalendarDate(value);
    expect(result).toBeInstanceOf(CalendarDate);
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
  });

  test('converts an @internationalized/date CalendarDateTime to CalendarDate', () => {
    const value = new CalendarDateTime('gregory', 2024, 6, 15, 9, 30, 45);
    const result = normalizeFieldValueCalendarDate(value);
    expect(result).toBeInstanceOf(CalendarDate);
    expect(result?.year).toBe(2024);
    expect(result?.month).toBe(6);
    expect(result?.day).toBe(15);
  });

  test('passes a CalendarDate through unchanged', () => {
    const value = new CalendarDate('gregory', 2024, 6, 15);
    expect(normalizeFieldValueCalendarDate(value)).toBe(value);
  });

  test('returns undefined for null input', () => {
    expect(normalizeFieldValueCalendarDate(null)).toBeUndefined();
  });

  test('returns undefined for undefined input', () => {
    expect(normalizeFieldValueCalendarDate(undefined)).toBeUndefined();
  });

  test('throws FormTypeError for number input', () => {
    expect(() => normalizeFieldValueCalendarDate(42 as never)).toThrow(FormTypeError);
  });
});
